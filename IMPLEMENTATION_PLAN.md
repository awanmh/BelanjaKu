# 🛍️ BelanjaKu - Zalora Style Implementation Plan

## ✅ Completed Features
- [x] Basic product listing
- [x] Categories (Wanita, Pria, Sport, Anak)
- [x] Flash Sale section
- [x] Navigation & Layout

## 🚀 Implementation Roadmap

### Phase 1: Backend API Enhancement
- [ ] Cart Model & Migration (with size field)
- [ ] Cart API endpoints (GET, POST, PATCH, DELETE)
- [ ] Search API endpoint
- [ ] Order Model & API
- [ ] Size validation logic

### Phase 2: Product Detail Page
- [ ] Product detail component with image gallery
- [ ] Size selector (shoes: 38-44, clothes: S-XL)
- [ ] Add to cart functionality
- [ ] Product recommendations section
- [ ] Rating display (dummy)

### Phase 3: Search Functionality
- [ ] SearchBar component with auto-suggest
- [ ] Search results page
- [ ] Search API integration

### Phase 4: Shopping Cart
- [ ] Cart page with Zalora-style layout
- [ ] Quantity selector (+/-)
- [ ] Remove item functionality
- [ ] Price summary (Subtotal, Shipping, Total)
- [ ] Cart state management

### Phase 5: Checkout Flow
- [ ] Checkout page
- [ ] Address form (dummy)
- [ ] Payment method selector
- [ ] Order summary
- [ ] Create order API integration
- [ ] Clear cart after checkout

### Phase 6: Polish & Testing
- [ ] Responsive design verification
- [ ] Error handling
- [ ] Loading states
- [ ] Success/error notifications

## 📝 Technical Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Backend**: Node.js, Express, PostgreSQL, Sequelize
- **State**: Zustand
- **HTTP**: Axios

## 🎨 Design Reference
Following Zalora's minimalist, clean aesthetic with:
- Black & white color scheme
- Clean product cards
- Smooth transitions
- Mobile-first responsive design
