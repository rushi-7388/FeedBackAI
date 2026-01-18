-- Disable RLS on feedback table to allow anonymous submissions
-- Application-level access control will be enforced through middleware

ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Allow public read/write on feedback table for anonymous submissions
-- Restrict other tables based on authentication

-- Grant permissions to anon role for feedback table
GRANT SELECT, INSERT ON feedback TO anon;
GRANT SELECT ON feedback_categories TO anon;

-- Grant full permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON feedback TO authenticated;
GRANT SELECT ON feedback_responses TO authenticated;
GRANT UPDATE ON feedback_responses TO authenticated;
