@echo off
REM Reality Hits - Windows Quick Start Script

echo.
echo 🚀 Reality Hits - Quick Start Script
echo.

REM Check prerequisites
echo 📋 Checking prerequisites...

where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%

where python >nul 2>nul
if errorlevel 1 (
    echo ❌ Python 3 not found. Please install Python 3.10+
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Python found: %PYTHON_VERSION%

echo.
echo 🔧 Setting up backend...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -q -r requirements.txt
copy .env.example .env
echo ✅ Backend setup complete
cd ..

echo.
echo 🎨 Setting up frontend...
cd frontend
npm install -q
copy .env.example .env
echo ✅ Frontend setup complete
cd ..

echo.
echo ✨ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Start MongoDB: mongod
echo 2. Start LM Studio on port 1234
echo 3. Backend: cd backend && venv\Scripts\activate && python main.py
echo 4. Frontend: cd frontend && npm run dev
echo 5. Open: http://localhost:5173
