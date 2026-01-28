using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.DTOs;
using Portfolio.Api.Entities;
using Portfolio.Api.Interfaces;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AboutController : ControllerBase
{
    private readonly IRepository<AboutSection> _repository;

    public AboutController(IRepository<AboutSection> repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// الحصول على بيانات About الرئيسية
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<AboutSectionDto>> Get()
    {
        var section = await _repository.GetAllAsync();
        var mainSection = section.FirstOrDefault(s => s.IsActive);
        
        if (mainSection == null)
            return NotFound(new { message = "بيانات About غير موجودة" });

        return Ok(MapToDto(mainSection));
    }

    /// <summary>
    /// تحديث بيانات About (أو إنشاؤها إذا لم تكن موجودة)
    /// </summary>
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromBody] CreateAboutSectionDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var sections = await _repository.GetAllAsync();
        var section = sections.FirstOrDefault();

        if (section == null)
        {
            section = new AboutSection();
            UpdateEntity(section, dto);
            await _repository.AddAsync(section);
        }
        else
        {
            UpdateEntity(section, dto);
            await _repository.UpdateAsync(section);
        }

        return Ok(MapToDto(section));
    }

    private static AboutSectionDto MapToDto(AboutSection s) => new AboutSectionDto
    {
        Id = s.Id,
        FullNameAr = s.FullNameAr,
        FullNameEn = s.FullNameEn,
        PositionAr = s.PositionAr,
        PositionEn = s.PositionEn,
        BioAr = s.BioAr,
        BioEn = s.BioEn,
        HeroGreetingAr = s.HeroGreetingAr,
        HeroGreetingEn = s.HeroGreetingEn,
        HeroBioAr = s.HeroBioAr,
        HeroBioEn = s.HeroBioEn,
        CtaPrimaryTextAr = s.CtaPrimaryTextAr,
        CtaPrimaryTextEn = s.CtaPrimaryTextEn,
        CtaSecondaryTextAr = s.CtaSecondaryTextAr,
        CtaSecondaryTextEn = s.CtaSecondaryTextEn,
        TitleAr = s.TitleAr,
        TitleEn = s.TitleEn,
        DescriptionAr = s.DescriptionAr,
        DescriptionEn = s.DescriptionEn,
        ImageUrl = s.ImageUrl,
        CvUrl = s.CvUrl,
        YearsOfExperience = s.YearsOfExperience,
        ProjectsCompleted = s.ProjectsCompleted,
        TechnologiesCount = s.TechnologiesCount,
        CertificatesCount = s.CertificatesCount,
        FreelanceProjectsCount = s.FreelanceProjectsCount,
        ExtendedBioAr = s.ExtendedBioAr,
        ExtendedBioEn = s.ExtendedBioEn,
        SoftSkillsAr = s.SoftSkillsAr,
        SoftSkillsEn = s.SoftSkillsEn,
        ExperienceDescriptionAr = s.ExperienceDescriptionAr,
        ExperienceDescriptionEn = s.ExperienceDescriptionEn,
        ShowHeroAbout = s.ShowHeroAbout,
        ShowExtendedBio = s.ShowExtendedBio,
        ShowSoftSkills = s.ShowSoftSkills,
        ShowExperience = s.ShowExperience,
        ShowStats = s.ShowStats,
        ShowServicesSection = s.ShowServicesSection,
        ShowProjectsSection = s.ShowProjectsSection,
        ShowCertificationsSection = s.ShowCertificationsSection,
        ShowBlogSection = s.ShowBlogSection,
        ShowContactSection = s.ShowContactSection,
        DisplayOrder = s.DisplayOrder,
        IsActive = s.IsActive,
        Badge1Ar = s.Badge1Ar,
        Badge1En = s.Badge1En,
        Badge2Ar = s.Badge2Ar,
        Badge2En = s.Badge2En,
        Badge3Ar = s.Badge3Ar,
        Badge3En = s.Badge3En,
        Badge4Ar = s.Badge4Ar,
        Badge4En = s.Badge4En,
        Badge5Ar = s.Badge5Ar,
        Badge5En = s.Badge5En
    };

    private static void UpdateEntity(AboutSection section, CreateAboutSectionDto dto)
    {
        // Text Fields
        if (!string.IsNullOrEmpty(dto.FullNameAr)) section.FullNameAr = dto.FullNameAr;
        if (!string.IsNullOrEmpty(dto.FullNameEn)) section.FullNameEn = dto.FullNameEn;
        if (!string.IsNullOrEmpty(dto.PositionAr)) section.PositionAr = dto.PositionAr;
        if (!string.IsNullOrEmpty(dto.PositionEn)) section.PositionEn = dto.PositionEn;
        if (!string.IsNullOrEmpty(dto.BioAr)) section.BioAr = dto.BioAr;
        if (!string.IsNullOrEmpty(dto.BioEn)) section.BioEn = dto.BioEn;
        if (!string.IsNullOrEmpty(dto.HeroGreetingAr)) section.HeroGreetingAr = dto.HeroGreetingAr;
        if (!string.IsNullOrEmpty(dto.HeroGreetingEn)) section.HeroGreetingEn = dto.HeroGreetingEn;
        if (!string.IsNullOrEmpty(dto.HeroBioAr)) section.HeroBioAr = dto.HeroBioAr;
        if (!string.IsNullOrEmpty(dto.HeroBioEn)) section.HeroBioEn = dto.HeroBioEn;
        if (!string.IsNullOrEmpty(dto.CtaPrimaryTextAr)) section.CtaPrimaryTextAr = dto.CtaPrimaryTextAr;
        if (!string.IsNullOrEmpty(dto.CtaPrimaryTextEn)) section.CtaPrimaryTextEn = dto.CtaPrimaryTextEn;
        if (!string.IsNullOrEmpty(dto.CtaSecondaryTextAr)) section.CtaSecondaryTextAr = dto.CtaSecondaryTextAr;
        if (!string.IsNullOrEmpty(dto.CtaSecondaryTextEn)) section.CtaSecondaryTextEn = dto.CtaSecondaryTextEn;
        if (!string.IsNullOrEmpty(dto.TitleAr)) section.TitleAr = dto.TitleAr;
        if (!string.IsNullOrEmpty(dto.TitleEn)) section.TitleEn = dto.TitleEn;
        if (!string.IsNullOrEmpty(dto.DescriptionAr)) section.DescriptionAr = dto.DescriptionAr;
        if (!string.IsNullOrEmpty(dto.DescriptionEn)) section.DescriptionEn = dto.DescriptionEn;
        if (!string.IsNullOrEmpty(dto.ImageUrl)) section.ImageUrl = dto.ImageUrl;
        if (!string.IsNullOrEmpty(dto.CvUrl)) section.CvUrl = dto.CvUrl;
        
        // Extended About Page Fields
        if (!string.IsNullOrEmpty(dto.ExtendedBioAr)) section.ExtendedBioAr = dto.ExtendedBioAr;
        if (!string.IsNullOrEmpty(dto.ExtendedBioEn)) section.ExtendedBioEn = dto.ExtendedBioEn;
        if (!string.IsNullOrEmpty(dto.SoftSkillsAr)) section.SoftSkillsAr = dto.SoftSkillsAr;
        if (!string.IsNullOrEmpty(dto.SoftSkillsEn)) section.SoftSkillsEn = dto.SoftSkillsEn;
        if (!string.IsNullOrEmpty(dto.ExperienceDescriptionAr)) section.ExperienceDescriptionAr = dto.ExperienceDescriptionAr;
        if (!string.IsNullOrEmpty(dto.ExperienceDescriptionEn)) section.ExperienceDescriptionEn = dto.ExperienceDescriptionEn;
        
        // Stats - Update regardless of value (allows setting to 0)
        section.YearsOfExperience = dto.YearsOfExperience;
        section.ProjectsCompleted = dto.ProjectsCompleted;
        section.TechnologiesCount = dto.TechnologiesCount;
        section.CertificatesCount = dto.CertificatesCount;
        section.FreelanceProjectsCount = dto.FreelanceProjectsCount;
        
        // About Page Visibility
        section.ShowHeroAbout = dto.ShowHeroAbout;
        section.ShowExtendedBio = dto.ShowExtendedBio;
        section.ShowSoftSkills = dto.ShowSoftSkills;
        section.ShowExperience = dto.ShowExperience;
        section.ShowStats = dto.ShowStats;
        
        // Home Page Visibility
        section.ShowServicesSection = dto.ShowServicesSection;
        section.ShowProjectsSection = dto.ShowProjectsSection;
        section.ShowCertificationsSection = dto.ShowCertificationsSection;
        section.ShowBlogSection = dto.ShowBlogSection;
        section.ShowContactSection = dto.ShowContactSection;

        section.DisplayOrder = dto.DisplayOrder;
        section.IsActive = dto.IsActive;

        // Badge Fields
        if (!string.IsNullOrEmpty(dto.Badge1Ar)) section.Badge1Ar = dto.Badge1Ar;
        if (!string.IsNullOrEmpty(dto.Badge1En)) section.Badge1En = dto.Badge1En;
        if (!string.IsNullOrEmpty(dto.Badge2Ar)) section.Badge2Ar = dto.Badge2Ar;
        if (!string.IsNullOrEmpty(dto.Badge2En)) section.Badge2En = dto.Badge2En;
        if (!string.IsNullOrEmpty(dto.Badge3Ar)) section.Badge3Ar = dto.Badge3Ar;
        if (!string.IsNullOrEmpty(dto.Badge3En)) section.Badge3En = dto.Badge3En;
        if (!string.IsNullOrEmpty(dto.Badge4Ar)) section.Badge4Ar = dto.Badge4Ar;
        if (!string.IsNullOrEmpty(dto.Badge4En)) section.Badge4En = dto.Badge4En;
        if (!string.IsNullOrEmpty(dto.Badge5Ar)) section.Badge5Ar = dto.Badge5Ar;
        if (!string.IsNullOrEmpty(dto.Badge5En)) section.Badge5En = dto.Badge5En;
    }
}
