URL : https://notes-app-sgzq.vercel.app/
# MERN Notes App

A full-stack Notes Application built using the MERN stack (MongoDB, Express, React, Node.js). Users can create, read, update, and delete notes.

## 🚀 Tech Stack

-   **Frontend:** React.js (Vite), Axios, Vanilla CSS
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB, Mongoose

## 🎯 Features

-   Create new notes with a title and content
-   View a list of all saved notes
-   Update existing notes
-   Delete notes
-   Responsive and clean UI

## 📂 Project Structure

```
/client  - React frontend application
/server  - Node.js/Express backend API
```

## 🛠️ Installation & Setup

### Prerequisites

-   Node.js installed
-   MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone <repository-url>
cd notes-app
```

### 2. Backward Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your MongoDB connection string:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`.

### 3. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

## 📡 API Endpoints

-   `GET /api/notes` - Fetch all notes
-   `POST /api/notes` - Create a new note
-   `PUT /api/notes/:id` - Update a note
-   `DELETE /api/notes/:id` - Delete a note

## 📝 Usage

1.  Open the frontend URL in your browser.
2.  Use the form to add a note.
3.  Click "Edit" to modify a note.
4.  Click "Delete" to remove a note.
