Based on the EventSpark Overview wiki page and codebase context, you're asking for a complete README markdown file for the EventSpark virtual event management platform. Here's the full markdown code:

```markdown
# EventSpark

A comprehensive virtual event management platform that enables users to create, discover, register for, and participate in online events.

## 🚀 Features

- **Event Discovery**: Browse and search through available virtual events
- **User Registration**: Register as participant or organizer for events
- **Event Creation**: Admin interface for creating and managing events
- **Role-Based Dashboard**: Personalized views for admins, organizers, and participants
- **Meeting Integration**: Google Meet link management for virtual events
- **Interactive Help System**: Chat-based user support
- **Responsive Design**: Mobile-friendly interface across all devices

## 🏗️ Architecture

EventSpark is built as a client-side single-page application (SPA) with a modular architecture:

```
client/
├── index.html              # Landing page with tap-to-login
├── layout.css              # Global styles and responsive design
├── home/                   # Main dashboard and welcome interface
├── events/                 # Event browsing and discovery
├── dashboard/              # Role-based user dashboard
├── conductEvent/           # Admin event creation interface
├── moredetails/           # Detailed event information view
├── eventRegistering/      # User registration for events
├── dashboardAdminTable/   # Admin registration management
└── help/                  # Interactive user support
```

## 🎯 User Roles

### Admin Users
- Create and manage events
- View event registrants
- Send Google Meet links to participants
- Access administrative dashboard

### Organizer Users
- Register as event organizers
- View organized events
- Access meeting links when available

### Participant Users
- Browse and discover events
- Register for events
- View participated events
- Access meeting links

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: JWT (JSON Web Tokens)
- **Icons**: Ionicons
- **Meeting Integration**: Google Meet
- **Design**: Responsive CSS with mobile-first approach

## 🎨 Design System

### Color Palette
- Primary Blue: `#2a2185`
- Background: `#D3CCE3`
- Text: `#222` (primary), `#999` (secondary)
- Accent: `#f5f5f5`

### Responsive Breakpoints
- Desktop: >768px (full sidebar navigation)
- Tablet: ≤768px (collapsible sidebar)
- Mobile: ≤480px (overlay navigation)

## 🚦 Getting Started

1. **Access the Application**
   - Open `client/index.html` in your browser
   - Tap anywhere to proceed to login

2. **Authentication**
   - Login with your credentials
   - JWT token is stored in localStorage for session persistence

3. **Navigation**
   - Use the sidebar navigation to access different modules
   - Home: Welcome dashboard with upcoming events
   - Events: Browse and search available events
   - Dashboard: Role-based personal event management
   - Help: Interactive support system

## 📱 User Interface

### Navigation Structure
- **EventSpark Logo**: Return to home
- **Home**: Main dashboard
- **Types**: Event categories
- **Events**: Event browsing
- **Dashboard**: Personal event management
- **Help**: User support
- **Sign Out**: Logout functionality

### Dashboard Features
- **Summary Cards**: Event counts by role
- **Admin Events Table**: Event management with registrant links
- **Organizer Events**: Events you're organizing
- **Participant Events**: Events you've joined

## 🔗 API Integration

The application communicates with backend services through RESTful endpoints:

- `GET /dashboard/:username` - User dashboard data
- `PUT /events/:id/meetlink` - Update meeting links
- `GET /events/get-all` - Retrieve all events
- `POST /events/create-event` - Create new events

## 🔐 Authentication Flow

1. User accesses landing page
2. Redirected to login interface
3. JWT token generated and stored
4. Token validated on protected pages
5. Role-based interface rendered

## 📋 Event Management

### For Admins
- Create events through `conductEvent/` interface
- Manage registrations via `dashboardAdminTable/`
- Send Google Meet links with URL validation
- View participant counts and details

### For Users
- Browse events in `events/` module
- View detailed information in `moredetails/`
- Register through `eventRegistering/` interface
- Access personal dashboard for event tracking

## 🆘 Support System

Interactive help system available through the `help/` module provides:
- Chat-based assistance
- FAQ and troubleshooting
- User guidance for platform features

## 🔧 Development

### File Structure
Each module follows a consistent pattern:
- `index.html` - Page structure
- `style.css` - Module-specific styles
- `module.js` - JavaScript functionality

### Global Resources
- `layout.css` - Shared styles and responsive design
- `script.js` - Common JavaScript utilities
- `website_logo.ico` - Application favicon

## 📄 License

This project is an EAD Mini Project Group assignment.

---

**EventSpark** - Experience seamless and interactive virtual events
```
