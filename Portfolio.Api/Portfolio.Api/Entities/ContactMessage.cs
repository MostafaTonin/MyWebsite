
namespace Portfolio.Api.Entities;

public class ContactMessage
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? PreferredContactMethod { get; set; } // Email, WhatsApp, Phone
    public DateTime SentDate { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; }
}
