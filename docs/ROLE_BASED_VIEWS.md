# SITTI Role-Based Views Implementation

## Overview

This document describes the role-based architecture implemented for SITTI (Sistema Integral de Tickets de Tecnología e Infraestructura). The system maintains the 3 existing user roles and provides separate, specialized UX experiences while reusing the same design system and shared components.

## Architecture

### User Roles

The system maintains **3 existing roles**:

1. **Usuario (User)** - Regular users who create support tickets
2. **Técnico (Technician)** - Technical staff who resolve tickets  
3. **Administrador (Administrator)** - System administrators

### Key Design Principles

- ✅ **Role-based UX**: Each role has dedicated views optimized for their workflows
- ✅ **Shared Design System**: All views use consistent Tailwind CSS styling
- ✅ **Reusable Components**: Common components (Card, Button, Badge, AppShell) are shared across roles
- ✅ **Mock Data**: Typed mock data simulates real database operations
- ✅ **Frontend-Only Role Checks**: Role checks are for UX only; backend remains responsible for security
- ✅ **No Fake Business Logic**: Views display data without simulated operations

## Project Structure

```
app/
├── components/
│   ├── common/
│   │   ├── Card.tsx          # Reusable card component
│   │   ├── Button.tsx        # Button variants (primary, secondary, danger, ghost)
│   │   └── Badge.tsx         # Status and Priority badges
│   ├── layout/
│   │   └── AppShell.tsx      # Reusable layout shell with role-based navigation
│   └── ...
├── context/
│   └── AuthContext.tsx       # Authentication state management
├── types/
│   └── user.ts              # All type definitions (User, Ticket, Area, Category, etc.)
├── utils/
│   ├── mockData.ts          # Mock data for all entities
│   ├── navigationConfig.ts  # Role-specific navigation configuration
│   └── ...
├── routes/
│   ├── login.tsx            # Login page with role selection
│   ├── usuario/
│   │   ├── dashboard.tsx    # User dashboard
│   │   ├── tickets.tsx      # My tickets list
│   │   ├── tickets.new.tsx  # Create new ticket
│   │   ├── tickets.$id.tsx  # Ticket detail view
│   │   ├── notificaciones.tsx
│   │   └── perfil.tsx       # User profile
│   ├── tecnico/
│   │   ├── dashboard.tsx    # Technician dashboard
│   │   ├── asignados.tsx    # Assigned tickets
│   │   ├── cola.tsx         # Work queue (priority-ordered)
│   │   ├── tickets.$id.tsx  # Ticket detail with work log
│   │   ├── pendientes.tsx   # Pending tickets
│   │   ├── resueltos.tsx    # Resolved tickets
│   │   ├── notificaciones.tsx
│   │   └── perfil.tsx
│   └── admin/
│       ├── dashboard.tsx    # Admin dashboard with system overview
│       ├── tickets.tsx      # All tickets with filters
│       ├── tickets.$id.tsx  # Ticket detail with admin controls
│       ├── usuarios.tsx     # User management
│       ├── areas.tsx        # Area management
│       ├── categorias.tsx   # Category management
│       ├── reportes.tsx     # System reports
│       ├── configuracion.tsx # System settings
│       └── perfil.tsx       # Admin profile
└── root.tsx                 # App layout with AuthProvider and AppShell
```

## User Role Views

### Usuario (User) - 6 Views

| View | Purpose | Features |
|------|---------|----------|
| Dashboard | Overview of personal tickets | Stats cards, recent tickets list |
| Mis Tickets | List user's tickets with filtering | Filter by status, priority indicators |
| Nuevo Ticket | Create support request | Form with area/category selection, priority picker |
| Ticket Detail | View single ticket | Description, comments section, metadata sidebar |
| Notificaciones | Activity notifications | Timeline of ticket updates |
| Perfil | User profile management | Edit personal info, view role |

**Key Features:**
- Create and track personal support tickets
- Real-time status updates
- Simple, focused interface
- Profile and notification management

### Técnico (Technician) - 8 Views

| View | Purpose | Features |
|------|---------|----------|
| Dashboard | Work overview | Stats, priority queue, available tickets |
| Tickets Asignados | All assigned tickets | Filter by status, quick access to work |
| Cola de Trabajo | Priority-ordered queue | Ranked by urgency, take/claim tickets |
| Ticket Detail | Resolve tickets | Work log, status updates, metadata |
| Tickets Pendientes | Active work items | Abierto + En-progreso, days tracking |
| Tickets Resueltos | Completed work | Resolution time metrics, performance stats |
| Notificaciones | Work alerts | New assignments, escalations, comments |
| Perfil | Tech profile | Stats (resolved count, avg rating) |

**Key Features:**
- Organized work queue by priority
- Detailed ticket resolution workflow
- Performance tracking and metrics
- Work log and status management
- Claim unassigned tickets

### Administrador (Administrator) - 9 Views

| View | Purpose | Features |
|------|---------|----------|
| Dashboard | System overview | Total tickets, areas summary, latest tickets |
| Todos los Tickets | Complete ticket view | Filter by status/priority, global search |
| Ticket Detail | Full ticket management | View/edit, delete, admin controls |
| Usuarios | User management | Create, edit, delete users by role |
| Áreas | Area CRUD | Create/edit/delete support areas |
| Categorías | Category CRUD | Create/edit/delete ticket categories |
| Reportes | System analytics | Charts: by priority, status, resolution time |
| Configuración | System settings | Email, security, session management |
| Perfil | Admin profile | Permissions list, profile management |

**Key Features:**
- Complete system administration
- User and resource management
- Analytics and reporting
- System configuration
- Audit and security settings

## Shared Components

### AppShell Component
Provides consistent layout across all roles:
- **Header**: System title, user info, logout button
- **Sidebar**: Role-specific navigation that auto-hides
- **Main Content**: Role view content with consistent padding

### Reusable Components
- **Card**: Styled container for content sections
- **Button**: Multiple variants (primary, secondary, danger, ghost) and sizes
- **StatusBadge**: Ticket status visualization (abierto, en-progreso, resuelto, cerrado)
- **PriorityBadge**: Priority visualization (baja, media, alta, urgente)

## Mock Data

Located in `app/utils/mockData.ts`:

```typescript
// Sample mock datasets:
- mockUsers (3 users: 1 usuario, 1 técnico, 1 administrador)
- mockAreas (4 areas with managers)
- mockCategories (6 categories across areas)
- mockTickets (8 tickets with various statuses/priorities)

// Helper functions:
- getTicketsByTechnician(id) - Get assigned tickets
- getUnassignedTickets() - Get available tickets
- getUserTickets(id) - Get user's created tickets
- getTicketsByStatus(status) - Filter by status
```

All data is **typed** using interfaces from `types/user.ts`.

## Navigation Configuration

Role-specific navigation is configured in `app/utils/navigationConfig.ts`:

```typescript
navigationConfigs: {
  usuario: { primaryNav: [...], secondaryNav: [...] },
  técnico: { primaryNav: [...], secondaryNav: [...] },
  administrador: { primaryNav: [...], secondaryNav: [...] }
}
```

The `AppShell` component automatically uses the current user's role to load the correct navigation.

## Authentication Flow

1. User lands on `/login` (entry point)
2. Login page displays role selector
3. Mock `AuthContext.login(role)` simulates authentication
4. User is redirected to role-specific dashboard
5. `AppShell` loads role-specific navigation
6. All views have access to current user via `useAuth()` hook

**Note**: This is frontend-only authentication for UX purposes. Backend will implement real security.

## Type System

All types are centralized in `app/types/user.ts`:

```typescript
// User & Auth
- UserRole: "usuario" | "técnico" | "administrador"
- User, AuthState

// Tickets
- TicketStatus, TicketPriority
- Ticket, TicketComment

// Resources
- Area, Category
```

## Styling & Design

- **Framework**: Tailwind CSS v4.2.2
- **Dark Mode**: Full support with `dark:` prefix utilities
- **Responsive**: Mobile-first design with grid/flex layouts
- **Transitions**: Smooth animations for interactive elements
- **Color Scheme**:
  - Primary: Blue (600)
  - Success: Green (500)
  - Warning: Yellow/Orange
  - Danger: Red (600)
  - Neutral: Gray (100-900)

## Key Implementation Details

### Frontend Role Checks
- Role checks determine which views are accessible
- Navigation menu changes based on user role
- Each route checks `useAuth()` for authorization
- **These are UX checks only** - backend enforces actual security

### No Fake Business Logic
- Views don't simulate operations (no fake API calls)
- Comments aren't actually posted
- Status updates don't persist
- Forms collect data but don't submit
- This keeps the frontend clean and focused on UX

### Reusable AppShell
Instead of duplicating layouts:
- Single `AppShell.tsx` component
- Uses role-based navigation config
- Sidebar auto-hides on small screens
- Responsive header with user menu

## Next Steps (Per Requirements)

### Design Review
To be completed:
1. **Animation Audit** - Use `review-animations` skill to verify:
   - Sidebar toggle transitions
   - Navigation highlight animations
   - Modal/popover transitions (if added)
   - Loading state animations

2. **Accessibility Audit** - Use `web-design-guidelines` skill to verify:
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast ratios
   - Focus indicators

## Running the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

The app runs on `http://localhost:5173/`

### Testing Login
1. Go to `/login`
2. Select a role (Usuario, Técnico, or Administrador)
3. Click "Iniciar Sesión"
4. You'll be redirected to the role-specific dashboard

## Important Notes

- ✅ All 3 roles implemented with distinct views
- ✅ Shared design system across roles
- ✅ Reusable components and AppShell
- ✅ Typed mock data
- ✅ Frontend role checks for UX
- ✅ Backend authorization remains untouched
- ⏳ Animation and accessibility audits pending

---

**Last Updated**: 2024-09-06  
**Status**: ✅ Complete - Ready for design review
