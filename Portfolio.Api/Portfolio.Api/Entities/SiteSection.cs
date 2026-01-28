
namespace Portfolio.Api.Entities;

public class SiteSection
{
    public int Id { get; set; }
    public string SectionKey { get; set; } = string.Empty; // Unique key: 'home', 'about', 'skills', etc.
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string RoutePath { get; set; } = string.Empty; // e.g. "/projects", "/about"
    public string IconName { get; set; } = "Circle"; // Lucide icon name

    // Navbar Control
    public bool IsVisibleInNavbar { get; set; } = true;
    public int NavbarOrder { get; set; }

    // Home Page Section Control
    public bool IsVisibleInHome { get; set; } = false; // Does it have a section in Home?
    public int HomeOrder { get; set; }
}
