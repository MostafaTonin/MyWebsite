-- Run this script to add Badge columns to the AboutSections table
-- This allows controlling the Home page hero badges from the Admin Dashboard

ALTER TABLE AboutSections ADD 
    Badge1Ar NVARCHAR(MAX) NULL,
    Badge1En NVARCHAR(MAX) NULL,
    Badge2Ar NVARCHAR(MAX) NULL,
    Badge2En NVARCHAR(MAX) NULL,
    Badge3Ar NVARCHAR(MAX) NULL,
    Badge3En NVARCHAR(MAX) NULL,
    Badge4Ar NVARCHAR(MAX) NULL,
    Badge4En NVARCHAR(MAX) NULL,
    Badge5Ar NVARCHAR(MAX) NULL,
    Badge5En NVARCHAR(MAX) NULL;

-- Optional: Initialize with current values from translations to avoid empty badges
UPDATE AboutSections SET 
    Badge1Ar = N'تطبيقات الويب', Badge1En = N'Web Apps',
    Badge2Ar = N'أنظمة سطح المكتب', Badge2En = N'Desktop Systems',
    Badge3Ar = N'تطبيقات الموبايل', Badge3En = N'Mobile Apps',
    Badge4Ar = N'مساعدة المبتدئين', Badge4En = N'Mentorship',
    Badge5Ar = N'التعلم المستمر', Badge5En = N'Continuous Learning'
WHERE Badge1Ar IS NULL OR Badge1Ar = '';
