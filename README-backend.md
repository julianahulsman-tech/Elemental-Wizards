Elemental Wizards — Backend for progress saving

Quick start:

1. Install dependencies:

```powershell
cd "c:\Users\julia\elemental wizards"
npm install
```

2. Start the backend:

```powershell
npm start
```

The server runs on http://localhost:3000 by default. It will serve the existing static files
and provide two API endpoints:

- `POST /api/progress` with JSON `{ id, progress }` to save progress
- `GET  /api/progress/:id` to retrieve saved progress

Client helper is at `/save-progress.js` and the `index.html` includes a small auto-save
handler that writes the current user's `ew_users` data to the backend on unload.

Data is stored in `data/progress.json` in the project folder.
