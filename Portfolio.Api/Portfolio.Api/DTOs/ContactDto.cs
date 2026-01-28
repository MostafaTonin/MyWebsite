using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs;

public class ContactMessageDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? PreferredContactMethod { get; set; }
    public DateTime SentDate { get; set; }
    public bool IsRead { get; set; }
}

public class CreateContactMessageDto
{
    [Required(ErrorMessage = "الاسم مطلوب")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "البريد الإلكتروني مطلوب")]
    [EmailAddress(ErrorMessage = "البريد الإلكتروني غير صحيح")]
    public string Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    [Required(ErrorMessage = "الموضوع مطلوب")]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "الرسالة مطلوبة")]
    public string Message { get; set; } = string.Empty;

    public string? PreferredContactMethod { get; set; } // Email, WhatsApp, Phone
}
