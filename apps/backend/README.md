# Backend Structure

📂 backend/
├── 📂 src/
│   │
│   ├── 📂 api/                   # Layer untuk routing, controller, dan validasi
│   │   └── 📂 v1/
│   │       ├── 📜 index.ts       # Menggabungkan semua router v1
│   │       │
│   │       ├── 📂 auth/
│   │       │   ├── 📜 auth.controller.ts
│   │       │   ├── 📜 auth.routes.ts
│   │       │   └── 📜 auth.validator.ts
│   │       │
│   │       ├── 📂 cart/
│   │       │   ├── 📜 cart.controller.ts
│   │       │   ├── 📜 cart.routes.ts
│   │       │   └── 📜 cart.validator.ts
│   │       │
│   │       ├── 📂 categories/
│   │       │   ├── 📜 category.controller.ts
│   │       │   ├── 📜 category.routes.ts
│   │       │   └── 📜 category.validator.ts
│   │       │
│   │       ├── 📂 notifications/  # (Baru) Notifikasi user
│   │       │   ├── 📜 notification.controller.ts
│   │       │   └── 📜 notification.routes.ts
│   │       │
│   │       ├── 📂 orders/
│   │       │   ├── 📜 order.controller.ts
│   │       │   ├── 📜 order.routes.ts
│   │       │   └── 📜 order.validator.ts
│   │       │
│   │       ├── 📂 payments/
│   │       │   ├── 📜 payment.controller.ts
│   │       │   ├── 📜 payment.routes.ts
│   │       │   └── 📜 payment.validator.ts
│   │       │
│   │       ├── 📂 product-discussions/ # (Baru) Diskusi/Q&A produk
│   │       │   ├── 📜 productDiscussion.controller.ts
│   │       │   └── 📜 productDiscussion.routes.ts
│   │       │
│   │       ├── 📂 products/
│   │       │   ├── 📜 product.controller.ts
│   │       │   ├── 📜 product.routes.ts
│   │       │   └── 📜 product.validator.ts
│   │       │
│   │       ├── 📂 promotions/
│   │       │   ├── 📜 promotion.controller.ts
│   │       │   ├── 📜 promotion.routes.ts
│   │       │   └── 📜 promotion.validator.ts
│   │       │
│   │       ├── 📂 reviews/
│   │       │   ├── 📜 review.controller.ts
│   │       │   ├── 📜 review.routes.ts
│   │       │   └── 📜 review.validator.ts
│   │       │
│   │       ├── 📂 sellers/
│   │       │   ├── 📜 seller.controller.ts
│   │       │   ├── 📜 seller.routes.ts
│   │       │   └── 📜 seller.validator.ts
│   │       │
│   │       ├── 📂 shipping/
│   │       │   ├── 📜 shipping.controller.ts
│   │       │   ├── 📜 shipping.routes.ts
│   │       │   └── 📜 shipping.validator.ts
│   │       │
│   │       ├── 📂 users/
│   │       │   ├── 📜 user.controller.ts
│   │       │   ├── 📜 user.routes.ts
│   │       │   └── 📜 user.validator.ts
│   │       │
│   │       └── 📂 wishlists/     # (Baru) Wishlist user
│   │           ├── � wishlist.controller.ts
│   │           └── 📜 wishlist.routes.ts
│   │
│   ├── �📂 config/                # Konfigurasi aplikasi
│   │   ├── 📜 database.config.js # Config JS (Kompatibilitas)
│   │   ├── 📜 database.config.ts # Config TS
│   │   └── 📜 env.config.ts      # Memuat variabel dari .env
│   │
│   ├── 📂 database/              # Semua yang berhubungan dengan database
│   │   ├── 📂 migrations/        # File migrasi untuk mengubah skema DB
│   │   │   ├── 📜 2025100601-create-users.js
│   │   │   ├── 📜 2025100602-create-categories.js
│   │   │   ├── 📜 2025100603-create-products.js
│   │   │   ├── 📜 2025100604-create-sellers.js
│   │   │   ├── 📜 2025100605-create-promotions.js
│   │   │   ├── 📜 2025100606-create-orders.js
│   │   │   ├── 📜 2025100607-create-order-items.js
│   │   │   ├── 📜 2025100608-create-reviews.js
│   │   │   ├── 📜 2025100609-create-shipping.js
│   │   │   ├── 📜 2025100610-create-payments.js
│   │   │   ├── 📜 20251029010000-add-deletedAt-to-products.js
│   │   │   ├── 📜 20251029010001-add-deletedAt-to-users.js
│   │   │   ├── 📜 2025120400-add-fulltext-search.js
│   │   │   ├── 📜 20251204130950-add-reset-password-to-users.js
│   │   │   ├── 📜 20251224000001-create-products-search.js # (Baru)
│   │   │   ├── 📜 20251224000002-create-product-images.js  # (Baru)
│   │   │   ├── 📜 20251224000004-create-wishlist-notifications.js # (Baru)
│   │   │   ├── 📜 20251224000005-create-variants-discussions.js # (Baru)
│   │   │   ├── 📜 20251224000006-add-search-vector.js      # (Baru)
│   │   │   └── 📜 2025122501-create-cart-items.js
│   │   │
│   │   ├── 📂 models/            # Definisi tabel dan relasi (Sequelize)
│   │   │   ├── 📜 cartItem.model.ts
│   │   │   ├── 📜 category.model.ts
│   │   │   ├── 📜 index.ts       # Inisialisasi Sequelize dan asosiasi model
│   │   │   ├── 📜 notification.model.ts # (Baru)
│   │   │   ├── 📜 order.model.ts
│   │   │   ├── 📜 orderItem.model.ts
│   │   │   ├── 📜 payment.model.ts
│   │   │   ├── 📜 product.model.ts
│   │   │   ├── 📜 productDiscussion.model.ts # (Baru)
│   │   │   ├── 📜 productImage.model.ts      # (Baru)
│   │   │   ├── 📜 productVariant.model.ts    # (Baru)
│   │   │   ├── 📜 promotion.model.ts
│   │   │   ├── 📜 review.model.ts
│   │   │   ├── 📜 seller.model.ts
│   │   │   ├── 📜 shippingOption.model.ts
│   │   │   ├── 📜 user.model.ts
│   │   │   └── 📜 wishlist.model.ts        # (Baru)
│   │   │
│   │   └── 📂 seeders/           # File untuk mengisi data awal (seeding)
│   │       ├── 📜 2025100601-demo-users.js    # (Baru) Setup user demo
│   │       └── 📜 2025100602-demo-products.js
│   │
│   ├── 📂 gateways/              # (Baru) WebSocket / Realtime
│   │   └── 📜 socket.gateway.ts
│   │
│   ├── 📂 middlewares/           # Fungsi perantara untuk request
│   │   ├── 📜 auth.middleware.ts
│   │   ├── 📜 error.middleware.ts
│   │   ├── 📜 rateLimit.middleware.ts
│   │   ├── 📜 upload.middleware.ts
│   │   └── 📜 validator.middleware.ts
│   │
│   ├── 📂 services/              # Tempat logika bisnis
│   │   ├── 📂 __tests__/         # Unit & Integration Tests
│   │   │   ├── 📜 auth.routes.test.ts
│   │   │   ├── 📜 auth.service.test.ts
│   │   │   ├── 📜 cart.service.test.ts
│   │   │   ├── 📜 category.routes.test.ts
│   │   │   ├── 📜 category.service.test.ts
│   │   │   ├── 📜 notification.service.test.ts # (Baru)
│   │   │   ├── 📜 order.routes.test.ts
│   │   │   ├── 📜 order.service.test.ts
│   │   │   ├── 📜 payment.service.test.ts
│   │   │   ├── 📜 product.routes.test.ts
│   │   │   ├── 📜 product.service.test.ts
│   │   │   ├── 📜 productDiscussion.service.test.ts # (Baru)
│   │   │   ├── 📜 promotion.service.test.ts
│   │   │   ├── 📜 review.routes.test.ts
│   │   │   ├── 📜 review.service.test.ts
│   │   │   ├── 📜 seller.routes.test.ts
│   │   │   ├── 📜 seller.service.test.ts
│   │   │   ├── 📜 shipping.routes.test.ts
│   │   │   ├── 📜 shipping.service.test.ts
│   │   │   ├── 📜 test-image.png
│   │   │   ├── 📜 user.routes.test.ts
│   │   │   ├── 📜 user.service.test.ts
│   │   │   └── 📜 wishlist.service.test.ts      # (Baru)
│   │   │
│   │   ├── 📜 auth.service.ts
│   │   ├── 📜 category.service.ts
│   │   ├── 📜 cart.service.ts
│   │   ├── 📜 notification.service.ts # (Baru)
│   │   ├── 📜 order.service.ts
│   │   ├── 📜 payment.service.ts
│   │   ├── 📜 product.service.ts
│   │   ├── 📜 productDiscussion.service.ts # (Baru)
│   │   ├── 📜 promotion.service.ts
│   │   ├── 📜 review.service.ts
│   │   ├── 📜 seller.service.ts
│   │   ├── 📜 shipping.service.ts
│   │   ├── 📜 user.service.ts
│   │   └── 📜 wishlist.service.ts # (Baru)
│   │
│   ├── 📂 utils/                 # Fungsi bantuan (helpers)
│   │   ├── 📂 __tests__/         # Tests untuk Utils
│   │   │   └── 📜 email.util.test.ts
│   │   │
│   │   ├── 📜 apiFeatures.util.ts
│   │   ├── 📜 email.util.ts
│   │   ├── 📜 http-exception.util.ts
│   │   ├── 📜 jwt.util.ts
│   │   └── 📜 logger.util.ts
│   │
│   └── 📜 server.ts              # Entry point utama aplikasi
│
├── 📜 .env.example
├── 📜 .gitignore
├── 📜 .sequelizerc
├── 📜 jest.config.js
├── 📜 package.json
└── 📜 tsconfig.json
