# Family Hub - Self-Hosted Family Organization App

A comprehensive family organization app with calendar, shopping lists, tasks, notes, messages, budget tracking, meal planning, recipes, contacts, photo gallery, pantry tracker with barcode scanner, and meal suggestions.

## Features

- 🏠 **Dashboard** - Quick overview of family activities
- 📅 **Calendar** - Shared family events
- 🛒 **Shopping List** - Collaborative shopping with categories
- ✅ **Tasks** - Assign chores with priorities and due dates
- 📝 **Notes** - Color-coded family notes
- 💬 **Messages** - Family chat
- 💰 **Budget** - Track income and expenses
- 🍽️ **Meal Planner** - Plan weekly meals
- 📖 **Recipe Box** - Store family recipes
- 🥬 **Grocery List** - Quick shopping list
- 👥 **Contacts** - Family address book
- 📷 **Photos** - Shared photo gallery
- 📦 **Pantry** - Track inventory with barcode scanner
- 💡 **Meal Ideas** - Suggestions based on pantry items

## Self-Hosting with Docker

### Quick Start

1. Clone the repository:
```bash
git clone <your-repo-url>
cd family-hub
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env and set your JWT_SECRET
```

3. Start the application:
```bash
docker-compose up -d
```

4. Access the app at `http://localhost:8001`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-change-in-production` |
| `MONGO_URL` | MongoDB connection URL | `mongodb://mongo:27017` |
| `DB_NAME` | Database name | `family_hub` |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# Backup MongoDB data
docker exec family-hub-mongo mongodump --out /data/backup

# Reset everything (WARNING: deletes all data)
docker-compose down -v
```

### Reverse Proxy (Nginx Example)

```nginx
server {
    listen 80;
    server_name family.yourdomain.com;

    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;
    }
}
```

## Mobile App Setup

When using the app on mobile devices:

1. Open the app URL in your mobile browser
2. On the login screen, tap "Self-Hosted Server" 
3. Enter your server URL (e.g., `https://family.yourdomain.com`)
4. Login with Family PIN or your account

### Add to Home Screen

**iOS Safari:**
1. Tap the Share button
2. Select "Add to Home Screen"

**Android Chrome:**
1. Tap the menu (⋮)
2. Select "Add to Home screen"

## Default Login

After first setup, create your family:

1. Go to "Account" tab
2. Register a new account
3. After login, you'll be prompted to create a family
4. Set a Family PIN (e.g., 1234)
5. Share the PIN with family members for quick access

## Data Backup

### Automatic Backup Script

```bash
#!/bin/bash
# backup.sh - Run daily via cron

BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d)

# Backup MongoDB
docker exec family-hub-mongo mongodump --out /data/backup
docker cp family-hub-mongo:/data/backup $BACKUP_DIR/mongo-$DATE

# Backup photos
docker cp family-hub:/app/backend/photos $BACKUP_DIR/photos-$DATE

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -delete
```

## Tech Stack

- **Frontend**: React, Tailwind CSS, Shadcn UI
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **Barcode Scanner**: @zxing/library (browser-based)

## License

MIT License - Feel free to self-host and modify!
