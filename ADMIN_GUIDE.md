# Admin Dashboard Guide

## Overview
The Admin Dashboard provides comprehensive monitoring and analytics for ThinkInk AI-Notes application. Admins can track user activities, view statistics, and analyze feature usage.

## Admin Access

### Credentials
- **Username**: `admin`
- **Password**: `thinkink3137`

### Accessing Admin Panel
1. Navigate to `http://localhost:3000/admin/login` (or your application's admin login page)
2. Enter the admin credentials
3. Click "Admin Login" to access the dashboard

## Dashboard Features

### 1. Overview Tab
The overview page displays key statistics and recent activities.

#### Statistics Cards
- **Total Users**: Complete count of all registered users
- **Active Users (7d)**: Users who logged in within the last 7 days
- **Inactive Users**: Users who haven't logged in within 7 days
- **Created Today**: New user registrations today

#### Recent Activities
Shows the 10 most recent activities across the platform with:
- Feature type (notes, voice, pdf, quiz, etc.)
- User ID
- Timestamp
- Activity status (completed, failed, pending)

### 2. Users Tab
Displays a searchable list of all registered users with detailed information.

#### Features
- **Search**: Filter users by email or display name
- **User Information**:
  - Display Name
  - Email Address
  - Join Date
  - Last Login Date
- **View User Activities**: Click "View" to see a specific user's activity history

#### User Activity Breakdown
When viewing a user's activities, you can see:
- Feature usage breakdown by type
- Total activities count
- Detailed activity timestamps
- Activity status

### 3. Activities Tab
Shows all user activities across the platform or filtered by specific user.

#### Activity Details
- **Feature Type**: Which feature was used (notes, voice, pdf, quiz, mindmap, eli5, image, research, knowledge-gap, etc.)
- **User ID**: Identifier of the user performing the action
- **Timestamp**: When the activity occurred
- **Status**: Whether the action was completed, failed, or pending

#### Features
- View all activities in real-time
- Click on a user to filter activities by that user
- View feature breakdown for selected user

### 4. Analytics Tab
Comprehensive analytics and insights about system usage.

#### Feature Usage Chart
Visual representation of which features are most used:
- Bar chart showing usage count for each feature
- Helps identify popular features and user preferences
- Useful for planning feature improvements

#### Status Breakdown
Statistics about activity outcomes:
- Number of completed activities
- Number of failed activities
- Percentage breakdown with visual progress bars

## Use Cases

### Monitoring User Growth
1. Go to **Overview** tab
2. Check "Total Users" and "Created Today" cards
3. Trend analysis helps identify growth patterns

### Analyzing Feature Adoption
1. Go to **Analytics** tab
2. View the "Feature Usage" chart
3. Identify which features are most/least used

### Investigating User Issues
1. Go to **Users** tab
2. Search for the user's email
3. Click "View" to see their activity history
4. Check for failed activities or unusual patterns

### Identifying Active vs. Inactive Users
1. Go to **Overview** tab
2. Compare "Active Users (7d)" with "Total Users"
3. Use this to plan engagement strategies

### Real-time Activity Monitoring
1. Go to **Activities** tab
2. View recent activities across all users
3. Monitor system health and feature usage patterns

## Security Notes

⚠️ **Important Security Considerations**:
- Keep admin credentials secure and confidential
- Only share access with trusted administrators
- Admin token is stored in browser localStorage
- Always logout when finished using the admin panel
- Consider changing the admin password through environment variables in production

## Accessing the Admin Panel Programmatically

If you need to access admin data programmatically, use the admin service:

```javascript
import adminService from './services/adminService';

// Login
const loginResponse = await adminService.login('admin', 'thinkink3137');
const token = loginResponse.admin_token;

// Get stats
const stats = await adminService.getDashboardStats(token);

// Get users
const usersData = await adminService.getAllUsers(token, 0, 50);

// Get activities
const activities = await adminService.getAllActivities(token, 100);

// Get analytics
const analytics = await adminService.getAnalytics(token);
```

## API Endpoints

All admin endpoints require the `admin_token` query parameter.

### Authentication
- `POST /api/admin/login` - Login with credentials

### Dashboard
- `GET /api/admin/dashboard/stats` - Get user statistics
- `GET /api/admin/users` - Get paginated user list
- `GET /api/admin/activities` - Get recent activities
- `GET /api/admin/user/{user_id}/activities` - Get specific user's activities
- `GET /api/admin/analytics` - Get detailed analytics

## Troubleshooting

### Cannot Access Admin Dashboard
- Verify you're using the correct credentials
- Check that the backend API is running
- Ensure CORS is properly configured

### No Data Showing
- Verify there is user data in the database
- Check that users have performed activities
- Ensure the admin token is valid

### Performance Issues
- Limit the number of records fetched using pagination
- Consider time ranges for historical data
- Optimize database indexes for large datasets

## Future Enhancements

Potential features for future development:
- Export data to CSV/PDF
- Advanced filtering and search
- Custom date ranges for analytics
- User segmentation and cohort analysis
- Automated alerts for unusual activity
- User communication/notification system
- Feature rollout management
- A/B testing capabilities

## Support

For issues with the admin dashboard, contact the development team or check the application logs for detailed error messages.
