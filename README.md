# Family Hub

<p align="center">
  <img src="https://img.shields.io/badge/Docker-Ready-blue?logo=docker" alt="Docker Ready">
  <img src="https://img.shields.io/badge/Self--Contained-Yes-green" alt="Self-Contained">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
</p>

<p align="center">
  <strong>🏠 Your Family's Digital Home</strong><br>
  A fully self-contained, self-hosted family organization app
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📅 **Calendar** | Shared family events with Google Calendar sync |
| 🛒 **Shopping List** | Collaborative lists with categories |
| ✅ **Tasks** | Assignable tasks with priorities & due dates |
| 🏆 **Chores & Rewards** | Gamified chore chart with points system |
| 📝 **Notes** | Color-coded family notes |
| 💰 **Budget** | Track income & expenses with charts |
| 🍽️ **Meal Planner** | Plan weekly meals |
| 📖 **Recipe Box** | Store & organize recipes |
| 🥬 **Grocery List** | Quick shopping list |
| 👥 **Contacts** | Family address book |
| 📦 **Pantry** | Inventory with barcode scanner |
| 💡 **Meal Ideas** | Suggestions based on pantry |
| ⚙️ **Settings** | Full admin control panel |

## 🚀 Quick Start

### Single Container (Fully Self-Contained)

Everything runs in ONE container - no external database needed!

```bash
# Pull and run (MongoDB included!)
docker run -d \
  --name family-hub \
  -p 8001:8001 \
  -v family-hub-data:/data/db \
  -v family-hub-photos:/app/backend/photos \
  -e JWT_SECRET=your-secret-key-change-me \
  ghcr.io/oak8989/family-hub:latest

# Access at http://localhost:8001
```

### With Docker Compose

```yaml
version: '3.8'
services:
  family-hub:
    image: ghcr.io/oak8989/family-hub:latest
    container_name: family-hub
    ports:
      - "8001:8001"
    volumes:
      - family-hub-data:/data/db
      - family-hub-photos:/app/backend/photos
    environment:
      - JWT_SECRET=your-secret-key-change-me
      # Optional SMTP for email invitations:
      # - SMTP_HOST=smtp.gmail.com
      # - SMTP_PORT=587
      # - SMTP_USER=your-email@gmail.com
      # - SMTP_PASSWORD=your-app-password
    restart: unless-stopped

volumes:
  family-hub-data:
  family-hub-photos:
```

```bash
docker-compose up -d
```

### Build from Source

```bash
git clone https://github.com/oak8989/family-hub.git
cd family-hub
docker build -t family-hub .
docker run -d -p 8001:8001 -e JWT_SECRET=mysecret family-hub
```

## 📱 Mobile Setup

Family Hub works great on mobile devices as a PWA:

### Add to Home Screen

**iOS Safari:**
1. Open Family Hub URL
2. Tap Share button (□↑)
3. Select "Add to Home Screen"

**Android Chrome:**
1. Open Family Hub URL
2. Tap menu (⋮)
3. Select "Add to Home Screen"

### Connect to Self-Hosted Server

On the login page, tap "Connect to Server" to enter your server URL.

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Owner** | Full control - manage family, users, settings |
| **Parent** | Manage users, settings, all features |
| **Member** | Use all features, limited editing |
| **Child** | View-only, complete assigned chores |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | **Required** - Secret key for tokens | - |
| `DB_NAME` | MongoDB database name | `family_hub` |
| `CORS_ORIGINS` | Allowed origins | `*` |

### Optional: Email Invitations (SMTP)

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server (e.g., smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (usually 587) |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASSWORD` | SMTP password or app password |
| `SMTP_FROM` | From address for emails |

### Optional: Google Calendar Sync

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL |

## 📂 Data Persistence

The container uses two volumes:

- `/data/db` - MongoDB database files
- `/app/backend/photos` - Uploaded photos (if photo feature is re-enabled)

**Backup your data:**
```bash
# Backup
docker run --rm -v family-hub-data:/data -v $(pwd):/backup alpine tar czf /backup/family-hub-backup.tar.gz /data

# Restore
docker run --rm -v family-hub-data:/data -v $(pwd):/backup alpine tar xzf /backup/family-hub-backup.tar.gz -C /
```

## 🏥 Health Check

The container includes a health check:

```bash
curl http://localhost:8001/api/health
# Returns: {"status":"healthy"}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ for families everywhere
</p>
