# Quick Start Guide - Reality Hits

Get the application running in 5 minutes!

## Prerequisites Checklist

- ✅ Node.js 18+ installed
- ✅ Python 3.10+ installed
- ✅ MongoDB running locally (or Atlas account)
- ✅ LM Studio installed and running

## 1️⃣ Start MongoDB

```bash
# If installed locally
mongod

# Or use MongoDB Atlas (update MONGO_URL in backend/.env)
```

## 2️⃣ Start LM Studio

1. Open LM Studio app
2. Download a model (e.g., Mistral 7B)
3. Click "Start Server"
4. API runs on http://localhost:1234

## 3️⃣ Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run backend
python main.py
```

✅ Backend ready at: http://localhost:8000
📚 API Docs at: http://localhost:8000/docs

## 4️⃣ Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run development server
npm run dev
```

✅ Frontend ready at: http://localhost:5173

## 5️⃣ Test the Application

1. Open http://localhost:5173
2. Click "Submit Complaint"
3. Enter sample complaint:
   - Text: "Road has large potholes in my area"
   - Location: "Sector 5, Mumbai"
4. Click Submit
5. Watch AI analyze and process
6. Check Dashboard for analytics

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in respective config:
# Frontend: vite.config.js (change server.port)
# Backend: main.py (change port in uvicorn.run)
```

### MongoDB Connection Error
```bash
# Check MongoDB is running
mongosh

# Or update MONGO_URL in backend/.env
MONGO_URL=your_atlas_connection_string
```

### LM Studio API Not Responding
```bash
# Verify LM Studio is running on port 1234
curl http://localhost:1234/health

# If not, restart LM Studio with local API enabled
```

### Module Not Found Error
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
npm install --force
```

## 📊 Sample Complaints to Test

1. **Water Issue**
   - Text: "Water supply is not available in my building for 2 weeks"
   - Location: "Downtown area"

2. **Electricity Problem**
   - Text: "Power cuts happening multiple times daily affecting work"
   - Location: "Industrial zone"

3. **Road Maintenance**
   - Text: "Many streetlights are broken causing accidents at night"
   - Location: "Main highway"

## 🎯 Next Steps

1. ✅ Application is running
2. Submit test complaints
3. Explore dashboard
4. Check complaint details
5. Review AI analysis

## 📞 Support

Check the main README.md for:
- Detailed API documentation
- Deployment instructions
- Architecture details
- Contributing guidelines

---

**Your hackathon project is ready! 🚀**
