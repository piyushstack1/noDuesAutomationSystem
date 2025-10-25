# NoDuesAutomation

A modern, responsive web application for managing no-dues clearance processes with role-based access control.

## Features

- **Role-based Authentication**: Student, Admin, and Approving Unit roles
- **Modern UI**: Built with React, TailwindCSS, and shadcn/ui components
- **Dark Mode**: Persistent theme switching with smooth transitions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Powered by Framer Motion
- **State Management**: Zustand with persistence for auth, theme, and application data
- **Protected Routes**: Secure navigation based on user roles
- **Real-time Notifications**: Toast notifications and notification bell
- **Query System**: Interactive query and response system between units and students
- **Approval Timeline**: Visual progress tracking for applications
- **Certificate Generation**: PDF certificate download functionality
- **Mobile-First Design**: Collapsible sidebar and responsive layouts

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Navbar.jsx         # Top navigation bar
│   ├── Sidebar.jsx        # Role-based sidebar navigation
│   ├── ThemeToggle.jsx    # Dark/light mode toggle
│   ├── ProtectedRoute.jsx # Route protection component
│   ├── StatusBadge.jsx    # Status indicator component
│   ├── ApprovalTimeline.jsx # Application progress timeline
│   ├── QueryModal.jsx     # Query/response modal
│   ├── Toast.jsx          # Notification toast system
│   ├── Loader.jsx         # Loading components
│   └── NotificationBell.jsx # Notification dropdown
├── layout/
│   └── DashboardLayout.jsx # Main dashboard layout
├── pages/
│   ├── auth/              # Authentication pages
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ForgotPassword.jsx
│   ├── dashboard/         # Role-specific dashboards
│   │   ├── StudentDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── UnitDashboard.jsx
│   ├── student/           # Student-specific pages
│   │   ├── ApplyPage.jsx
│   │   ├── TrackStatusPage.jsx
│   │   ├── QueriesPage.jsx
│   │   ├── HistoryPage.jsx
│   │   └── ProfilePage.jsx
│   ├── admin/             # Admin-specific pages
│   │   ├── AdminRequestsPage.jsx
│   │   ├── AdminApprovedPage.jsx
│   │   ├── AdminCertificatesPage.jsx
│   │   ├── AdminManageStudentsPage.jsx
│   │   └── AdminManageUnitsPage.jsx
│   └── unit/              # Unit-specific pages
│       ├── UnitRequestsPage.jsx
│       ├── UnitQueriesPage.jsx
│       └── UnitProfilePage.jsx
├── store/
│   ├── useAuthStore.js    # Authentication state
│   ├── useThemeStore.js    # Theme state
│   ├── useNoDuesStore.js   # Application and query data
│   └── useNotificationStore.js # Notification management
├── lib/
│   └── utils.js          # Utility functions
├── router.jsx            # Application routing
├── App.jsx              # Main app component
└── main.jsx             # Application entry point
```

## User Roles & Features

### Student Portal
- **Dashboard**: Overview of application status and statistics
- **Apply for No Dues**: Submit new no-dues clearance applications
- **Track Status**: Monitor application progress with visual timeline
- **Queries**: View and respond to queries raised by approving units
- **History**: View all previous applications with filtering options
- **Profile**: Manage personal information and academic details

### Admin Panel
- **Dashboard**: System overview with analytics and statistics
- **Pending Requests**: Review and approve/reject applications
- **Approved Applications**: View all approved applications
- **Certificates**: Generate and download no-dues certificates
- **Manage Students**: CRUD operations for student accounts
- **Manage Units**: Configure approving units and their settings

### Unit Portal (Department, Library, Accounts, Hostel, Proctor, Sports)
- **Dashboard**: Unit-specific statistics and overview
- **Pending Requests**: Review applications requiring unit approval
- **Queries**: Manage queries raised to students
- **Profile**: Unit information and settings management

## Key Features

### Authentication Flow
1. **Login**: Users select their role and enter credentials
2. **Signup**: Students can create new accounts
3. **Forgot Password**: Password reset functionality
4. **Protected Routes**: Automatic redirection based on authentication status
5. **Role-based Navigation**: Different dashboards and features per role

### Application Management
- **Multi-step Approval Process**: Applications go through multiple units
- **Visual Timeline**: Track progress through each approving unit
- **Query System**: Units can raise queries for clarification
- **Status Tracking**: Real-time status updates (Pending, Approved, Rejected, Query Raised)
- **Certificate Generation**: Automatic certificate creation upon approval

### Notification System
- **Real-time Notifications**: Toast messages for important actions
- **Notification Bell**: Persistent notification center
- **Status Updates**: Automatic notifications for application status changes
- **Query Alerts**: Notifications when queries are raised or resolved

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Collapsible Sidebar**: Mobile-friendly navigation
- **Touch-Friendly**: Large touch targets and gestures
- **Adaptive Layout**: Content adjusts to screen size

## Dark Mode

The application includes a persistent dark mode toggle that:
- Saves user preference in localStorage
- Syncs with Tailwind's dark class
- Provides smooth transitions between themes
- Maintains consistency across all components

## State Management

### Zustand Stores
- **useAuthStore**: User authentication and profile data
- **useThemeStore**: Theme preferences (light/dark)
- **useNoDuesStore**: Application data, queries, and user management
- **useNotificationStore**: Notification queue and management

### Data Persistence
- Authentication state persists across browser sessions
- Theme preferences are saved locally
- Application data is maintained during the session
- Mock data is provided for demonstration purposes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Create components in appropriate directories
2. Add routes to `router.jsx`
3. Update navigation in `Sidebar.jsx` for role-specific items
4. Follow the existing patterns for state management and styling
5. Use the established component library for consistency

### Component Guidelines

- Use shadcn/ui components for consistency
- Follow the established color scheme and spacing
- Implement proper loading states and error handling
- Include animations using Framer Motion
- Ensure mobile responsiveness
- Add proper TypeScript types when extending

## API Integration

The application is designed to be easily integrated with backend APIs:

- **Authentication**: Replace mock login with actual API calls
- **Data Fetching**: Connect Zustand stores to real data sources
- **File Upload**: Implement actual file upload for documents
- **Certificate Generation**: Connect to PDF generation service
- **Real-time Updates**: Add WebSocket support for live updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Test thoroughly on different screen sizes
5. Submit a pull request

## License

This project is licensed under the MIT License.
