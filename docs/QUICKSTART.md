# SITTI Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js > 22.22.0
- npm or yarn

### Installation
```bash
cd /home/lxrdszn/Desktop/Projects/sitti
npm install
```

### Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

## 🔐 Login Instructions

1. Navigate to the login page (you'll be redirected automatically)
2. Select one of three roles:
   - **Usuario** (User): Creates and tracks support tickets
   - **Técnico** (Technician): Manages and resolves tickets
   - **Administrador** (Administrator): Manages system

3. Click "Iniciar Sesión"
4. You'll be redirected to the role-specific dashboard

### Demo Credentials

No password needed - this is a mock authentication system.

**Demo Users:**

| Role | Name | Email |
|------|------|-------|
| Usuario | Carlos Rodríguez | carlos.rodriguez@company.com |
| Técnico | María García | maria.garcia@company.com |
| Administrador | Juan López | juan.lopez@company.com |

## 📊 What to Explore

### Usuario (User) Path
1. **Dashboard** - View your ticket statistics
2. **Mis Tickets** - See all tickets you've created
   - Filter by status (Abiertos, En Progreso, Resueltos)
3. **Nuevo Ticket** - Create a new support request
   - Fill out the form with:
     - Title
     - Description
     - Area (Infraestructura, Aplicaciones, etc.)
     - Category (Hardware, Software, etc.)
     - Priority (Baja, Media, Alta, Urgente)
4. **Ticket Detail** - Click any ticket to view details
5. **Notificaciones** - View activity notifications
6. **Perfil** - Manage your profile

### Técnico (Technician) Path
1. **Dashboard** - Overview of your workload
   - See assigned tickets
   - Priority queue
   - Available tickets to claim
2. **Tickets Asignados** - All your assigned tickets
3. **Cola de Trabajo** - Work queue sorted by priority
   - Click "Atender" to work on a ticket
4. **Tickets Pendientes** - Active work items
   - Shows days since creation
5. **Tickets Resueltos** - Completed work with metrics
   - Resolution time tracking
6. **Ticket Detail** - Work on a ticket
   - Add work notes
   - Change status
7. **Notificaciones** - Get alerts
8. **Perfil** - View your stats

### Administrador (Administrator) Path
1. **Dashboard** - System overview
   - Total tickets, areas, recent activity
2. **Todos los Tickets** - View all tickets in the system
   - Filter by status and priority
3. **Usuarios** - Manage all users
   - View user list by role
   - Create/Edit/Delete users
4. **Áreas** - Manage support areas
   - Create/Edit/Delete areas
   - Assign area managers
5. **Categorías** - Manage ticket categories
   - Create/Edit/Delete categories
   - Assign to areas
6. **Reportes** - View system analytics
   - Tickets by priority (charts)
   - Tickets by status (charts)
   - Resolution time metrics
7. **Configuración** - Configure system
   - General settings
   - Email configuration
   - Security settings
8. **Perfil** - View admin profile and permissions

## 🎨 Key Features

### For All Users
- ✅ Role-specific navigation
- ✅ Dark mode support (check browser preferences)
- ✅ Responsive design (works on mobile/tablet)
- ✅ Ticket status and priority badges
- ✅ Profile management

### For Technicians
- ✅ Priority-sorted work queue
- ✅ One-click ticket claiming
- ✅ Work log/notes
- ✅ Resolution time tracking
- ✅ Performance metrics

### For Administrators
- ✅ Complete user management
- ✅ System-wide analytics
- ✅ Resource management
- ✅ Configuration controls
- ✅ Global ticket visibility

## 🔧 Development

### Available Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Start production server
npm start
```

### Project Structure
```
app/
├── routes/              # All page routes
│   ├── login.tsx       # Login page
│   ├── usuario/        # User routes (6)
│   ├── tecnico/        # Technician routes (8)
│   └── admin/          # Admin routes (9)
├── components/         # Reusable components
│   ├── common/         # Card, Button, Badge
│   └── layout/         # AppShell
├── context/            # AuthContext for state
├── types/              # TypeScript types
├── utils/              # Mock data, navigation config
└── root.tsx            # App root with providers
```

### Adding New Features

1. **New Route**: Create file in `app/routes/` following the pattern
2. **New Component**: Add to `app/components/` with clear folder structure
3. **Update Types**: Add types to `app/types/user.ts`
4. **Add Mock Data**: Update `app/utils/mockData.ts` if needed

## 📚 Documentation

- **`ROLE_BASED_VIEWS.md`** - Comprehensive architecture guide
- **`IMPLEMENTATION_SUMMARY.md`** - What's been built
- **`QUICKSTART.md`** - This file

## 🚨 Common Issues

### Port already in use
```bash
# Specify a different port
npm run dev -- --port 3000
```

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type errors
```bash
# Run type generation and checking
npm run typecheck
```

## 📝 Notes for Developers

- All routes use **typed mock data** from `mockData.ts`
- No fake API calls - views just display data
- Role checks are for **UX only** - backend should validate
- Uses **React Router v8** with file-based routing
- Styling with **Tailwind CSS v4** with dark mode
- All components are **TypeScript-first**

## 🎯 Next Steps

1. Review animation transitions (sidebar, navigation)
2. Audit accessibility (WCAG compliance)
3. Connect to real backend API
4. Implement business logic (create, update, delete operations)
5. Add real authentication

## ❓ Questions?

Refer to:
- `ROLE_BASED_VIEWS.md` for architecture details
- `IMPLEMENTATION_SUMMARY.md` for what's implemented
- Code comments in individual components

---

**Happy testing!** 🚀

