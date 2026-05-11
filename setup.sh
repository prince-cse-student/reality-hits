#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Reality Hits - Quick Start Script${NC}\n"

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js found: $(node -v)"

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+"
    exit 1
fi
echo "✅ Python 3 found: $(python3 --version)"

if ! command -v mongod &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB not found. Make sure MongoDB is running on localhost:27017"
fi

echo -e "\n${BLUE}🔧 Setting up backend...${NC}"
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -q -r requirements.txt
cp .env.example .env
echo -e "${GREEN}✅ Backend setup complete${NC}"
cd ..

echo -e "\n${BLUE}🎨 Setting up frontend...${NC}"
cd frontend
npm install -q
cp .env.example .env
echo -e "${GREEN}✅ Frontend setup complete${NC}"
cd ..

echo -e "\n${GREEN}✨ Setup complete!${NC}"
echo -e "\n${BLUE}📝 Next steps:${NC}"
echo -e "1. Start MongoDB: ${YELLOW}mongod${NC}"
echo -e "2. Start LM Studio on port 1234"
echo -e "3. Backend: ${YELLOW}cd backend && source venv/bin/activate && python main.py${NC}"
echo -e "4. Frontend: ${YELLOW}cd frontend && npm run dev${NC}"
echo -e "5. Open: ${YELLOW}http://localhost:5173${NC}"
