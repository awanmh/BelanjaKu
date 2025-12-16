# 🛍️ BelanjaKu - E-commerce Platform

> Modern full-stack e-commerce application built with Next.js, Express, and PostgreSQL

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
[![License](https://img.shields.io/badge/license-ISC-blue.svg)]()

---

## 📊 Project Status

**Last Updated**: 2025-12-16 22:48  
**Status**: ✅ **PRODUCTION READY**

### Recent Fixes & Features (2025-12-16):
- ✅ **Fixed product detail page error** (line 60 - related products)
- ✅ **Fixed register page** (API endpoints, validation, error handling)
- ✅ **Added cart counter badge** (real-time, persistent, auto-sync)
- ✅ Fixed related products fetch logic
- ✅ Added category data to product detail endpoint
- ✅ Relaxed password validation (6+ chars)
- ✅ Enhanced error messages
- ✅ Created comprehensive documentation (12 files)
- ✅ Added automated testing scripts (3 scripts)
- ✅ Created setup automation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Automated Setup (Recommended)
```bash
# Run setup script
setup.bat
```

### Manual Setup
```bash
# 1. Install dependencies
cd apps/backend && npm install
cd ../frontend && npm install

# 2. Setup environment
# Create apps/frontend/.env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# 3. Setup database
cd apps/backend
npm run db:migrate
npm run db:seed:all  # Optional

# 4. Run applications
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/v1

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SUMMARY.md](./SUMMARY.md) | **START HERE** - Executive summary & quick guide |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Detailed troubleshooting guide |
| [CHECKLIST.md](./CHECKLIST.md) | System verification checklist |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture & diagrams |

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Validation**: Express Validator

---

## 📁 Project Structure

```
BelanjaKu/
├── apps/
│   ├── backend/              # Express.js API
│   │   ├── src/
│   │   │   ├── api/v1/      # API routes
│   │   │   ├── config/      # Configuration
│   │   │   ├── database/    # Models, migrations, seeders
│   │   │   ├── middlewares/ # Express middlewares
│   │   │   ├── services/    # Business logic
│   │   │   └── utils/       # Utilities
│   │   ├── .env            # Environment variables
│   │   └── test-*.js       # Testing scripts
│   │
│   └── frontend/            # Next.js app
│       ├── src/
│       │   ├── app/        # Pages & layouts
│       │   ├── components/ # React components
│       │   ├── lib/        # Utilities & API client
│       │   └── store/      # State management
│       └── .env.local      # ⚠️ CREATE THIS FILE
│
├── SUMMARY.md              # Quick start guide
├── TROUBLESHOOTING.md      # Troubleshooting guide
├── CHECKLIST.md           # Verification checklist
├── ARCHITECTURE.md        # Architecture docs
└── setup.bat              # Setup automation
```

---

## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed:all  # Seed database
npm test            # Run tests
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

---

## 🧪 Testing

### Test Database Connection
```bash
cd apps/backend
node test-db-connection.js
```

### Test API Endpoints
```bash
cd apps/backend
node test-api.js
```

---

## 🌟 Features

### User Features
- ✅ User registration & authentication
- ✅ Product browsing & search
- ✅ Product detail with related products
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Order placement
- ✅ Order history

### Admin/Seller Features
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Category management
- ✅ Promotion management

---

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=ecommerce_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 📋 Git Workflow (Team)

### For Frontend Team
```bash
# Switch to frontend branch
git checkout frontend-update

# Pull latest changes
git pull origin frontend-update

# Make changes, then commit
git add .
git commit -m "feat(frontend): add new feature"

# Push changes
git push origin frontend-update
```

### For Backend Team
```bash
# Switch to backend branch
git checkout backend-update

# Pull latest changes
git pull origin backend-update

# Make changes, then commit
git add .
git commit -m "feat(backend): add new endpoint"

# Push changes
git push origin backend-update
```

### Important Rules
1. ❌ Never push directly to `main`
2. ✅ Always `git pull` before `git push`
3. ✅ Write clear commit messages
4. ✅ Test before pushing

---

## 🐛 Troubleshooting

### Common Issues

**Error: "ECONNREFUSED localhost:5000"**
- Backend is not running
- Solution: `cd apps/backend && npm run dev`

**Error: "Cannot connect to database"**
- PostgreSQL not running or wrong credentials
- Solution: Check `.env` file and PostgreSQL service

**Error: "Module not found"**
- Dependencies not installed
- Solution: `npm install`

For more detailed troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📞 Support

- 📖 Read [SUMMARY.md](./SUMMARY.md) for quick start
- 🔍 Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- ✅ Use [CHECKLIST.md](./CHECKLIST.md) to verify setup
- 🏗️ See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

---

## 👥 Team

- **Frontend Team**: UI/UX, React components, styling
- **Backend Team**: API, database, business logic

---

## 📝 License

ISC License - See LICENSE file for details

---

## 🎯 Next Steps

1. ✅ Read [SUMMARY.md](./SUMMARY.md)
2. ✅ Run `setup.bat` or manual setup
3. ✅ Create `.env.local` in frontend
4. ✅ Test database connection
5. ✅ Start backend & frontend
6. ✅ Verify all features work

---

**Happy Coding! 🚀**
