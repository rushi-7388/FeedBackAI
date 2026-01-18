-- Seed sample data for demo

-- Get college ID
WITH college AS (
  SELECT id FROM colleges WHERE name = 'Delhi Institute of Technology'
)
INSERT INTO faculties (college_id, name, head_name, email)
SELECT id, 'Engineering', 'Dr. Rajesh Singh', 'engineering@dit.edu.in' FROM college
UNION ALL
SELECT id, 'Science', 'Dr. Priya Sharma', 'science@dit.edu.in' FROM college
UNION ALL
SELECT id, 'Commerce', 'Dr. Arun Kumar', 'commerce@dit.edu.in' FROM college
ON CONFLICT DO NOTHING;

-- Add departments
WITH college AS (
  SELECT id FROM colleges WHERE name = 'Delhi Institute of Technology'
),
eng_faculty AS (
  SELECT id FROM faculties WHERE name = 'Engineering' AND college_id IN (SELECT id FROM college)
)
INSERT INTO departments (faculty_id, college_id, name, hod_name, email)
SELECT f.id, c.id, 'Computer Science', 'Dr. Vikram Patel', 'cs@dit.edu.in'
FROM eng_faculty f, college c
UNION ALL
SELECT f.id, c.id, 'Mechanical Engineering', 'Dr. Suresh Verma', 'me@dit.edu.in'
FROM eng_faculty f, college c
UNION ALL
SELECT f.id, c.id, 'Civil Engineering', 'Dr. Anjali Singh', 'ce@dit.edu.in'
FROM eng_faculty f, college c
ON CONFLICT DO NOTHING;

-- Add admin and principal users
WITH college AS (
  SELECT id FROM colleges WHERE name = 'Delhi Institute of Technology'
),
admin_role AS (
  SELECT id FROM roles WHERE name = 'admin'
),
principal_role AS (
  SELECT id FROM roles WHERE name = 'principal'
),
hod_role AS (
  SELECT id FROM roles WHERE name = 'hod'
)
INSERT INTO users (college_id, email, password_hash, full_name, role_id)
SELECT c.id, 'admin@dit.edu.in', 'hashed_password_here', 'Admin User', ar.id
FROM college c, admin_role ar
UNION ALL
SELECT c.id, 'principal@dit.edu.in', 'hashed_password_here', 'Dr. Principal Kumar', pr.id
FROM college c, principal_role pr
UNION ALL
SELECT c.id, 'hod@dit.edu.in', 'hashed_password_here', 'Dr. Vikram Patel', hr.id
FROM college c, hod_role hr
ON CONFLICT DO NOTHING;

-- Add sample feedback
WITH college AS (
  SELECT id FROM colleges WHERE name = 'Delhi Institute of Technology'
)
INSERT INTO feedback (college_id, category, priority, sentiment, title, text, summary, status)
VALUES
  ((SELECT id FROM college), 'academic', 'high', 'negative', 'Lab Equipment Issues', 'The computer lab has outdated equipment that frequently crashes. This affects our practical assignments.', 'Computer lab needs equipment upgrade', 'new'),
  ((SELECT id FROM college), 'facilities', 'high', 'negative', 'Cafeteria Food Quality', 'The food quality in the cafeteria has deteriorated. Many students are avoiding it.', 'Cafeteria needs quality improvement', 'new'),
  ((SELECT id FROM college), 'student-life', 'medium', 'neutral', 'Club Activities', 'We need more active technical clubs and regular meetups.', 'Request for more technical club activities', 'new'),
  ((SELECT id FROM college), 'safety', 'high', 'negative', 'Campus Security', 'Night security presence is insufficient. Students feel unsafe late evening.', 'Campus security needs improvement', 'new'),
  ((SELECT id FROM college), 'administration', 'medium', 'negative', 'Admission Process', 'The online admission portal is outdated and confusing for new applicants.', 'Admission portal needs modernization', 'new'),
  ((SELECT id FROM college), 'facilities', 'medium', 'neutral', 'Library Hours', 'Library closing at 7 PM is too early. Students need late night study space.', 'Request for extended library hours', 'new'),
  ((SELECT id FROM college), 'academic', 'medium', 'positive', 'Excellent Teaching', 'Dr. Sharma''s database course is exceptional. His teaching methods are engaging.', 'Positive feedback on teaching quality', 'resolved'),
  ((SELECT id FROM college), 'student-life', 'low', 'positive', 'Sports Facilities', 'The new gym and sports facilities are amazing. Great addition to campus.', 'Positive feedback on sports facilities', 'resolved'),
  ((SELECT id FROM college), 'safety', 'high', 'negative', 'Parking Issues', 'Limited parking space creates traffic and safety concerns every morning.', 'Parking facilities are inadequate', 'new'),
  ((SELECT id FROM college), 'facilities', 'medium', 'negative', 'Washroom Cleanliness', 'Washroom facilities need regular maintenance. Some are often in poor condition.', 'Washroom maintenance required', 'in-progress')
ON CONFLICT DO NOTHING;
