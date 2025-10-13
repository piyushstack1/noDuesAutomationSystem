@echo off
echo 🚀 Setting up NoDuesAutomation...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies installed successfully
    echo.
    echo 🎉 Setup complete! You can now run:
    echo    npm run dev    # Start development server
    echo    npm run build  # Build for production
    echo.
    echo 📖 Check README.md for more information
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

pause
