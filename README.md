# AI-Powered Stock Level Estimation for Supermarkets

This project explores the use of **AI and computer vision** to automatically estimate stock levels of supermarket products (e.g., bananas, broccoli, onions) from camera feeds or uploaded images. The system helps reduce manual labor by providing automated shelf monitoring and stock reporting.

---

## 🚀 Features

- **AI-powered stock estimation** from photos/videos of supermarket shelves  
- **Frontend Web App** built with **React + Vite** for fast and modern UI  
- **Backend API** using **Node.js + Express** to handle requests and manage communication between frontend, Firebase, and AI engine  
- **AI Engine** leveraging **open-source models** (running on Linux server) for image segmentation, vision-language analysis, and depth estimation  
- **Firebase Storage** for storing user uploads (photos/videos) and results  
- **Results Table** showing estimated stock levels (e.g., 20%, 50%, Overstocked)  

---

## 🏗️ Tech Stack

- **Frontend**: React + Vite  
- **Backend**: Node.js + Express  
- **Storage**: Firebase  
- **AI Integration**: Python (open-source models running on Linux server)  
- **Hosting/Infrastructure**: Linux server for AI backend and model inference  

---

## 📂 Project Structure (suggested)

```
root/
│── frontend/          # React + Vite web app
│── backend/           # Node.js + Express API
│   ├── routes/        # API routes
│   ├── controllers/   # Request handling
│   └── services/      # Firebase + AI service handlers
│── ai-engine/         # Python-based AI scripts/models
│── docs/              # Documentation
│── README.md
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repo-url>
cd <repo-name>
```

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev   # Start development server
```

### 3. Backend Setup (Node.js + Express)
```bash
cd backend
npm install
npm run dev   # Start backend server
```

### 4. AI Engine Setup (Python)
```bash
cd ai-engine
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py   # Run AI engine
```

### 5. Firebase Setup
- Create a Firebase project  
- Enable **Cloud Storage** and **Firestore** if needed  
- Add your `firebaseConfig` in `frontend/src/config/firebase.js`  

---

## 🔄 Workflow

1. User uploads image/video through the frontend  
2. File is stored in **Firebase Storage**  
3. Backend sends request to **AI engine (Python)** for processing  
4. AI engine estimates stock levels and returns structured data  
5. Backend sends results back to frontend  
6. User sees results in a **table format**  

---

## 📌 Roadmap

- ✅ Prototype with open-source AI models  
- ✅ Basic frontend + backend integration  
- ⬜ Extend AI to support more product categories  
- ⬜ Improve accuracy with curated datasets  
- ⬜ (Optional) Train a custom AI model for supermarket stock monitoring  

---

## 📜 License & Ownership

All developed materials belong to **La Trobe University**.  

