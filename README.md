### CampusConnect  

## Installation & Setup

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


## Ui images
<img width="1920" height="878" alt="Screenshot 2026-02-20 234545" src="https://github.com/user-attachments/assets/7e04b291-c5a6-4f81-9633-e848cf06e85a" />
<img width="1314" height="877" alt="localhost_3000_signup" src="https://github.com/user-attachments/assets/b32bc5b2-5396-45f3-9bba-c4fd753ad4eb" />
<img width="1314" height="877" alt="localhost_3000_signin" src="https://github.com/user-attachments/assets/f97a82bc-9765-4832-9d68-470cb0c465cd" />



