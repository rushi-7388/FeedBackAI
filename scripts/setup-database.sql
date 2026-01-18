-- College Management and Feedback System Schema

-- 1. COLLEGES TABLE
CREATE TABLE colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. FACULTIES TABLE
CREATE TABLE faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  head_name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. DEPARTMENTS TABLE
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  hod_name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. ROLES TABLE
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('student', 'Student role - can submit feedback'),
  ('faculty', 'Faculty/Professor role'),
  ('hod', 'Head of Department'),
  ('principal', 'College Principal'),
  ('admin', 'College Administrator/Admin Staff');

-- 5. USERS TABLE (with role-based access)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role_id UUID REFERENCES roles(id),
  faculty_id UUID REFERENCES faculties(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email, college_id)
);

-- 6. FEEDBACK TABLE (Anonymous + Authenticated)
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'medium',
  sentiment VARCHAR(50) NOT NULL DEFAULT 'neutral',
  title VARCHAR(255),
  text TEXT NOT NULL,
  summary TEXT,
  ai_analysis JSONB,
  is_anonymous BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'new',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- 7. FEEDBACK RESPONSES TABLE
CREATE TABLE feedback_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. FEEDBACK CATEGORIES TABLE
CREATE TABLE feedback_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(college_id, name)
);

-- INSERT SAMPLE DATA
-- Insert a sample college
INSERT INTO colleges (name, email, phone, location) VALUES
  ('Delhi Institute of Technology', 'admin@dit.edu.in', '+91-11-1234-5678', 'New Delhi, India')
ON CONFLICT DO NOTHING;

-- Get the college ID for further inserts
WITH college_data AS (
  SELECT id FROM colleges WHERE name = 'Delhi Institute of Technology'
)
INSERT INTO feedback_categories (college_id, name, description)
SELECT id, 'academic', 'Academic concerns and course-related issues' FROM college_data
UNION ALL
SELECT id, 'facilities', 'Campus facilities and infrastructure' FROM college_data
UNION ALL
SELECT id, 'student-life', 'Student life and campus activities' FROM college_data
UNION ALL
SELECT id, 'administration', 'Administrative processes' FROM college_data
UNION ALL
SELECT id, 'safety', 'Safety and security concerns' FROM college_data
UNION ALL
SELECT id, 'other', 'Other concerns' FROM college_data
ON CONFLICT DO NOTHING;

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_feedback_college_id ON feedback(college_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_feedback_priority ON feedback(priority);
CREATE INDEX idx_feedback_sentiment ON feedback(sentiment);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_users_college_id ON users(college_id);
CREATE INDEX idx_users_email_college ON users(email, college_id);
CREATE INDEX idx_feedback_assigned_to ON feedback(assigned_to);

-- ROW LEVEL SECURITY POLICIES
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_categories ENABLE ROW LEVEL SECURITY;

-- For now, disable RLS to allow application-level control
-- Will be enforced through application logic and middleware
