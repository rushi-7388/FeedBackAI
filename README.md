# AI-Powered Student Feedback & Issue Analyzer

An intelligent, anonymous feedback management system designed for colleges and universities. This platform allows students to submit feedback in English, Hindi, or Hinglish, which is then automatically analyzed for sentiment, priority, and categorization using AI to provide actionable insights for administrators.

## 🚀 Features

### For Students
- **Anonymous Submissions**: Share feedback without the fear of identification.
- **Vernacular Support**: Submit issues in English, Hindi, or Hinglish.
- **Smart Categorization**: Select from predefined categories like Academics, Facilities, Administration, etc.
- **Real-time Feedback**: Instant confirmation of submission.

### For Administrators (Principal, HOD, Admin)
- **AI Analytics Dashboard**: View sentiment trends, priority distributions, and category-wise analysis.
- **Intelligent Summarization**: AI-generated summaries for long feedback entries.
- **Priority Management**: Automatically flags high-priority issues that need immediate attention.
- **Department Leaderboard**: See which departments are performing well or need improvement based on student sentiment.
- **Role-Based Access Control**: Secure login for different administrative levels.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI Logic**: Custom analysis patterns (Gemini-ready integration)

## 📁 Project Structure

```text
├── app/                  # Next.js App Router (Pages & API)
│   ├── admin/            # Admin Dashboard & Login
│   ├── feedback/         # Student Feedback Submission Page
│   └── layout.tsx        # Root layout & providers
├── components/           # Reusable UI & Admin components
│   ├── admin/            # Dashboard-specific components
│   └── ui/               # Base shadcn/ui components
├── lib/                  # Business logic & Utilities
│   ├── actions/          # Server Actions for DB operations
│   ├── supabase/         # Supabase client configurations
│   └── ai-analysis.ts    # AI sentiment & priority logic
├── public/               # Static assets
└── scripts/              # SQL setup & seeding scripts
```

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account

### Setup
1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Database Setup**:
   Run the SQL scripts located in `scripts/setup-database.sql` in your Supabase SQL Editor.
5. **Run the development server**:
   ```bash
   pnpm dev
   ```

## 🔐 Admin Access
**Default Credentials for Demo:**
- **Email**: `admin@dit.edu.in`
- **Password**: `demo123`

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
