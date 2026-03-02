# User Profile Card Component Documentation

## Overview

A reusable user profile card system consisting of two main components:

1. **UserProfileCard.jsx** - Displays detailed user information in an elegant modal card
2. **UserListSection.jsx** - Shows a clickable list of users with built-in profile card management

## Components

### 1. UserProfileCard.jsx

A standalone component that displays detailed user information in a visually appealing card format.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | Object | Yes | User object containing profile data |
| `onClose` | Function | Yes | Callback function triggered when closing the card |
| `isLoading` | Boolean | No | Loading state indicator (default: false) |

#### User Object Structure

```javascript
{
  _id: "string",                    // MongoDB ID or custom ID
  id: "string",                     // Alternative ID field
  display_name: "string",           // User's full name
  email: "string",                  // Email address
  photo_url: "string",              // Profile image URL (optional)
  role: "string",                   // User's role/designation (optional)
  designation: "string",            // Alternative role field
  status: "Active|Inactive",        // User status (default: "Active")
  created_at: "ISO date string",    // Account creation date
  last_login: "ISO date string",    // Last login timestamp (optional)
  activity_count: "number"          // Number of activities (optional)
}
```

#### Features

- ✅ Circular avatar with gradient fallback
- ✅ User name and role/designation display
- ✅ Active/Inactive status badge with color coding
- ✅ Email address display
- ✅ Joined date with last login information
- ✅ Activity count display
- ✅ Smooth fade-in animation
- ✅ Modal backdrop with blur effect
- ✅ Close button with icon
- ✅ Arrow pointer indicator

#### Usage Example

```jsx
import UserProfileCard from './components/UserProfileCard';

const MyComponent = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const user = {
    _id: '123',
    display_name: 'John Doe',
    email: 'john@example.com',
    photo_url: 'https://...',
    role: 'Senior Developer',
    status: 'Active',
    created_at: '2024-01-15T10:30:00Z',
    last_login: '2026-03-01T14:20:00Z',
    activity_count: 45
  };

  return (
    <div>
      {selectedUser && (
        <UserProfileCard 
          user={user}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};
```

---

### 2. UserListSection.jsx

A complete component that manages a list of users and their profile cards with click-to-expand functionality.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `users` | Array | No | Array of user objects |
| `title` | String | No | Section title (default: "Users") |
| `onUserSelect` | Function | No | Callback when a user is selected |

#### Features

- ✅ Clickable user list items with hover effects
- ✅ User avatars with initials fallback
- ✅ Status badge color-coded (green for Active, red for Inactive)
- ✅ Built-in profile card management
- ✅ Toggle behavior (click same user to close)
- ✅ Smooth transitions and animations
- ✅ Responsive design
- ✅ Chevron icon animation
- ✅ Selected state highlighting

#### Usage Example

```jsx
import UserListSection from './components/UserListSection';

const MyPage = () => {
  const [users, setUsers] = useState([
    {
      _id: '1',
      display_name: 'Alice Johnson',
      email: 'alice@example.com',
      status: 'Active',
      created_at: '2024-01-10T10:00:00Z'
    },
    {
      _id: '2',
      display_name: 'Bob Smith',
      email: 'bob@example.com',
      status: 'Inactive',
      created_at: '2024-02-20T15:30:00Z'
    }
  ]);

  const handleUserSelect = (user) => {
    console.log('User selected:', user);
  };

  return (
    <UserListSection 
      users={users}
      title="Team Members"
      onUserSelect={handleUserSelect}
    />
  );
};
```

---

## Styling & Customization

### Color Scheme

Both components use Tailwind CSS with a modern dark theme:

- **Primary Colors**: Blue (`blue-400`, `blue-500`)
- **Secondary Colors**: Purple (`purple-500`)
- **Status Colors**:
  - Active: Green (`green-400`, `green-500/20`)
  - Inactive: Red (`red-400`, `red-500/20`)
- **Background**: Gray shades (`gray-800`, `gray-900`)

### Responsive Design

- **Mobile**: Single column layout, full-width cards
- **Tablet**: Adjusted spacing and font sizes
- **Desktop**: Multi-column layouts supported

### Animations

- **Fade In**: `animate-fade-in` (defined in index.css)
- **Hover Effects**: Smooth color and background transitions
- **Chevron Rotation**: 90-degree rotation on selection

To add custom animations, update the `@keyframes` in your CSS:

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
```

---

## Integration Guide

### 1. Basic Integration in Existing Page

```jsx
import { useEffect, useState } from 'react';
import UserListSection from '../components/UserListSection';

const UserPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from API
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  return (
    <div className="p-6">
      <UserListSection 
        users={users}
        title="All Users"
      />
    </div>
  );
};

export default UserPage;
```

### 2. With Custom Callback

```jsx
<UserListSection 
  users={users}
  title="Select a User"
  onUserSelect={(user) => {
    console.log('Selected:', user);
    // Trigger other actions based on selection
    fetchUserDetails(user.id);
  }}
/>
```

### 3. Standalone Usage

Use `UserProfileCard` directly without the list:

```jsx
const [selectedUser, setSelectedUser] = useState(null);

return (
  <div className="relative">
    {/* Your custom user list or buttons */}
    <button onClick={() => setSelectedUser(userData)}>
      View Profile
    </button>

    {/* Profile Card */}
    {selectedUser && (
      <UserProfileCard 
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    )}
  </div>
);
```

---

## Data Transformation

If your user data has different field names, transform it before passing:

```jsx
const transformedUsers = apiUsers.map(user => ({
  _id: user.userId,
  display_name: user.fullName,
  email: user.emailAddress,
  photo_url: user.profileImage,
  role: user.department,
  status: user.isActive ? 'Active' : 'Inactive',
  created_at: user.registeredDate,
  last_login: user.lastAccessTime,
  activity_count: user.totalActivities
}));

<UserListSection users={transformedUsers} />
```

---

## Behavior & State Management

### Selection Logic

- **Click user item**: Shows profile card for that user
- **Click same user again**: Closes the profile card
- **Click different user**: Updates profile card with new user data
- **Click close button**: Hides the profile card
- **Click backdrop**: Closes the profile card

### State Tracking

The component maintains:
- `selectedUser`: Currently selected user object
- `selectedUserRef`: Reference to clicked element (for positioning)
- `hoveredUserId`: For future hover state enhancements

---

## Advanced Features

### 1. Search/Filter Integration

```jsx
const [searchTerm, setSearchTerm] = useState('');

const filteredUsers = users.filter(user =>
  user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.email.toLowerCase().includes(searchTerm.toLowerCase())
);

<UserListSection users={filteredUsers} />
```

### 2. Sorting Users

```jsx
const sortedUsers = [...users].sort((a, b) => 
  a.display_name.localeCompare(b.display_name)
);

<UserListSection users={sortedUsers} />
```

### 3. Status Filtering

```jsx
const activeUsers = users.filter(u => u.status === 'Active');
const inactiveUsers = users.filter(u => u.status === 'Inactive');

// Display both sections
<UserListSection users={activeUsers} title="Active Users" />
<UserListSection users={inactiveUsers} title="Inactive Users" />
```

### 4. Pagination

```jsx
const [page, setPage] = useState(1);
const itemsPerPage = 10;
const startIdx = (page - 1) * itemsPerPage;
const paginatedUsers = users.slice(startIdx, startIdx + itemsPerPage);

<UserListSection users={paginatedUsers} />
```

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Optimization

### For Large User Lists

1. **Implement virtualization** for lists with 100+ items
2. **Use React.memo** to prevent unnecessary re-renders
3. **Lazy load images** using `loading="lazy"` attribute
4. **Implement infinite scroll** for better UX

```jsx
const MemoizedUserListSection = React.memo(UserListSection);
```

### Lazy Loading Profile Images

```jsx
{user.photo_url ? (
  <img
    src={user.photo_url}
    alt={user.display_name}
    loading="lazy"
    className="w-full h-full object-cover"
  />
) : null}
```

---

## Troubleshooting

### Card Not Appearing

- Ensure `z-50` class is applied (check CSS conflicts)
- Verify `onClose` prop is properly passed
- Check if `animate-fade-in` animation is defined in CSS

### Avatar Not Loading

- Verify `photo_url` is a valid HTTP/HTTPS URL
- Check CORS settings on image server
- Fallback to initials will display if image fails

### State Not Updating

- Ensure user object has unique `_id` or `id` field
- Use functional setState if updating based on previous state
- Check React DevTools for state changes

---

## Example: Complete User Management Page

See `UserManagement.jsx` for a complete working example that includes:
- Fetching users from API
- Displaying user list with profile cards
- Status badges
- Logout functionality
- Loading states
- Error handling

---

## Files Created

1. **UserProfileCard.jsx** - Core profile display component
2. **UserListSection.jsx** - List and card management component
3. **UserManagement.jsx** - Demo/example page
4. **App.jsx** - Updated with `/admin/users` route

## Related Components

- **AdminDashboard.jsx** - Contains hover card for users (different from this component)
- **Layout.jsx** - Main app layout with profile photo in header

