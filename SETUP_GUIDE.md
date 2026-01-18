# AI-Powered Student Feedback & Issue Analyzer - Setup Guide

## Overview
This is a college-scale feedback management system that collects anonymous student feedback and provides intelligent analysis for administrators. The system is built with role-based access control - only authorized administrators (Principal, HOD, Admin) can access the admin dashboard.

## Architecture

### User Hierarchy
- **Students/All Users** → Can submit anonymous feedback
- **Admins/Principals/HODs** → Can access admin dashboard and analytics
- **College Entity** → Manages multiple faculties, departments, and users

### Database Schema

#### Core Tables
- `colleges` - College information
- `faculties` - College faculties
- `departments` - Department information
- `users` - User accounts with role-based access
- `roles` - User roles (student, faculty, hod, principal, admin)
- `feedback` - Student feedback submissions
- `feedback_categories` - Feedback categories per college
- `feedback_responses` - Admin responses to feedback

## Key Features

### 1. Student Feedback Submission (`/feedback`)
- Anonymous feedback submission (no login required)
- Optional category selection
- Real-time AI analysis
- Auto-categorization and sentiment analysis
- Automatic priority level assignment

### 2. Admin Dashboard (`/admin/dashboard`)
- **Access Control**: Only users with admin/principal/hod roles can access
- **Demo Credentials**: 
  - Email: `admin@dit.edu.in`
  - Password: `demo123`
- **Features**:
  - Real-time feedback analytics
  - Advanced filtering (category, priority, sentiment)
  - Full-text search
  - Expandable feedback rows with AI summaries
  - Dashboard stats (total, high-priority, sentiment distribution)

### 3. Role-Based Access Control
Admin portal is NOT exposed to every student. Access control is enforced by:
1. Login verification in `/admin/login`
2. Server-side role checking in `adminLogin` function
3. Session-based authentication with HTTP-only cookies

## Workflow

### Submitting Feedback
```
Student → /feedback form → submitFeedback() → Supabase
  ↓
AI Analysis (categoryization, sentiment, priority)
  ↓
Stored in feedback table with metadata
```

### Viewing Analytics
```
Admin → /admin/login → adminLogin() → Session stored
  ↓
/admin/dashboard → getFeedbackForAdmin() → Supabase
  ↓
Display with filters and analysis
```

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database Sample Data
The system comes pre-seeded with:
- **College**: Delhi Institute of Technology (DIT)
- **Faculties**: Engineering, Management, Science
- **Departments**: Various departments under each faculty
- **Admin User**: admin@dit.edu.in (role: admin)
- **Sample Feedback**: 8 pre-populated feedback entries

## Security Features

1. **Row Level Security (RLS)** - Application-level control enforced
2. **HTTP-Only Cookies** - Session tokens stored securely
3. **Role-Based Access** - Only admin/principal/hod can access dashboard
4. **Parameterized Queries** - Prevention of SQL injection
5. **Anonymous Submissions** - No user tracking unless explicitly provided

## AI Analysis Features

Currently using keyword-based analysis with mock data. Ready for integration with:
- **Gemini API** - For advanced NLP
- **Custom ML Models** - For sentiment analysis
- **Pattern Recognition** - For issue identification

### Analysis Includes
- **Category**: Academic, Facilities, Student Life, Administration, Safety, Other
- **Priority**: High, Medium, Low
- **Sentiment**: Positive, Neutral, Negative
- **Summary**: AI-generated brief summary

## Testing the System

### 1. Submit Feedback
1. Navigate to `/feedback`
2. Select category (e.g., "Facilities & Campus")
3. Enter feedback text
4. Submit

### 2. View in Admin Dashboard
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `admin@dit.edu.in`
   - Password: `demo123`
3. Go to `/admin/dashboard`
4. See submitted feedback in the table
5. Filter and search feedback

## API Endpoints

### Server Actions (Client → Server)

**`submitFeedback(formData)`**
- Parameters: `collegeId`, `category`, `text`, `isAnonymous`
- Returns: `{ success: boolean, data?: Feedback, error?: string }`

**`getFeedbackForAdmin(adminToken)`**
- Parameters: `adminToken` from session
- Returns: `{ success: boolean, data: Feedback[], error?: string }`

**`adminLogin(email, password)`**
- Parameters: `email`, `password`
- Returns: `{ success: boolean, user?: User, error?: string }`

**`updateFeedbackStatus(feedbackId, status, responseText?)`**
- Parameters: `feedbackId`, `status`, optional `responseText`
- Returns: `{ success: boolean, error?: string }`

## Customization Guide

### Change College
In `/app/feedback/page.tsx` and `/lib/actions/feedback.ts`:
```typescript
const collegeId = '550e8400-e29b-41d4-a716-446655440001' // Change this
```

### Add More Admins
Insert into `users` table with role_id matching admin/principal/hod role

### Customize Categories
Modify `ISSUE_TYPES` in `/app/feedback/page.tsx`

### Change Theme Colors
Edit color tokens in `/app/globals.css` (primary, secondary, accent)

## Production Deployment

Before deploying to production:

1. **Authentication**:
   - Replace demo password check with bcrypt verification
   - Implement proper token generation and validation

2. **Database**:
   - Enable Row Level Security (RLS) policies
   - Set up proper backup and recovery

3. **AI Integration**:
   - Replace mock analysis with Gemini API
   - Add rate limiting for API calls

4. **Security**:
   - Enable HTTPS
   - Add CORS policies
   - Implement rate limiting
   - Add audit logging

## Troubleshooting

### Feedback not showing in dashboard
- Check database connection in Supabase
- Verify college ID matches between submission and admin view
- Check browser console for errors

### Admin login fails
- Verify credentials: `admin@dit.edu.in` / `demo123`
- Check that user exists in database with admin role
- Clear browser cookies and try again

### AI Analysis not working
- Check feedback text is not empty
- Verify analysis function in `/lib/ai-analysis.ts`
- Check browser console for JavaScript errors

## Next Steps

1. **Integration with Real College Data**: Replace mock data with your college's actual structure
2. **Multi-College Support**: Extend for multiple colleges sharing one instance
3. **Email Notifications**: Send alerts for high-priority feedback
4. **Analytics Dashboard**: Add charts and trends visualization
5. **Export Features**: CSV/PDF export of feedback analytics
6. **Mobile App**: Build native app for feedback submission
