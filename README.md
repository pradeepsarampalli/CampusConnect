### CampusConnect  

## 📦 Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/pradeepsarampalli/CampusConnect.git
cd CampusConnect
```
---

##  Backend Setup

```bash
cd backend
npm install
```

### Create a `.env` file inside the backend folder:
```
DBSTRING=val
```

### Run Backend
```bash
node server.js
```

Backend runs on:
```
http://localhost:3001
```

### Use Nodemon for Auto Restart

```bash
npm install nodemon
nodemon server.js
```

---

## Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run start
```

Frontend runs on:
```
http://localhost:3000
```

---

## Project Structure

```
CampusConnect/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## Environment Variables

| Variable  | Description |
|-----------|------------|
| DBSTRING  | MongoDB Atlas connection string |

---

