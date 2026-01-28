-- Script to normalize all skill categories in the database
-- Run this in SQL Server Management Studio or your SQL client

-- Update all Backend Development variations
UPDATE Skills 
SET Category = 'Backend Development'
WHERE 
    Category LIKE '%backend%' 
    OR Category LIKE '%Backend%'
    OR Category LIKE '%(Backend)%';

-- Update all Frontend Development variations  
UPDATE Skills
SET Category = 'Frontend Development'
WHERE 
    Category LIKE '%frontend%'
    OR Category LIKE '%Frontend%'
    OR Category LIKE '%(Frontend)%';

-- Update all Database variations
UPDATE Skills
SET Category = 'Database'
WHERE 
    Category LIKE '%database%'
    OR Category LIKE '%Database%'
    OR Category LIKE '%(Database)%';

-- Update all Mobile Development variations
UPDATE Skills
SET Category = 'Mobile Development'
WHERE 
    Category LIKE '%mobile%'
    OR Category LIKE '%Mobile%'
    OR Category LIKE '%(Mobile)%';

-- Update all DevOps & Tools variations
UPDATE Skills
SET Category = 'DevOps & Tools'
WHERE 
    Category LIKE '%devops%'
    OR Category LIKE '%DevOps%'
    OR Category LIKE '%tools%'
    OR Category LIKE '%Tools%'
    OR Category LIKE '%(DevOps)%';

-- Update all Soft Skills variations
UPDATE Skills
SET Category = 'Soft Skills'
WHERE 
    Category LIKE '%soft%'
    OR Category LIKE '%Soft%'
    OR Category LIKE '%(Soft)%';

-- Verify the changes
SELECT DISTINCT Category, COUNT(*) as SkillCount
FROM Skills
GROUP BY Category
ORDER BY Category;
