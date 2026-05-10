const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');

// M-Pesa Configuration
const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke'; // Use sandbox for testing, production: https://api.safaricom.co.ke
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// Store access tokens with expiration
let accessTokenCache = {
  token: null,
  expires: 0
};

/**
 * Get M-Pesa Access Token
 * Required for all M-Pesa API calls
 */
const getAccessToken = async () => {
  try {
    // Check if cached token is still valid
    if (accessTokenCache.token && accessTokenCache.expires > Date.now()) {
      return accessTokenCache.token;
    }

    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    const token = response.data.access_token;
    const expires = Date.now() + (response.data.expires_in * 1000) - 30000; // Refresh 30s before expiry

    accessTokenCache = { token, expires };
    console.log('✓ M-Pesa Access Token Generated');
    
    return token;
  } catch (error) {
    console.error('✗ M-Pesa Auth Error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with M-Pesa');
  }
};

/**
 * STK Push - Initiate M-Pesa payment prompt
 * POST /api/mpesa/stk-push
 * Body: { phone, amount, orderId, reference }
 */
router.post('/stk-push', async (req, res) => {
  try {
    const { phone, amount, orderId, reference } = req.body;

    if (!phone || !amount || !orderId) {
      return res.status(400).json({ error: 'Missing required fields: phone, amount, orderId' });
    }

    // Validate phone number format (254XXXXXXXXX)
    const formattedPhone = phone.startsWith('254') 
      ? phone 
      : '254' + phone.replace(/^0/, '');

    if (!/^254\d{9}$/.test(formattedPhone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[:-]/g, '').slice(0, -5);
    
    // Create password for STK Push
    const dataToEncode = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`;
    const password = Buffer.from(dataToEncode).toString('base64');

    const stkPushUrl = `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`;

    const stkPushPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: reference || `ORD-${orderId.slice(-6)}`,
      TransactionDesc: `Payment for order ${reference || orderId}`
    };

    const stkPushResponse = await axios.post(stkPushUrl, stkPushPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✓ STK Push initiated:', stkPushResponse.data);

    // Update order with M-Pesa request ID
    await Order.findByIdAndUpdate(
      orderId,
      { 
        mpesaCheckoutRequestId: stkPushResponse.data.CheckoutRequestID,
        paymentStatus: 'pending'
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Payment prompt sent to customer',
      requestId: stkPushResponse.data.CheckoutRequestID,
      responseCode: stkPushResponse.data.ResponseCode
    });

  } catch (error) {
    console.error('✗ STK Push Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to initiate payment',
      details: error.message 
    });
  }
});

/**
 * M-Pesa Payment Callback
 * POST /api/mpesa/callback
 * Verify payment and update order status
 */
router.post('/callback', async (req, res) => {
  try {
    const callbackData = req.body.Body?.stkCallback;
    
    if (!callbackData) {
      console.warn('⚠ Invalid callback format');
      return res.json({ ResultCode: 1, ResultDesc: 'Invalid format' });
    }

    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = callbackData;
    
    console.log(`\n📱 M-Pesa Callback Received - Result Code: ${ResultCode}`);
    console.log(`   Request ID: ${CheckoutRequestID}`);

    // Find order by M-Pesa request ID
    const order = await Order.findOne({ mpesaCheckoutRequestId: CheckoutRequestID });

    if (!order) {
      console.warn('⚠ Order not found for request ID:', CheckoutRequestID);
      return res.json({ ResultCode: 1, ResultDesc: 'Order not found' });
    }

    if (ResultCode === 0) {
      // Payment successful
      console.log('✓ Payment successful for order:', order.orderNumber);
      
      // Extract payment details from callback
      const metadata = {};
      if (CallbackMetadata?.Item) {
        CallbackMetadata.Item.forEach(item => {
          metadata[item.Name] = item.Value;
        });
      }

      // Update order with payment confirmation
      const updatedOrder = await Order.findByIdAndUpdate(
        order._id,
        {
          paymentStatus: 'paid',
          mpesaTransactionId: metadata.MpesaReceiptNumber,
          mpesaPhone: metadata.PhoneNumber,
          status: 'processing', // Move to processing after payment
          updatedAt: new Date(),
          $push: {
            paymentHistory: {
              status: 'completed',
              amount: order.totalAmount,
              method: 'mpesa',
              transactionId: metadata.MpesaReceiptNumber,
              timestamp: new Date()
            }
          }
        },
        { new: true }
      );

      // Send payment confirmation email
      const { sendEmail } = require('../services/emailService');
      if (process.env.SENDGRID_API_KEY && updatedOrder.customerEmail) {
        await sendEmail('orderStatusUpdate', [updatedOrder, updatedOrder.customerEmail]);
      }

    } else {
      // Payment failed or cancelled
      console.log('✗ Payment failed for order:', order.orderNumber);
      
      await Order.findByIdAndUpdate(
        order._id,
        {
          paymentStatus: 'failed',
          status: 'pending-payment',
          updatedAt: new Date(),
          $push: {
            paymentHistory: {
              status: 'failed',
              amount: order.totalAmount,
              method: 'mpesa',
              reason: ResultDesc,
              timestamp: new Date()
            }
          }
        }
      );
    }

    // Always respond with success to M-Pesa to confirm receipt
    res.json({ ResultCode: 0, ResultDesc: 'Callback processed' });

  } catch (error) {
    console.error('✗ Callback Processing Error:', error.message);
    res.json({ ResultCode: 1, ResultDesc: 'Processing error' });
  }
});

/**
 * Query Payment Status
 * GET /api/mpesa/query/:checkoutRequestId
 * Check payment status after STK Push
 */
router.get('/query/:checkoutRequestId', async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[:-]/g, '').slice(0, -5);
    
    const dataToEncode = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`;
    const password = Buffer.from(dataToEncode).toString('base64');

    const queryUrl = `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`;

    const queryPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const queryResponse = await axios.post(queryUrl, queryPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = queryResponse.data;
    
    res.json({
      success: true,
      resultCode: result.ResultCode,
      resultDesc: result.ResultDesc,
      responseDescription: result.ResponseDescription,
      checkoutRequestId: result.CheckoutRequestID
    });

  } catch (error) {
    console.error('✗ Query Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to query payment status',
      details: error.message 
    });
  }
});

module.exports = router;