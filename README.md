### 1. Clone Repository
```bash
git clone 
cd task-manager
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
.env
PORT=Your Port Number
MONGODB_URI=MongoDB URL
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development

# Start backend
npm run dev
```

**Backend runs on:** http://localhost:YourPort

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Start frontend
npm run dev
```

**Frontend runs on:** http://localhost:3000

