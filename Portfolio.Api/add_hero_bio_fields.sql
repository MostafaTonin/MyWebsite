ALTER TABLE AboutSections ADD HeroBioAr NVARCHAR(MAX) DEFAULT '';
ALTER TABLE AboutSections ADD HeroBioEn NVARCHAR(MAX) DEFAULT '';
GO

-- Copy existing bio to hero bio as a starting point
UPDATE AboutSections SET HeroBioAr = BioAr, HeroBioEn = BioEn;
GO
