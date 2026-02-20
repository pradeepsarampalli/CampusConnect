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


## Ui images - later replace the color with better gradients

# generic dashboard
<img width="1920" height="878" alt="Screenshot 2026-02-20 234545" src="https://github.com/user-attachments/assets/0ad61132-ebf8-4761-956b-f19b2efe4b16" />

# sign up page 
<img width="1357" height="876" alt="localhost_3000_signin" src="https://github.com/user-attachments/assets/04887038-e6c7-451f-aac4-1444d38a91d5" />

# sign in page
<img width="1357" height="876" alt="localhost_3000_signin" src="https://github.com/user-attachments/assets/e4845148-1b7c-48e5-8e39-95f5b367506b" />





