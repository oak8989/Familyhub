# Family Hub - Product Requirements Document

## Overview
Family Hub is a fully self-contained, self-hosted family organization app with role-based access control. Runs as a single Docker container with MongoDB embedded.

## Latest Update (March 10, 2026)
- **4 New Features Added**: Real-time WebSocket updates, dark mode, recipe import from URL, offline support (Service Worker)
- **Backend Refactored**: Monolithic server.py split into 17 modular router files
- **Admin Portal Fixed**: Session-based form login replacing broken HTTP Basic Auth
- **Barcode Scanner Enhanced**: Camera auto-close, multi-source lookup, Google fallback
- **Docker Build Fixed**: Removed platform-only dependencies, full modular backend copy
- **Testing**: All tests passing (iteration 8: 144/144, iteration 9: 19/19 + full frontend)

## Tech Stack
- **Frontend:** React 18, Tailwind CSS (with dark mode), Shadcn UI, Recharts, @zxing/library
- **Backend:** FastAPI (17 modular routers), Python 3.11, BeautifulSoup4
- **Database:** MongoDB 7.0 (embedded in Docker)
- **Real-time:** WebSocket via FastAPI
- **Offline:** Service Worker (cache-first static, network-first API)
- **AI:** Emergent LLM (GPT-4o-mini) + OpenAI fallback
- **Admin:** FastAPI with session-based auth (port 8050)
- **Container:** Single self-contained Docker image

## Implemented Features

### Core Modules (All with Full CRUD)
- [x] Shared Calendar (+ Google Calendar sync)
- [x] Shopping List with categories
- [x] Tasks with assignment
- [x] Notes with color coding
- [x] Budget Tracker with charts
- [x] Meal Planner
- [x] Recipe Box (+ URL import)
- [x] Grocery List
- [x] Contacts
- [x] Pantry (barcode scanner + web lookup)
- [x] AI Meal Suggestions

### Gamification
- [x] Chores with difficulty/points
- [x] Rewards system
- [x] Family leaderboard

### Authentication & User Management
- [x] Email/password + Family/Personal PIN login
- [x] Role-based permissions (Owner > Parent > Member > Child)
- [x] Email invites (SMTP)

### Real-time & Offline
- [x] WebSocket updates - family members see changes instantly
- [x] Service Worker - app works offline with cached data
- [x] PWA installable (manifest.json)

### UI/UX
- [x] Dark mode toggle (persists in localStorage)
- [x] Mobile-friendly responsive design
- [x] Admin Portal (session-based login, port 8050)

### Data Management
- [x] QR code for mobile setup
- [x] Full JSON + CSV export
- [x] Push notification toggle (UI only)

## Code Architecture
```
/app/backend/
├── server.py           # Slim app init (~95 lines)
├── database.py         # MongoDB connection
├── auth.py             # JWT, roles, permissions, email
├── admin_portal.py     # Admin portal (port 8050)
├── models/schemas.py   # All Pydantic models
└── routers/
    ├── auth.py, family.py, calendar.py, shopping.py
    ├── tasks.py, chores.py, notes.py, budget.py
    ├── meals.py, recipes.py, grocery.py, contacts.py
    ├── pantry.py, settings.py, suggestions.py
    ├── utilities.py, websocket.py
```

## Backlog
- [ ] Push notification backend (Web Push Protocol)
- [ ] AI Meal Suggestions based on pantry
- [ ] Data import/restore
- [ ] Recurring chores automation
- [ ] Recipe import from URL (expand site coverage)
