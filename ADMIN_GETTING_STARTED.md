# Admin System - Quick Start Guide

## Access Admin Panel
**URL**: `http://localhost:3000/admin/login`

Or click the **"Admin"** button on the main login page.

## Login Credentials
```
Username: admin
Password: thinkink3137
```

## Dashboard Sections

### 📊 Overview
- **Total Users**: Complete user count
- **Active Users (7d)**: Users logged in last 7 days
- **Inactive Users**: No login in 7+ days
- **Created Today**: New registrations today
- **Recent Activities**: Latest 10 actions across platform

### 👥 Users Tab
- Search by email or name
- View all registered users
- See registration and last login dates
- Click "View" to see individual user activities
- Pagination support (50 users per page)

### 📈 Activities Tab
- Real-time activity monitoring
- Filter by feature type
- View activity status (completed/failed)
- Click on users to see their specific activities
- Complete activity history with timestamps

### 📉 Analytics Tab
- **Feature Usage Chart**: Which features are most used
- **Status Breakdown**: Completed vs failed activities
- Visual progress bars and statistics
- Trend analysis and patterns

## Common Tasks

### Find a Specific User
1. Go to **Users** tab
2. Type user's email in search box
3. Click "View" next to their name

### Check User's Activity History
1. Find user in Users tab (or go directly from Activities)
2. Click "View" button
3. See all their activities with timestamps and status

### Monitor System Health
1. Check **Overview** tab
2. Look at active vs inactive user ratio
3. Review **Analytics** for feature adoption

### Identify Feature Issues
1. Go to **Activities** tab
2. Filter by feature type
3. Look for "failed" activities
4. Check timestamps to identify when issues occurred

## Features Tracked

The system monitors usage of:
- 📝 Notes
- 🎵 Voice
- 📄 PDF
- 🎯 Quiz
- 🗺️ Mind Map
- 🧠 ELI5 Explanations
- 🖼️ Image Processing
- 📚 History
- 🔍 Research
- 🎓 Knowledge Gap Radar
- 💬 Chatbot

## System Statistics Collected

- Total number of users
- New users per day/week
- User activity frequency
- Feature popularity
- Success/failure rates
- Average usage patterns

## Keyboard Shortcuts
- **Escape**: Exit admin panel (will redirect to login)
- **Click Admin dropdown**: Logout

## Mobile View
- Full responsive design
- Works on tablets and phones
- Touch-friendly interface
- Same features as desktop

## What's Tracked

✅ **User Data**
- Email address
- Display name
- Account creation date
- Last login time
- Status (active/inactive)

✅ **Activity Data**
- Feature used
- User performing action
- When action occurred
- Action status
- Processing time

## Permissions

As admin, you can:
- ✅ View all users
- ✅ See all activities
- ✅ Access analytics
- ✅ View user statistics
- ✅ Monitor system health
- ❌ Edit user data
- ❌ Delete accounts
- ❌ Modify activities

## Tips & Best Practices

1. **Regular Monitoring**: Check the dashboard weekly
2. **Export Data**: Note important statistics for records
3. **Identify Trends**: Use analytics to understand user behavior
4. **Track Issues**: Mark failed activities for investigation
5. **Plan Features**: Use feature usage to prioritize development
6. **User Engagement**: Monitor active vs inactive ratio

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Verify credentials: admin / thinkink3137 |
| No data showing | Ensure users have performed activities |
| Dashboard slow | Try refreshing or limiting date range |
| Page not loading | Check backend API is running on port 8000 |

## Getting Help

1. Read `ADMIN_GUIDE.md` for detailed documentation
2. Check `ADMIN_IMPLEMENTATION.md` for technical details
3. Review backend logs for API errors
4. Check browser console (F12) for client-side issues

## Security Reminders

🔒 **Important**:
- Keep admin credentials secure
- Only share with trusted administrators
- Always logout when finished
- Don't share credentials over email
- Use strong passwords in production
- Monitor for unusual admin login activity

## Production Deployment

Before going live:
1. Change admin password to strong unique password
2. Enable HTTPS for all admin endpoints
3. Set up IP whitelisting
4. Enable audit logging
5. Configure email alerts for security events
6. Regular backup of admin audit logs

---

**Need more details?** Read the full `ADMIN_GUIDE.md` file.

**Questions?** Check `ADMIN_IMPLEMENTATION.md` for technical details.

**Last Updated**: March 1, 2026
