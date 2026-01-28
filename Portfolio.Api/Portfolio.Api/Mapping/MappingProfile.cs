using AutoMapper;
using Portfolio.Api.DTOs;
using Portfolio.Api.Entities;

namespace Portfolio.Api.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Skill Mappings
        CreateMap<Skill, SkillDto>();
        CreateMap<CreateSkillDto, Skill>();

        // Project Mappings
        CreateMap<ProjectImage, ProjectImageDto>();
        CreateMap<Project, ProjectDto>();
        CreateMap<CreateProjectDto, Project>()
            .ForMember(dest => dest.Images, opt => opt.Ignore());

        // Blog Mappings
        CreateMap<BlogPost, BlogPostDto>()
            .ForMember(dest => dest.CategoryNameAr, opt => opt.MapFrom(src => src.Category.NameAr))
            .ForMember(dest => dest.CategoryNameEn, opt => opt.MapFrom(src => src.Category.NameEn))
            .ForMember(dest => dest.CategorySlug, opt => opt.MapFrom(src => src.Category.Slug))
            .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author != null ? src.Author.FullName : "Mostafa Tonin"));
        
        CreateMap<CreateBlogPostDto, BlogPost>();
        
        CreateMap<BlogCategory, BlogCategoryDto>();
        CreateMap<CreateBlogCategoryDto, BlogCategory>();
        
        CreateMap<BlogComment, BlogCommentDto>();

        // User Mappings
        CreateMap<User, UserDto>();

        // Service Mappings
        CreateMap<Service, ServiceDto>();
        CreateMap<CreateServiceDto, Service>();

        // About Mappings
        CreateMap<AboutSection, AboutSectionDto>();
        CreateMap<CreateAboutSectionDto, AboutSection>();

        // Contact Message Mappings
        CreateMap<ContactMessage, ContactMessageDto>();
        CreateMap<CreateContactMessageDto, ContactMessage>()
            .ForMember(dest => dest.SentDate, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => false));

        // Certification Mappings
        CreateMap<Certification, CertificationDto>();
        CreateMap<CreateCertificationDto, Certification>();
        CreateMap<UpdateCertificationDto, Certification>();
    }
}
