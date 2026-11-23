# Mini CRM Dashboard — SHL Tech Internship Task 1

A responsive lead-management dashboard built with HTML, CSS, JavaScript, Node.js, Express and SQLite.

## Features
- Dashboard counts: total leads, new leads and converted customers.
- Create, edit and delete leads.
- Search by name or email; filter by New, Contacted or Converted.
- Update lead status through the edit form.
- SQLite persistence: leads remain after refreshing or restarting the app.
- Frontend connected to REST API; loading, empty and error messages.
- Required-field and email validation in frontend and backend.
- Responsive desktop and mobile layout.

## Why this stack?
- **HTML/CSS/JavaScript:** easy to understand and modify without a frontend framework.
- **Node.js + Express:** straightforward backend and REST API.
- **SQLite + better-sqlite3:** lightweight local database; no separate database server or manual setup needed.

## Requirements
Install Node.js 18+ and npm.

## Run locally
1. Unzip this folder and open it in VS Code.
2. Open Terminal in the project folder.
3. Run `npm install`.
4. Run `npm start`.
5. Visit `http://localhost:3000`.

The app automatically creates `crm.sqlite` and the `leads` table on first start. Do not delete this file unless you want to erase saved leads.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard` | Dashboard counts |
| GET | `/api/leads?search=&status=` | List, search and filter leads |
| POST | `/api/leads` | Add a lead |
| PUT | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |

Example JSON for POST/PUT:
```json
{"name":"Aditi Sharma","email":"aditi@example.com","phone":"9876543210","businessName":"Bright Studio","status":"New"}
```

## Folder structure
```text
mini-crm-dashboard/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── database.js
├── server.js
├── package.json
└── README.md
```

## Before submission
- Test create, edit, delete, search, filtering and status changes.
- Refresh the page to confirm database persistence.
- Push the code to your own GitHub repository.
- Deploy on a Node.js host that supports persistent disk storage. SQLite data stored on temporary filesystems may be lost on redeploy; verify persistent storage before sharing a live link.
- Add your actual GitHub and live URLs to the submission.

## Learning points
Be prepared to explain `fetch()` in `app.js`, Express routes in `server.js`, SQL queries in the API handlers, and automatic database/table creation in `database.js`. This is an educational starter project—review and understand the code before submitting it.
