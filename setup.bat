@echo off
echo ========================================
echo   BelanjaKu - Quick Setup Script
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "apps\backend" (
    echo ERROR: Please run this script from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/6] Checking PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: PostgreSQL CLI not found in PATH
    echo Make sure PostgreSQL is installed and running
) else (
    echo ✓ PostgreSQL CLI is available
)
echo.

echo [3/6] Installing Backend Dependencies...
cd apps\backend
if not exist "node_modules" (
    echo Installing packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        cd ..\..
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencies already installed
)
cd ..\..
echo.

echo [4/6] Installing Frontend Dependencies...
cd apps\frontend
if not exist "node_modules" (
    echo Installing packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        cd ..\..
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencies already installed
)
cd ..\..
echo.

echo [5/6] Checking Environment Files...
if not exist "apps\backend\.env" (
    echo WARNING: Backend .env file not found!
    echo Creating from .env.example...
    copy "apps\backend\.env.example" "apps\backend\.env"
    echo.
    echo IMPORTANT: Please edit apps\backend\.env and set your database credentials!
    echo.
)

if not exist "apps\frontend\.env.local" (
    echo Creating frontend .env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1 > apps\frontend\.env.local
    echo ✓ Created .env.local
) else (
    echo ✓ Frontend .env.local exists
)
echo.

echo [6/6] Testing Database Connection...
cd apps\backend
node test-db-connection.js
if errorlevel 1 (
    echo.
    echo WARNING: Database connection failed!
    echo Please check your database configuration in apps\backend\.env
    echo.
    echo Next steps:
    echo 1. Make sure PostgreSQL is running
    echo 2. Create database: psql -U postgres -c "CREATE DATABASE ecommerce_db;"
    echo 3. Update .env file with correct credentials
    echo 4. Run migrations: npm run db:migrate
    cd ..\..
    pause
    exit /b 1
)
cd ..\..
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Review and update configuration files:
echo    - apps\backend\.env (database credentials)
echo    - apps\frontend\.env.local (API URL)
echo.
echo 2. Run database migrations:
echo    cd apps\backend
echo    npm run db:migrate
echo.
echo 3. (Optional) Seed initial data:
echo    npm run db:seed:all
echo.
echo 4. Start the backend (Terminal 1):
echo    cd apps\backend
echo    npm run dev
echo.
echo 5. Start the frontend (Terminal 2):
echo    cd apps\frontend
echo    npm run dev
echo.
echo 6. Open browser: http://localhost:3000
echo.
echo ========================================
pause
