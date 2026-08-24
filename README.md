# Chatting App

Real-time messaging app with private chats, group chats. The backend is a TypeScript Express API with Socket.IO and Prisma. The frontend is a React + Redux Toolkit client.

## Features

- Register, log in, and edit your profile (name, avatar)
- JWT-authenticated REST API and Socket.IO connections
- One-to-one private chats
- Group chats: create, rename, add/remove members, leave, delete
- Search users to start a conversation
- Real-time messages with typing indicators
- Message history with read tracking
- File uploads (images, PDF, Office docs, zip, plain text)
- Chat sidebar, message composer, and group settings in the UI

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Redux Toolkit, React Router, Tailwind CSS, Axios, Socket.IO client, Zod, React Hook Form |
| Backend | Node.js, Express 5, TypeScript, Socket.IO, Prisma, Zod, JWT, Multer, Winston |
| Database | PostgreSQL |

## Project structure

```
Chatting-App/
├── backend/          # Express API, Socket.IO, Prisma
│   ├── prisma/       # Schema and migrations
│   └── src/
│       ├── modules/  # auth, users, chats, groups, messages, uploads
│       ├── socket/   # Real-time events
│       └── middleware/
└── frontend/         # Create React App client
    └── src/
        ├── pages/
        ├── features/
        ├── redux/
        ├── api/
        └── socket/
```

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL

## Getting started

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/chat_app
JWT_SECRET=replace-with-a-secret-at-least-20-chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Optional:

```env
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

Generate the Prisma client, run migrations, then start the API:

```bash
npm run generate
npm run migrate
npm run dev
```

The API listens on `http://localhost:5000` by default.

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (optional; these are the defaults):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the client:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

### Backend (`backend/`)

| Script | Description |
| --- | --- |
| `npm run dev` | Start the API with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run generate` | Generate Prisma client |
| `npm run migrate` | Run Prisma migrations |

### Frontend (`frontend/`)

| Script | Description |
| --- | --- |
| `npm start` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm test` | Run tests |

## API overview

All routes except register and login require a Bearer JWT.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Sign in |
| `GET` | `/api/auth/profile` | Current user |
| `PUT` | `/api/auth/profile` | Update profile |
| `GET` | `/api/users/search` | Search users |
| `POST` | `/api/chats/private` | Start or get a private chat |
| `GET` | `/api/chats` | List chats |
| `GET` | `/api/chats/:chatId` | Chat details |
| `POST` | `/api/chats/group` | Create a group |
| `PATCH` | `/api/chats/:chatId` | Rename a group |
| `POST` | `/api/chats/:chatId/members` | Add members |
| `DELETE` | `/api/chats/:chatId/members/:memberId` | Remove a member |
| `POST` | `/api/chats/:chatId/leave` | Leave a group |
| `DELETE` | `/api/chats/:chatId` | Delete a group |
| `GET` | `/api/chats/:chatId/messages` | Message history |
| `POST` | `/api/uploads` | Upload a file (`multipart/form-data`, field `file`) |

Uploaded files are served from `/uploads`.

## Real-time events (Socket.IO)

Connect with the same JWT used for the REST API. Messages are sent over the socket, not a REST POST.

**Client → server:** `join-room`, `leave-room`, `send-message`, `typing`, `stop-typing`, `message-read`

**Server → client:** `receive-message`, `online-users`, `chat-created`, `group-updated`, `group-member-added`, `group-member-removed`, `group-member-left`, `group-deleted`

## License

Private project. Not licensed for public use unless you add a license yourself.
