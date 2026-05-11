#!/bin/bash
# Test script to verify the entire Reality Hits setup

echo "=========================================="
echo "Reality Hits - Setup Verification Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to test a command
test_command() {
  if command -v $1 &> /dev/null; then
    echo -e "${GREEN}✅${NC} $1 is installed"
    ((PASSED++))
  else
    echo -e "${RED}❌${NC} $1 is not installed"
    ((FAILED++))
  fi
}

# Function to test a port
test_port() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${GREEN}✅${NC} Port $1 is open"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️ ${NC} Port $1 is not open (this is OK if service hasn't started)"
  fi
}

# Function to test a directory
test_directory() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✅${NC} Directory $1 exists"
    ((PASSED++))
  else
    echo -e "${RED}❌${NC} Directory $1 does not exist"
    ((FAILED++))
  fi
}

# Function to test a file
test_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅${NC} File $1 exists"
    ((PASSED++))
  else
    echo -e "${RED}❌${NC} File $1 does not exist"
    ((FAILED++))
  fi
}

echo "1. Checking Prerequisites..."
echo "=============================="
test_command "node"
test_command "npm"
test_command "python3"
test_command "git"
echo ""

echo "2. Checking Project Structure..."
echo "=================================="
test_directory "frontend"
test_directory "backend"
test_file "README.md"
test_file "docker-compose.yml"
echo ""

echo "3. Checking Frontend Setup..."
echo "=============================="
test_file "frontend/package.json"
test_file "frontend/vite.config.js"
test_file "frontend/tailwind.config.js"
test_file "frontend/.env.example"
echo ""

echo "4. Checking Backend Setup..."
echo "============================="
test_file "backend/main.py"
test_file "backend/requirements.txt"
test_file "backend/config.py"
test_file "backend/.env.example"
echo ""

echo "5. Checking Database Files..."
echo "=============================="
test_file "backend/database/mongo.py"
echo ""

echo "6. Checking Routes..."
echo "====================="
test_file "backend/routes/complaints.py"
test_file "backend/routes/dashboard.py"
echo ""

echo "7. Checking Services..."
echo "======================="
test_file "backend/services/complaint_service.py"
test_file "backend/services/ai_service.py"
echo ""

echo "8. Checking Documentation..."
echo "============================="
test_file "README.md"
test_file "QUICKSTART.md"
test_file "API_DOCS.md"
test_file "DEPLOYMENT.md"
test_file "ARCHITECTURE.md"
test_file "CONTRIBUTING.md"
echo ""

echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✨ All checks passed! You're ready to go.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Start MongoDB: mongod"
  echo "2. Start LM Studio on port 1234"
  echo "3. cd backend && python main.py"
  echo "4. cd frontend && npm run dev"
  echo "5. Open http://localhost:5173"
else
  echo -e "${RED}⚠️ Some checks failed. Please verify your setup.${NC}"
fi

echo ""
echo "For more information, see:"
echo "- README.md for full documentation"
echo "- QUICKSTART.md for quick setup"
echo "=========================================="
