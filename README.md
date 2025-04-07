# 💎 Zithara Jewelry Website

A full-stack jewelry e-commerce website with a chatbot that finds similar jewelry based on uploaded images.

## 🛠️ Project Structure

- `frontend/` – React.js frontend
- `backend/` – Express.js server (handles MongoDB/database)
- `chatbot/` – Python Flask server (AI-powered image-based chatbot)


🔧 Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/zithara-jewelry.git
cd zithara-jewelry
2. Install Dependencies
Install backend and frontend dependencies:

bash
Copy
Edit
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../chatbot && pip install -r requirements.txt
3. Environment Files
Make sure to create .env files as needed:

For backend (Express):

ini
Copy
Edit
MONGO_URI=your_mongo_uri
PORT=5000
For chatbot (Flask): If using secrets, consider using python-dotenv and a .env file.

4. Run the Project
Start everything with:

bash
Copy
Edit
npm run dev
Start the chatbot server separately:

bash
Copy
Edit
cd chatbot
python app.py
💡 Features
React.js frontend with Tailwind CSS

Express.js + MongoDB backend for product storage

Flask + OpenAI CLIP for image matching chatbot

Smart image upload & matching

REST APIs for chatbot and product catalog

📁 .gitignore Highlights
Make sure your .gitignore includes:

bash
Copy
Edit
# Ignore virtual environments and build folders
venv/
node_modules/
dist/
.env
uploads/
👤 Author
Manikanta – Passionate web developer

## 🚀 Scripts

```bash
npm run frontend     # Runs React frontend on Vite
npm run backend      # Runs Express.js backend with nodemon
npm run dev          # Runs both frontend and backend concurrently

