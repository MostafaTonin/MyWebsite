using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs;

public class AboutSectionDto
{
    public int Id { get; set; }
    public string FullNameAr { get; set; } = string.Empty;
    public string FullNameEn { get; set; } = string.Empty;
    public string PositionAr { get; set; } = string.Empty;
    public string PositionEn { get; set; } = string.Empty;
    public string BioAr { get; set; } = string.Empty;
    public string BioEn { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string DescriptionAr { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string CvUrl { get; set; } = string.Empty;
    
    // Hero Texts
    public string HeroGreetingAr { get; set; } = string.Empty;
    public string HeroGreetingEn { get; set; } = string.Empty;
    public string HeroBioAr { get; set; } = string.Empty;
    public string HeroBioEn { get; set; } = string.Empty;
    public string CtaPrimaryTextAr { get; set; } = string.Empty;
    public string CtaPrimaryTextEn { get; set; } = string.Empty;
    public string CtaSecondaryTextAr { get; set; } = string.Empty;
    public string CtaSecondaryTextEn { get; set; } = string.Empty;
    
    // Stats
    public int YearsOfExperience { get; set; }
    public int ProjectsCompleted { get; set; }
    public int TechnologiesCount { get; set; }
    public int CertificatesCount { get; set; }
    public int FreelanceProjectsCount { get; set; }

    // Extended About Page Fields
    public string ExtendedBioAr { get; set; } = string.Empty;
    public string ExtendedBioEn { get; set; } = string.Empty;
    public string SoftSkillsAr { get; set; } = string.Empty;
    public string SoftSkillsEn { get; set; } = string.Empty;
    public string ExperienceDescriptionAr { get; set; } = string.Empty;
    public string ExperienceDescriptionEn { get; set; } = string.Empty;

    // About Page Section Visibility
    public bool ShowHeroAbout { get; set; }
    public bool ShowExtendedBio { get; set; }
    public bool ShowSoftSkills { get; set; }
    public bool ShowExperience { get; set; }
    public bool ShowStats { get; set; }

    // Home Page Visibility
    public bool ShowServicesSection { get; set; }
    public bool ShowProjectsSection { get; set; }
    public bool ShowCertificationsSection { get; set; }
    public bool ShowBlogSection { get; set; }
    public bool ShowContactSection { get; set; }

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }

    // Badges for Hero Section
    public string Badge1Ar { get; set; } = string.Empty;
    public string Badge1En { get; set; } = string.Empty;
    public string Badge2Ar { get; set; } = string.Empty;
    public string Badge2En { get; set; } = string.Empty;
    public string Badge3Ar { get; set; } = string.Empty;
    public string Badge3En { get; set; } = string.Empty;
    public string Badge4Ar { get; set; } = string.Empty;
    public string Badge4En { get; set; } = string.Empty;
    public string Badge5Ar { get; set; } = string.Empty;
    public string Badge5En { get; set; } = string.Empty;
}

public class CreateAboutSectionDto
{
    public string FullNameAr { get; set; } = string.Empty;
    public string FullNameEn { get; set; } = string.Empty;
    public string PositionAr { get; set; } = string.Empty;
    public string PositionEn { get; set; } = string.Empty;
    public string BioAr { get; set; } = string.Empty;
    public string BioEn { get; set; } = string.Empty;
    public string HeroGreetingAr { get; set; } = string.Empty;
    public string HeroGreetingEn { get; set; } = string.Empty;
    public string HeroBioAr { get; set; } = string.Empty;
    public string HeroBioEn { get; set; } = string.Empty;
    public string CtaPrimaryTextAr { get; set; } = string.Empty;
    public string CtaPrimaryTextEn { get; set; } = string.Empty;
    public string CtaSecondaryTextAr { get; set; } = string.Empty;
    public string CtaSecondaryTextEn { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string DescriptionAr { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string CvUrl { get; set; } = string.Empty;
    
    // Stats
    public int YearsOfExperience { get; set; }
    public int ProjectsCompleted { get; set; }
    public int TechnologiesCount { get; set; }
    public int CertificatesCount { get; set; }
    public int FreelanceProjectsCount { get; set; }

    // Extended About Page Fields
    public string ExtendedBioAr { get; set; } = string.Empty;
    public string ExtendedBioEn { get; set; } = string.Empty;
    public string SoftSkillsAr { get; set; } = string.Empty;
    public string SoftSkillsEn { get; set; } = string.Empty;
    public string ExperienceDescriptionAr { get; set; } = string.Empty;
    public string ExperienceDescriptionEn { get; set; } = string.Empty;

    // About Page Section Visibility
    public bool ShowHeroAbout { get; set; } = true;
    public bool ShowExtendedBio { get; set; } = true;
    public bool ShowSoftSkills { get; set; } = true;
    public bool ShowExperience { get; set; } = true;
    public bool ShowStats { get; set; } = true;

    // Home Page Visibility
    public bool ShowServicesSection { get; set; } = true;
    public bool ShowProjectsSection { get; set; } = true;
    public bool ShowCertificationsSection { get; set; } = true;
    public bool ShowBlogSection { get; set; } = true;
    public bool ShowContactSection { get; set; } = true;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    // Badges for Hero Section
    public string Badge1Ar { get; set; } = string.Empty;
    public string Badge1En { get; set; } = string.Empty;
    public string Badge2Ar { get; set; } = string.Empty;
    public string Badge2En { get; set; } = string.Empty;
    public string Badge3Ar { get; set; } = string.Empty;
    public string Badge3En { get; set; } = string.Empty;
    public string Badge4Ar { get; set; } = string.Empty;
    public string Badge4En { get; set; } = string.Empty;
    public string Badge5Ar { get; set; } = string.Empty;
    public string Badge5En { get; set; } = string.Empty;
}
