# 🎯 Tracks IP - Device Monitoring Dashboard

A real-time device monitoring and IP tracking system built with **Next.js**, **MongoDB**, and **Node.js**.

## ✨ Features

- 🖥️ **Real-time Device Monitoring** - Track active/inactive devices with live status
- 📊 **Dashboard** - View employee devices, IPs, and connection status
- 🔄 **Auto Refresh** - Devices update every 10 seconds
- 🔐 **Secure Registration** - Upsert-based device registration to prevent duplicates
- 📱 **Responsive Design** - Fully adaptive UI; sidebar collapses into mobile menu with hamburger, and tables/cards stack on smaller screens via Tailwind
- 🎨 **Modern UI** - Clean, responsive design using Tailwind CSS with custom components

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **MongoDB** (local or cloud)
- Environment variables configured

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd tracks-ip

# 2. Install dependencies
pnpm install

# 3. Create .env.local file
cat > .env.local << EOF
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/tracks-ip
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF

# 4. Start development server
pnpm dev
```

The server runs at `http://localhost:3000` with auto-refresh.

## 📋 Available Scripts

```bash
pnpm dev              # Start development server (includes heartbeat)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm heartbeat        # Run heartbeat agent standalone
pnpm lint             # Run ESLint checks
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting without changes
```

## 🏗️ Project Structure

```
tracks-ip/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API routes
│   │   ├── devices/      # Device pages
│   │   └── login/        # Admin pages
│   ├── components/       # React components
│   ├── lib/              # Utilities (db, deviceStatus, utils)
│   ├── models/           # Mongoose schemas
│   └── middleware.js     # Auth middleware
├── laptop-agent/         # Laptop heartbeat agent
├── public/               # Static assets
├── .github/workflows/    # CI/CD pipelines
├── package.json
└── next.config.mjs
```

## 🔌 API Endpoints

### Devices

- `GET /api/devices` - Fetch all active devices (deduplicated per deviceId)
- `POST /api/register` - Register a new device (used by the web UI at `/register`)

### Web Registration
A polished form is available at `/register` with field validation, real‑time feedback and a responsive card layout. Enter **Device ID**, **Assigned Employee** and an optional location. After submission the page shows a success banner with the device details and a link back to the dashboard.
- `POST /api/heartbeat` - Send device heartbeat (updates lastSeen)
- `POST /api/update` - Update device info

**Validation Rules:**
- `deviceId` and `assignedEmployee` are required
- `assignedEmployee` cannot be "User" or empty
- Devices with same `deviceId` are deduplicated; newest wins

## 👤 Device Registration Example

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "<YOUR_DEVICE_ID>",
    "assignedEmployee": "John Doe",
    "publicIP": "203.0.113.1",
    "localIP": "192.168.1.100",
    "location": "Office"
  }'
```

## 💻 Laptop Agent

The laptop agent runs on client devices and sends periodic heartbeats.

```bash
cd laptop-agent
pnpm install
node agent.js
```

The agent:
- Sends heartbeat every 30 seconds
- Auto-detects device hostname, local IP, and public IP
- Updates lastSeen timestamp

## 📦 Database Models

### Device Schema

```javascript
{
  deviceId: String (unique, required),
  assignedEmployee: String (required),
  publicIP: String,
  localIP: String,
  location: String,
  status: "Active" | "Inactive",
  lastSeen: Date,
  timestamps: { createdAt, updatedAt }
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
# - Go to vercel.com → Import Project
# - Select your repository
# - Configure environment variables
# - Deploy

# 3. Set environment variables in Vercel:
# MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/tracks-ip
```

### Manual Deployment

```bash
# 1. Build
pnpm build

# 2. Start production server
pnpm start
```

## 🔒 Security Best Practices

- ✅ Use environment variables for sensitive data
- ✅ Validate all inputs on register/heartbeat endpoints
- ✅ Use unique indexes on `deviceId` to prevent duplicates
- ✅ Implement rate limiting on API endpoints (TODO)
- ✅ Add authentication to admin routes (TODO)
- ✅ HTTPS enforced in production

## 🧪 Testing & Quality

```bash
# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

**CI/CD:** GitHub Actions runs lint, format checks, and builds on every push.

## 🐛 Troubleshooting

### Duplicate Devices Appearing

**Issue:** Same device appears multiple times in the dashboard.

**Fix:** The `/api/devices` endpoint now deduplicates by `deviceId` and filters out invalid records:
- Ensures only the most recent device record per ID is shown
- Filters out records with missing/invalid `assignedEmployee`
- Requires valid employee name (not "User" or empty)

### MongoDB Connection Error

```error
MongooseError: Cannot connect to MongoDB
```

**Fix:**
1. Check `MONGODB_URI` in `.env.local`
2. Ensure MongoDB cluster is running and accessible
3. Whitelist your IP in MongoDB Atlas

### Port Already in Use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

## 📝 Contributing

1. Clone the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Run linting and format: `pnpm lint:fix && pnpm format`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

**Code Style:** ESLint + Prettier enforced via CI

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Check existing issues for solutions
- Review the documentation above

---

**Last Updated:** March 2026  
**Status:** ✅ Production Ready
