# SELLER COMMUNICATION PLATFORMS INTEGRATION GUIDE

## Overview
Integrate your e-commerce platform with WhatsApp, Instagram, Twitter, and Facebook to allow seamless customer communication.

---

## 1. WHATSAPP BUSINESS API

### Setup Steps
1. **Create WhatsApp Business Account**
   - Visit: https://www.whatsapp.com/business/
   - Sign up with your business details
   - Get approved by WhatsApp (can take 24-48 hours)

2. **Get API Credentials**
   - Phone Number ID
   - Business Account ID
   - Access Token
   - Webhook Verify Token

3. **Configure Webhook**
   - Endpoint: `https://yoursite.com/api/webhooks/whatsapp`
   - Verify token will be used by WhatsApp to confirm your webhook

### Features to Implement
- [ ] Send order confirmations via WhatsApp
- [ ] Send shipping updates
- [ ] Receive customer inquiries
- [ ] Send promotional messages
- [ ] Automated replies/chatbot
- [ ] Media sharing (invoices, receipts)

### API Endpoints
```
Send Message:
POST /v16.0/{phone_number_id}/messages

Get Webhook Events:
POST https://yoursite.com/api/webhooks/whatsapp
(WhatsApp will POST incoming messages here)
```

### Libraries/SDKs
- Official: Meta/WhatsApp Business API
- NPM: `whatsapp-web.js` or `twilio` (for Twilio WhatsApp integration)

### Cost
- Charges based on messages sent (~$0.001-$0.005 per message)

### Resources
- https://developers.facebook.com/docs/whatsapp/cloud-api
- https://developers.facebook.com/docs/whatsapp/webhooks

---

## 2. INSTAGRAM BUSINESS

### Setup Steps
1. **Convert Account to Business Account**
   - Go to Settings > Account Type and Labels
   - Switch to Business Account

2. **Link to Meta Business Suite**
   - Create/Use Meta Business Account
   - Connect your Instagram Business Account
   - Generate Access Token

3. **Get Credentials**
   - Instagram Business Account ID
   - Access Token
   - User Endpoint

### Features to Implement
- [ ] Direct Messages with customers
- [ ] Automated responses
- [ ] Link products in messages
- [ ] View customer inquiries
- [ ] Branded messages

### API Endpoints
```
Send DM:
POST /v16.0/{ig_business_account_id}/messages

Webhook for incoming messages:
POST https://yoursite.com/api/webhooks/instagram
```

### Libraries/SDKs
- Official: Meta Graph API
- NPM: `instagram-api` or use REST API directly

### Cost
- Free for standard features
- Branded Messages have costs

### Resources
- https://developers.facebook.com/docs/instagram-api
- https://developers.facebook.com/docs/instagram-messaging-api

---

## 3. TWITTER/X API

### Setup Steps
1. **Create Twitter Developer Account**
   - Go to: https://developer.twitter.com/
   - Apply for developer access
   - Wait for approval

2. **Create Application**
   - Create new app in Developer Portal
   - Generate API Keys:
     - API Key (Consumer Key)
     - API Secret Key
     - Access Token
     - Access Token Secret
   - Enable Read & Write permissions

### Features to Implement
- [ ] Monitor mentions of your brand
- [ ] Direct Messages with customers
- [ ] Post promotional content
- [ ] Handle customer inquiries
- [ ] Automated responses

### API Endpoints
```
Post Tweet:
POST /2/tweets

Send DM:
POST /2/dm_conversations/with/{participant_id}/messages

Stream Mentions:
GET /2/tweets/search/stream
```

### Libraries/SDKs
- Official: Twitter API v2
- NPM: `twitter-api-v2`, `tweepy` (Python)

### Cost
- Free tier available (limited requests)
- Premium plans for higher limits

### Resources
- https://developer.twitter.com/en/docs
- https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/integrate/write-tweets

---

## 4. FACEBOOK MESSENGER / META BUSINESS

### Setup Steps
1. **Create Facebook Business Page**
   - If not already created
   - Get Page ID

2. **Create Meta Business Account**
   - Create/Use Meta Business Account
   - Add your Facebook Page
   - Generate Page Access Token

3. **Get Credentials**
   - Page ID
   - Page Access Token
   - App ID
   - App Secret
   - Verify Token (create yourself)

4. **Setup Webhook**
   - Endpoint: `https://yoursite.com/api/webhooks/facebook`
   - Verify token

### Features to Implement
- [ ] Receive messages from Facebook Inbox
- [ ] Send Messenger messages
- [ ] Automated greeting
- [ ] Handle customer inquiries
- [ ] Chatbot integration
- [ ] Click-to-Messenger ads

### API Endpoints
```
Send Message:
POST /v16.0/{page_id}/messages

Webhook for incoming messages:
POST https://yoursite.com/api/webhooks/facebook

Get Conversations:
GET /v16.0/{page_id}/conversations
```

### Libraries/SDKs
- Official: Meta Graph API
- NPM: `fb`, `messaging-api-messenger`

### Cost
- Free for standard messaging
- Premium features may have costs

### Resources
- https://developers.facebook.com/docs/messenger-platform
- https://developers.facebook.com/docs/facebook-api

---

## IMPLEMENTATION CHECKLIST

### Backend Implementation
- [ ] Create communication service files for each platform
- [ ] Setup webhook endpoints for each platform
- [ ] Store API credentials securely in environment variables
- [ ] Implement message queuing system (Bull, RabbitMQ)
- [ ] Create database tables for message history
- [ ] Setup error handling and retry logic
- [ ] Implement rate limiting
- [ ] Create admin panel to manage communication settings

### Frontend Implementation
- [ ] Add configuration page for admin to set API credentials
- [ ] Display seller contact options on product pages
- [ ] Show WhatsApp, Instagram, Twitter, Facebook icons/links
- [ ] Create chat interface (optional for real-time support)
- [ ] Display seller response SLA info

### Testing
- [ ] Test each platform's API with sandbox/test credentials
- [ ] Send test messages
- [ ] Verify webhook endpoints
- [ ] Test error scenarios
- [ ] Load testing for message handling

### Database Schema
```sql
CREATE TABLE seller_communications (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'whatsapp', 'instagram', 'twitter', 'facebook'
    account_handle VARCHAR(255),
    api_key TEXT,
    api_secret TEXT,
    access_token TEXT,
    webhook_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL,
    customer_id INT NOT NULL,
    platform VARCHAR(50),
    message_text TEXT,
    message_type VARCHAR(50), -- 'text', 'image', 'file'
    direction VARCHAR(50), -- 'sent', 'received'
    status VARCHAR(50), -- 'pending', 'sent', 'delivered', 'read'
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES users(id)
);
```

---

## BEST PRACTICES

1. **Security**
   - Never hardcode API keys in code
   - Use environment variables
   - Validate webhook signatures
   - Encrypt sensitive data in database

2. **Message Handling**
   - Implement idempotency to avoid duplicate messages
   - Use message queues for reliable delivery
   - Log all messages for compliance
   - Implement rate limiting

3. **Customer Experience**
   - Set auto-replies with expected response time
   - Use message templates for common responses
   - Integrate with order system for automated updates
   - Maintain conversation context

4. **Compliance**
   - Follow each platform's terms of service
   - Don't spam customers
   - Respect opt-in/opt-out preferences
   - Comply with GDPR/privacy laws

5. **Analytics**
   - Track response times
   - Monitor message delivery rates
   - Measure customer satisfaction
   - Analyze common inquiries

---

## SAMPLE API IMPLEMENTATION STRUCTURE

### Backend Service Example (Node.js)

```javascript
// services/communicationService.js

class WhatsAppService {
  async sendMessage(phoneNumber, message) {
    const url = `https://graph.instagram.com/v16.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: { body: message }
    };
    // Make API call...
  }
  
  async handleIncomingMessage(event) {
    // Process incoming message from webhook
  }
}

class InstagramService {
  async sendDM(recipientId, message) {
    // Send Instagram direct message
  }
  
  async handleIncomingDM(event) {
    // Process incoming DM
  }
}

// Similar for Twitter and Facebook...

module.exports = { WhatsAppService, InstagramService, /* ... */ };
```

---

## MIGRATION PATH

**Week 13-14 Timeline:**

1. **Day 1-2**: Setup all API credentials
2. **Day 3-4**: Implement WhatsApp integration
3. **Day 5-6**: Implement Instagram integration
4. **Day 7-8**: Implement Twitter integration
5. **Day 9-10**: Implement Facebook integration
6. **Day 11-12**: Test all platforms
7. **Day 13-14**: Deploy and monitor

---

## TROUBLESHOOTING

### Common Issues
- **401 Unauthorized**: Check access token validity and expiration
- **Webhook not receiving**: Verify endpoint is publicly accessible
- **Messages not sending**: Check phone number format and account balance
- **Rate limiting**: Implement exponential backoff and message queuing

---

## SUPPORT & DOCUMENTATION

- **WhatsApp**: https://www.whatsapp.com/business/api
- **Instagram**: https://developers.facebook.com/docs/instagram-api
- **Twitter**: https://developer.twitter.com
- **Facebook**: https://developers.facebook.com/docs/messenger-platform
