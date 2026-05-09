# UI DESIGN TEMPLATE - arwas_world

**Brand**: arwas_world | **Tagline**: Simply Elegant
**Aesthetic**: Clean | Minimalist | Professional | High-Impact Photography

---

## DESIGN SYSTEM

### Color Palette
```css
Primary Colors:
- Off-white: #F9F8F6
- Black: #1A1A1A
- Gray: #808080
- Accent: #D4AF37 (Optional gold for premium)

Text:
- Headings: #1A1A1A (Black)
- Body: #808080 (Gray)
- Light: #FFFFFF (White)
```

### Typography
```
Headings: 'Playfair Display' or 'Georgia' (serif, elegant)
Body: 'Inter' or 'Helvetica Neue' (clean, modern)
Font Sizes:
- H1: 56px (hero)
- H2: 42px (section titles)
- H3: 24px (product titles)
- Body: 16px
```

### Spacing
```
Padding: 16px, 24px, 32px, 48px
Gap: 16px, 24px, 32px
Border Radius: 0px (sharp corners - modern look)
```

---

## KEY UI COMPONENTS TO BUILD

### 1. NAVIGATION BAR
```
- Logo: arwas_world (left)
- Tagline: Simply Elegant (under logo)
- Search bar (center) - minimalist search icon
- Nav links: [LINK 1] | [LINK 2] | [LINK 3] | Account (right)
- Cart icon with badge
- Mobile hamburger menu
```

### 2. HERO SECTION
```
- Full-width background image (lifestyle photo)
- Large serif text overlay: [COLLECTION NAME]
- Subtitle: [COLLECTION TAGLINE]
- CTA button: Shop Now
- Height: 600-700px
```

### 3. PRODUCT GRID
```
- 4 columns (desktop)
- 2 columns (tablet)
- 1 column (mobile)
- No borders - clean cards
- Product image on hover → slight zoom effect
- Product info below: Name | Price | Size selector
```

### 4. PRODUCT CARD
```
- Image (400x500px)
- Product name (H3, black)
- Price (gray, 16px)
- Color/Size options (small dots or dropdowns)
- "Add to Cart" button on hover (fade in)
```

### 5. FEATURED COLLECTION BANNER
```
- 50/50 split: Image | Text
- Text: Collection name, description, "Shop now" link
- Image: Lifestyle photography
- Swap layout alternately
```

### 6. FOOTER
```
- 4 columns: About | Support | Shop | Follow
- Newsletter signup
- Social links
- Copyright
- Dark background (#1A1A1A)
- Light text (#F9F8F6)
```

---

## DESIGN PATTERNS FROM THE REFERENCE

✅ **Large Hero Section** - Dominates the fold with high-quality image
✅ **Product Grids** - 4 items per row, clean spacing
✅ **Multiple Collections** - Sections for different product lines
✅ **Lifestyle Photography** - Real models, real environments
✅ **Minimal Text** - Let the images speak
✅ **Clean Typography** - Mix of serif headers + sans-serif body
✅ **Hover Effects** - Subtle zoom on images
✅ **Size/Color Selectors** - Shown below each product
✅ **CTA Buttons** - "Shop Now", "View Collection"
✅ **White Space** - Lots of breathing room

---

## RESPONSIVE BREAKPOINTS

```css
Mobile: 320px - 767px
Tablet: 768px - 1023px
Desktop: 1024px - 1920px
Large: 1920px+
```

---

## PAGES TO BUILD (arwas_world)

1. **Home Page**
   - Navigation (arwas_world branding)
   - Hero banner with [COLLECTION NAME]
   - Featured collections (3-4) with [COLLECTION NAMES]
   - Newsletter signup
   - Footer

2. **Shop/Products Page**
   - Sidebar filters (category, price, size, color)
   - Product grid
   - Sort options
   - Pagination

3. **Product Detail Page**
   - Large product image carousel
   - Product info (name, price, description)
   - Size/color selector
   - Add to cart button
   - Related products
   - Reviews section

4. **Cart Page**
   - Cart items list
   - Quantity controls
   - Remove items
   - Subtotal | Tax | Shipping | Total
   - Checkout button
   - Continue shopping link

5. **Checkout Page**
   - Shipping address form
   - Billing address option
   - Shipping method selection
   - Order review
   - Payment information
   - Place order button

6. **Account Page**
   - Profile information
   - Order history
   - Saved addresses
   - Wishlist
   - Settings

7. **Admin Dashboard**
   - Product management
   - Order management
   - Analytics
   - Customer management
   - Communication settings

---

## INTERACTION PATTERNS

### Hover States
```
- Product image: Zoom 1.05x
- Product card: No background change (subtle)
- Buttons: Opacity 0.8 or slight background color
- Links: Underline appears
```

### Loading States
```
- Skeleton screens for product grids
- Loading spinner for forms
- Disabled buttons with grayed text
```

### Success States
```
- Green checkmark for added to cart
- Toast notification: "Added to cart"
- Form submission success message
```

### Error States
```
- Red text for error messages
- Form field border turns red
- Error icon + message
```

---

## ANIMATIONS

Keep animations subtle and professional:

```css
- Page transitions: 300ms fade
- Hover effects: 200ms ease
- Modal open: 200ms scale
- Slide in: 400ms ease-out
```

Avoid: Bounce effects, heavy animations, autoplay videos

---

## ACCESSIBILITY CHECKLIST

- [ ] Alt text on all images
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Keyboard navigation working
- [ ] Focus states visible
- [ ] Form labels properly associated
- [ ] Semantic HTML (nav, section, article, etc.)
- [ ] ARIA labels where needed
- [ ] Mobile-friendly touch targets (min 44px)
- [ ] Skip to content link
- [ ] Readable font sizes (min 16px on mobile)

---

## PERFORMANCE OPTIMIZATION

### Images
- Use WebP format with fallbacks
- Responsive images (srcset)
- Lazy loading
- Image compression
- CDN delivery

### CSS/JS
- Minify CSS
- Code splitting
- Remove unused CSS
- Defer non-critical JS

### Overall
- Page speed: < 3s
- Lighthouse score: > 90
- Core Web Vitals: Optimal

---

## REFERENCE ELEMENTS FROM ZANEROBE

1. **Hero Section**
   - Full height background image
   - Large serif text ("The Legacy Capsule")
   - Minimal overlay effect
   - Single CTA button

2. **Product Grid Layout**
   - 4 columns
   - Square/rectangular product images
   - Text below image
   - Size/color options visible

3. **Collection Sections**
   - Section title
   - Product grid
   - Divider line between sections
   - Multiple themed collections

4. **Product Card**
   - Product image (sharp, professional)
   - Product name
   - Price (right aligned or left)
   - Size options shown as dots or text

5. **Navigation**
   - Centered layout
   - Clean spacing
   - Sticky on scroll (optional)
   - Search functionality

---

## NEXT STEPS

1. **Create React Components**
   - Navbar
   - Hero
   - ProductCard
   - ProductGrid
   - Footer
   - etc.

2. **Setup Tailwind CSS**
   - Already recommended in PROJECT_STRUCTURE.md
   - Customize color palette
   - Create custom component classes

3. **Build Pages**
   - Home
   - Shop
   - ProductDetail
   - Cart
   - Checkout

4. **Add Functionality**
   - Product filtering
   - Add to cart
   - Image carousel
   - Search

5. **Images & Content**
   - Real product photos
   - Lifestyle photography
   - Product descriptions
   - Collections data

---

## FILE STRUCTURE FOR UI

```
frontend/src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── FeaturedCollection.jsx
│   ├── Newsletter.jsx
│   ├── Footer.jsx
│   └── ...
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Account.jsx
│   └── ...
├── styles/
│   ├── tailwind.css
│   ├── globals.css
│   └── components.css
├── assets/
│   ├── images/
│   ├── icons/
│   └── ...
└── App.jsx
```

---

## TAILWIND CSS SETUP

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js**
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#F9F8F6',
        'charcoal': '#1A1A1A',
        'gray-custom': '#808080',
        'gold': '#D4AF37',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': '56px',
        'h2': '42px',
        'h3': '24px',
      },
    },
  },
  plugins: [],
}
```

---

**KEY DESIGN PHILOSOPHY (arwas_world):**
"Simply Elegant - Let the products speak. Minimalist design with maximum impact."

Keep it clean, professional, and focused on showcasing beautiful clothing.
Every element should feel effortlessly elegant and purposeful.

