using Portfolio.Api.Entities;
using BCrypt.Net;

namespace Portfolio.Api.Data;

/// <summary>
/// Seed Data للبيانات الأولية
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(PortfolioDbContext context)
    {
        // إنشاء أو تحديث مستخدم Admin افتراضي
        var admin = context.Users.FirstOrDefault(u => u.Username == "admin");
        if (admin == null)
        {
            admin = new User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin",
                FullName = "Mostafa Tonin",
                Email = "admin@tonin.me",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(admin);
        }
        else
        {
            // لضمان عمل الحساب بعد التحديثات الأخيرة لقاعدة البيانات
            admin.IsActive = true;
            if (string.IsNullOrEmpty(admin.FullName)) admin.FullName = "Mostafa Tonin";
            admin.Role = "Admin"; // التأكد من الصلاحية
        }

        // إضافة فئات المدونة
        if (!context.BlogCategories.Any())
        {
            var categories = new List<BlogCategory>
            {
                new BlogCategory { NameAr = "برمجة", NameEn = "Programming" },
                new BlogCategory { NameAr = "تصميم", NameEn = "Design" },
                new BlogCategory { NameAr = "تقنية", NameEn = "Technology" }
            };
            context.BlogCategories.AddRange(categories);
        }

        // إضافة مهارات افتراضية
        if (!context.Skills.Any())
        {
            var skills = new List<Skill>
            {
                // Backend
                new Skill { NameAr = "C#", NameEn = "C#", Proficiency = 95, IconUrl = "/images/skills/csharp.png", Category = "Backend Development", YearsOfUse = 3, DisplayOrder = 1 },
                new Skill { NameAr = "ASP.NET Core", NameEn = "ASP.NET Core", Proficiency = 90, IconUrl = "/images/skills/aspnet.png", Category = "Backend Development", YearsOfUse = 2, DisplayOrder = 2 },
                new Skill { NameAr = "Entity Framework Core", NameEn = "EF Core", Proficiency = 85, IconUrl = "/images/skills/efcore.png", Category = "Backend Development", YearsOfUse = 2, DisplayOrder = 3 },
                new Skill { NameAr = "Web API", NameEn = "Web API", Proficiency = 90, IconUrl = "/images/skills/webapi.png", Category = "Backend Development", YearsOfUse = 2, DisplayOrder = 4 },
                
                // Frontend
                new Skill { NameAr = "React", NameEn = "React", Proficiency = 85, IconUrl = "/images/skills/react.png", Category = "Frontend Development", YearsOfUse = 2, DisplayOrder = 1 },
                new Skill { NameAr = "JavaScript", NameEn = "JavaScript", Proficiency = 80, IconUrl = "/images/skills/js.png", Category = "Frontend Development", YearsOfUse = 3, DisplayOrder = 2 },
                new Skill { NameAr = "TypeScript", NameEn = "TypeScript", Proficiency = 75, IconUrl = "/images/skills/ts.png", Category = "Frontend Development", YearsOfUse = 1, DisplayOrder = 3 },
                new Skill { NameAr = "Tailwind CSS", NameEn = "Tailwind CSS", Proficiency = 90, IconUrl = "/images/skills/tailwind.png", Category = "Frontend Development", YearsOfUse = 2, DisplayOrder = 4 },
                
                // Desktop
                new Skill { NameAr = "WPF", NameEn = "WPF", Proficiency = 85, IconUrl = "/images/skills/wpf.png", Category = "Desktop Applications", YearsOfUse = 2, DisplayOrder = 1 },
                new Skill { NameAr = "WinForms", NameEn = "WinForms", Proficiency = 80, IconUrl = "/images/skills/winforms.png", Category = "Desktop Applications", YearsOfUse = 3, DisplayOrder = 2 },
                
                // Database
                new Skill { NameAr = "SQL Server", NameEn = "SQL Server", Proficiency = 85, IconUrl = "/images/skills/sqlserver.png", Category = "Databases", YearsOfUse = 3, DisplayOrder = 1 },
                new Skill { NameAr = "T-SQL", NameEn = "T-SQL", Proficiency = 80, IconUrl = "/images/skills/tsql.png", Category = "Databases", YearsOfUse = 2, DisplayOrder = 2 },
                
                // Mobile
                new Skill { NameAr = "Flutter", NameEn = "Flutter", Proficiency = 70, IconUrl = "/images/skills/flutter.png", Category = "Mobile Apps", YearsOfUse = 1, DisplayOrder = 1 },
                
                // Dev Tools
                new Skill { NameAr = "Git & GitHub", NameEn = "Git & GitHub", Proficiency = 90, IconUrl = "/images/skills/github.png", Category = "Dev Tools", YearsOfUse = 3, DisplayOrder = 1 },
                new Skill { NameAr = "Visual Studio", NameEn = "Visual Studio", Proficiency = 95, IconUrl = "/images/skills/vs.png", Category = "Dev Tools", YearsOfUse = 3, DisplayOrder = 2 },
                new Skill { NameAr = "Docker", NameEn = "Docker", Proficiency = 60, IconUrl = "/images/skills/docker.png", Category = "Dev Tools", YearsOfUse = 1, DisplayOrder = 3 },
                
                // Soft Skills
                new Skill { NameAr = "حل المشكلات", NameEn = "Problem Solving", Proficiency = 90, IconUrl = "/images/skills/soft.png", Category = "Soft Skills", YearsOfUse = 4, DisplayOrder = 1 },
                new Skill { NameAr = "العمل الجماعي", NameEn = "Teamwork", Proficiency = 95, IconUrl = "/images/skills/soft.png", Category = "Soft Skills", YearsOfUse = 4, DisplayOrder = 2 },
                new Skill { NameAr = "إدارة الوقت", NameEn = "Time Management", Proficiency = 85, IconUrl = "/images/skills/soft.png", Category = "Soft Skills", YearsOfUse = 4, DisplayOrder = 3 }
            };
            context.Skills.AddRange(skills);
        }

        // إضافة خدمات افتراضية
        if (!context.Services.Any())
        {
            var services = new List<Service>
            {
                new Service 
                { 
                    TitleAr = "تطوير تطبيقات الويب", 
                    TitleEn = "Web Application Development",
                    DescriptionAr = "بناء تطبيقات ويب متكاملة، سريعة، وآمنة باستخدام أحدث تكنولوجيات .NET و React.",
                    DescriptionEn = "Building full-stack, fast, and secure web applications using latest .NET and React technologies.",
                    IconUrl = "https://cdn-icons-png.flaticon.com/512/2721/2721620.png",
                    DisplayOrder = 1, IsActive = true, ShowOnHome = true
                },
                new Service 
                { 
                    TitleAr = "أنظمة سطح المكتب", 
                    TitleEn = "Desktop Applications",
                    DescriptionAr = "تطوير برمجيات سطح مكتب احترافية وسهلة الاستخدام باستخدام C# و WPF لتلبية احتياجات الشركات.",
                    DescriptionEn = "Developing professional and user-friendly desktop software using C# and WPF for business needs.",
                    IconUrl = "https://cdn-icons-png.flaticon.com/512/1865/1865273.png",
                    DisplayOrder = 2, IsActive = true, ShowOnHome = true
                },
                new Service 
                { 
                    TitleAr = "تطوير تطبيقات الموبايل", 
                    TitleEn = "Mobile App Development",
                    DescriptionAr = "برمجة تطبيقات موبايل عابرة للمنصات (Android & iOS) بجودة عالية وأداء ممتاز باستخدام Flutter.",
                    DescriptionEn = "Programming high-quality cross-platform mobile apps (Android & iOS) with excellent performance using Flutter.",
                    IconUrl = "https://cdn-icons-png.flaticon.com/512/2586/2586488.png",
                    DisplayOrder = 3, IsActive = true, ShowOnHome = true
                },
                new Service 
                { 
                    TitleAr = "تصميم قواعد البيانات", 
                    TitleEn = "Database Design & Optimization",
                    DescriptionAr = "تصميم هيكلية قواعد بيانات قوية، تحسين الاستعلامات، وضمان حماية وسلامة البيانات.",
                    DescriptionEn = "Designing robust database architectures, optimizing queries, and ensuring data security and integrity.",
                    IconUrl = "https://cdn-icons-png.flaticon.com/512/2906/2906274.png",
                    DisplayOrder = 4, IsActive = true, ShowOnHome = true
                },
                new Service 
                { 
                    TitleAr = "استشارات تقنية للطلاب", 
                    TitleEn = "Technical Consultations",
                    DescriptionAr = "تقديم الدعم التقني، شرح مفاهيم البرمجة، والمساعدة في حل المشكلات البرمجية لطلاب تقنية المعلومات.",
                    DescriptionEn = "Providing technical support, explaining programming concepts, and helping IT students solve programming problems.",
                    IconUrl = "https://cdn-icons-png.flaticon.com/512/1651/1651103.png",
                    DisplayOrder = 5, IsActive = true, ShowOnHome = false
                },
                new Service 
                { 
                    TitleAr = "المشاريع الجامعية", 
                    TitleEn = "University Projects Support",
                    DescriptionAr = "المساعدة في تنفيذ المشاريع الجامعية البرمجية وفق المعايير المطلوبة وبجودة احترافية.",
                    DescriptionEn = "Assisting in implementing university programming projects according to required standards and professional quality.",
                    IconUrl = "https://cdn-icons-png.flaticon.com/512/2997/2997300.png",
                    DisplayOrder = 6, IsActive = true, ShowOnHome = true
                }
            };
            context.Services.AddRange(services);
        }

        // إضافة قسم About افتراضي (الذي يغذي الهيرو أيضاً)
        if (!context.AboutSections.Any())
        {
            var about = new AboutSection
            {
                FullNameAr = "مصطفى تونين",
                FullNameEn = "Mostafa Tonin",
                PositionAr = "مطور Full Stack",
                PositionEn = "Full Stack Developer",
                BioAr = "مطور برمجيات شغوف ببناء تطبيقات ويب متكاملة وعالية الأداء.",
                BioEn = "Passionate software developer focused on building high-performance full-stack web applications.",
                HeroGreetingAr = "أهلاً بك، أنا",
                HeroGreetingEn = "Hello, I'm",
                CtaPrimaryTextAr = "عرض مشاريعي",
                CtaPrimaryTextEn = "View My Projects",
                CtaSecondaryTextAr = "تواصل معي",
                CtaSecondaryTextEn = "Contact Me",
                TitleAr = "من أنا",
                TitleEn = "About Me",
                DescriptionAr = "مطور برمجيات محترف متخصص في تطوير تطبيقات الويب باستخدام .NET و React.",
                DescriptionEn = "Professional software developer specialized in web apps using .NET and React.",
                ImageUrl = "/images/about/profile.jpg",
                CvUrl = "https://drive.google.com/...",
                YearsOfExperience = 3,
                ProjectsCompleted = 25,
                TechnologiesCount = 15,
                CertificatesCount = 8,
                FreelanceProjectsCount = 12,
                
                // Extended About Page
                ExtendedBioAr = "أنا طالب في تخصص تقنية المعلومات، أجمع بين الدراسة الأكاديمية والعمل العملي في تطوير البرمجيات. شغفي بالبرمجة بدأ منذ سنوات، وقد عملت على العديد من المشاريع الجامعية والشخصية التي ساعدتني على تطوير مهاراتي في بناء تطبيقات الويب الحديثة.\n\nأؤمن بأهمية التعلم المستمر ومواكبة أحدث التقنيات، لذلك أحرص على تطوير نفسي باستمرار من خلال الدورات التدريبية والمشاريع العملية. أسعى لتقديم حلول برمجية عملية تحل مشاكل حقيقية وتساعد الآخرين.",
                ExtendedBioEn = "I'm an Information Technology student, combining academic studies with practical software development work. My passion for programming started years ago, and I've worked on numerous university and personal projects that helped me develop my skills in building modern web applications.\n\nI believe in the importance of continuous learning and keeping up with the latest technologies, so I constantly strive to improve myself through training courses and practical projects. I aim to provide practical software solutions that solve real problems and help others.",
                
                SoftSkillsAr = "العمل الجماعي,التواصل الفعال,حل المشكلات,إدارة الوقت,الالتزام بالمواعيد,التعلم السريع",
                SoftSkillsEn = "Teamwork,Effective Communication,Problem Solving,Time Management,Meeting Deadlines,Fast Learning",
                
                ExperienceDescriptionAr = "• مشاريع جامعية: عملت على تطوير أنظمة إدارة متكاملة كجزء من المشاريع الدراسية\n• مشاريع فريلانس: قدمت خدمات تطوير مواقع ويب وتطبيقات لعملاء محليين\n• تدريب ذاتي: أكملت العديد من الدورات التدريبية في تطوير الويب باستخدام .NET و React\n• مساعدة الزملاء: أقدم الدعم الفني والمساعدة لزملائي الطلاب في مشاريعهم البرمجية",
                ExperienceDescriptionEn = "• University Projects: Developed integrated management systems as part of academic projects\n• Freelance Work: Provided web development services for local clients\n• Self-Training: Completed numerous training courses in web development using .NET and React\n• Peer Support: Provide technical support and assistance to fellow students in their programming projects",
                
                // About Page Visibility
                ShowHeroAbout = true,
                ShowExtendedBio = true,
                ShowSoftSkills = true,
                ShowExperience = true,
                ShowStats = true,
                
                // Home Page Visibility
                ShowServicesSection = true,
                ShowProjectsSection = true,
                ShowCertificationsSection = true,
                ShowBlogSection = true,
                ShowContactSection = true,
                
                DisplayOrder = 1,
                IsActive = true
            };
            context.AboutSections.Add(about);
        }

        // إضافة روابط التواصل الاجتماعي
        var existingLinks = context.SocialLinks.ToList();
        if (!existingLinks.Any(l => l.Platform.Equals("GitHub", StringComparison.OrdinalIgnoreCase)))
        {
            context.SocialLinks.Add(new SocialLink { Platform = "GitHub", Url = "https://github.com/MostafaTonin", IconName = "Github", DisplayOrder = 1 });
        }
        if (!existingLinks.Any(l => l.Platform.Equals("LinkedIn", StringComparison.OrdinalIgnoreCase)))
        {
            context.SocialLinks.Add(new SocialLink { Platform = "LinkedIn", Url = "https://www.linkedin.com/in/mostafa-tonin", IconName = "Linkedin", DisplayOrder = 2 });
        }
        if (!existingLinks.Any(l => l.Platform.Equals("Instagram", StringComparison.OrdinalIgnoreCase)))
        {
            context.SocialLinks.Add(new SocialLink { Platform = "Instagram", Url = "https://www.instagram.com/mostafa_tonin/", IconName = "Instagram", DisplayOrder = 3 });
        }

        // إضافة مشاريع افتراضية
        if (!context.Projects.Any())
        {
            var projects = new List<Project>
            {
                new Project 
                { 
                    TitleAr = "نظام إدارة الصيدليات المتكامل", 
                    TitleEn = "Integrated Pharmacy Management System",
                    DescriptionAr = "نظام متطور لإدارة المخزون، المبيعات، والطلبات للشركات الطبية والصيدليات.",
                    DescriptionEn = "Advanced system for managing inventory, sales, and orders for medical companies and pharmacies.",
                    ClientName = "Healthcare Corp",
                    TechnologyStack = "C#, WPF, SQL Server, Entity Framework",
                    Category = "Desktop App",
                    IsFeatured = true,
                    DisplayOrder = 1,
                    Images = new List<ProjectImage> 
                    { 
                        new ProjectImage { ImageUrl = "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=1200", AltTextAr = "واجهة إدارة الصيدلية", AltTextEn = "Pharmacy Management UI" }
                    }
                },
                new Project 
                { 
                    TitleAr = "منصة التعليم الإلكتروني للطلاب", 
                    TitleEn = "Student E-Learning Platform",
                    DescriptionAr = "منصة ويب تتيح للطلاب الوصول إلى المحاضرات، حل الاختبارات، والتفاعل مع الأساتذة.",
                    DescriptionEn = "Web platform allowing students to access lectures, solve quizzes, and interact with professors.",
                    ClientName = "University Project",
                    TechnologyStack = "React, .NET Core API, SQL Server",
                    Category = "Web App",
                    IsFeatured = true,
                    DisplayOrder = 2,
                    Images = new List<ProjectImage> 
                    { 
                        new ProjectImage { ImageUrl = "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200", AltTextAr = "منصة التعلم", AltTextEn = "Learning Platform UI" }
                    }
                },
                new Project 
                { 
                    TitleAr = "تطبيق متابعة المهام (Taskify)", 
                    TitleEn = "Taskify - Task Management App",
                    DescriptionAr = "تطبيق موبايل لإدارة المهام اليومية مع تنبيهات ومزامنة سحابية.",
                    DescriptionEn = "Mobile application for daily task management with notifications and cloud sync.",
                    ClientName = "Open Source Project",
                    TechnologyStack = "Flutter, Firebase",
                    Category = "Mobile App",
                    IsFeatured = false,
                    DisplayOrder = 3,
                    Images = new List<ProjectImage> 
                    { 
                        new ProjectImage { ImageUrl = "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=1200", AltTextAr = "تطبيق تدوين المهام", AltTextEn = "Task App UI" }
                    }
                }
            };
            context.Projects.AddRange(projects);
        }

        // إضافة الشهادات
        if (!context.Certifications.Any())
        {
            var certs = new List<Certification>
            {
                new Certification 
                { 
                    TitleAr = "أساسيات الشبكات (CCNA)", 
                    TitleEn = "CCNA: Introduction to Networks",
                    IssuerAr = "أكاديمية سيسكو",
                    IssuerEn = "Cisco Networking Academy",
                    PlatformType = "Cisco",
                    PlatformLogoUrl = "https://logos-world.net/wp-content/uploads/2020/06/Cisco-Logo.png",
                    IssueDate = DateTime.Now.AddMonths(-6),
                    Category = "Certificate",
                    IsFeatured = true,
                    ShowOnHome = true,
                    DisplayOrder = 1
                },
                new Certification 
                { 
                    TitleAr = "برمجة الكائنات (OOP) بلغة C#", 
                    TitleEn = "Object Oriented Programming in C#",
                    IssuerAr = "Programming Advices",
                    IssuerEn = "Programming Advices",
                    PlatformType = "ProgrammingAdvices",
                    PlatformLogoUrl = "https://programming-advices.com/content/images/2022/01/logo.png",
                    IssueDate = DateTime.Now.AddMonths(-3),
                    Category = "Course",
                    IsFeatured = true,
                    ShowOnHome = true,
                    DisplayOrder = 2
                },
                new Certification 
                { 
                    TitleAr = "دورة تطوير تطبيقات الويب", 
                    TitleEn = "Web Development Bootcamp",
                    IssuerAr = "Addison Academy",
                    IssuerEn = "Addison Academy",
                    PlatformType = "Addison",
                    PlatformLogoUrl = "https://cdn-icons-png.flaticon.com/512/3075/3075908.png",
                    IssueDate = DateTime.Now.AddMonths(-1),
                    Category = "Bootcamp",
                    IsFeatured = false,
                    ShowOnHome = false,
                    DisplayOrder = 3
                }
            };
            context.Certifications.AddRange(certs);
        }

        // إضافة أقسام الموقع (Site Sections)
        if (!context.SiteSections.Any())
        {
            var sections = new List<SiteSection>
            {
                new SiteSection { SectionKey = "home", TitleAr = "الرئيسية", TitleEn = "Home", RoutePath = "/", IconName = "Home", IsVisibleInNavbar = true, NavbarOrder = 1, IsVisibleInHome = false, HomeOrder = 0 },
                new SiteSection { SectionKey = "services", TitleAr = "الخدمات", TitleEn = "Services", RoutePath = "/services", IconName = "Layers", IsVisibleInNavbar = true, NavbarOrder = 2, IsVisibleInHome = true, HomeOrder = 1 },
                new SiteSection { SectionKey = "projects", TitleAr = "المشاريع", TitleEn = "Projects", RoutePath = "/projects", IconName = "Briefcase", IsVisibleInNavbar = true, NavbarOrder = 3, IsVisibleInHome = true, HomeOrder = 2 },
                new SiteSection { SectionKey = "skills", TitleAr = "المهارات", TitleEn = "Skills", RoutePath = "/skills", IconName = "Cpu", IsVisibleInNavbar = true, NavbarOrder = 4, IsVisibleInHome = false, HomeOrder = 3 },
                new SiteSection { SectionKey = "certificates", TitleAr = "الشهادات", TitleEn = "Certificates", RoutePath = "/certificates", IconName = "Award", IsVisibleInNavbar = false, NavbarOrder = 5, IsVisibleInHome = false, HomeOrder = 4 },
                new SiteSection { SectionKey = "blog", TitleAr = "المدونة", TitleEn = "Blog", RoutePath = "/blog", IconName = "BookOpen", IsVisibleInNavbar = true, NavbarOrder = 6, IsVisibleInHome = true, HomeOrder = 5 },
                new SiteSection { SectionKey = "about", TitleAr = "عني", TitleEn = "About", RoutePath = "/about", IconName = "User", IsVisibleInNavbar = true, NavbarOrder = 7, IsVisibleInHome = false, HomeOrder = 6 },
                new SiteSection { SectionKey = "contact", TitleAr = "تواصل معي", TitleEn = "Contact", RoutePath = "/contact", IconName = "Mail", IsVisibleInNavbar = true, NavbarOrder = 8, IsVisibleInHome = true, HomeOrder = 7 },
            };
            context.SiteSections.AddRange(sections);
        }

        await context.SaveChangesAsync();
    }
}
