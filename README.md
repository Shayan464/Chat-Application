<img width="1421" height="817" alt="image" src="https://github.com/user-attachments/assets/b31e48fe-b91c-40b1-9ebc-f04e9cb651eb" />


# Chatify 💬

A full-stack real-time chat application built with React, Node.js, and Socket.io.

- Live Url : https://chat-application-al9l.onrender.com

## Features

- 🔐 Custom JWT Authentication (no 3rd-party auth)
- ⚡ Real-time messaging via Socket.io
- 🟢 Online/Offline presence indicators
- 🔔 Notification & typing sounds (with toggle)
- 🗂️ Image uploads via Cloudinary
- 🧰 REST API with Node.js & Express
- 🧱 MongoDB for data persistence
- 🚦 API rate-limiting powered by Arcjet
- 🎨 Beautiful UI with React, Tailwind CSS & DaisyUI
- 🧠 Redux Toolkit for state management
- 🚀 Easy deployment — frontend served from backend (free-tier friendly with Render)

## Tech Stack

**Frontend:** React, Redux Toolkit, Tailwind CSS, DaisyUI, Socket.io-client

**Backend:** Node.js, Express, MongoDB, Socket.io, JWT, Cloudinary, Resend, Arcjet

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB URI
- Cloudinary account
- Arcjet API key

### Environment Variables

Create a `.env` file inside the `/backend` folder:

```env
PORT=3000
MONGO_URI=your_mongo_uri_here
NODE_ENV=development

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

### Run the Backend

```bash
cd backend
npm install
npm run dev
```

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3000`.

## Deployment

The frontend is built and served from the backend, so both run on the same URL — making it free-tier friendly on platforms like Render.
