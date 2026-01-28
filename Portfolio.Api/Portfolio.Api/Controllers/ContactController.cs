using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs;
using Portfolio.Api.Entities;

namespace Portfolio.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContactController : ControllerBase
{
    private readonly PortfolioDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<ContactController> _logger;

    public ContactController(PortfolioDbContext context, IMapper mapper, ILogger<ContactController> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// إرسال رسالة تواصل (عام)
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] CreateContactMessageDto dto)
    {
        try 
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // We use the proper entity fields now as we are preparing for migration
            var message = new ContactMessage
            {
                Name = dto.Name,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Subject = dto.Subject,
                Message = dto.Message,
                PreferredContactMethod = dto.PreferredContactMethod,
                SentDate = DateTime.UtcNow,
                IsRead = false
            };

            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { 
                messageAr = "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً",
                messageEn = "Your message has been sent successfully. We will contact you soon." 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while saving contact message. Did you run the migration?");
            return StatusCode(500, new { message = "حدث خطأ أثناء حفظ الرسالة. تأكد من تحديث قاعدة البيانات.", details = ex.Message });
        }
    }

    /// <summary>
    /// الحصول على جميع الرسائل (Admin فقط)
    /// </summary>
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ContactMessageDto>>> GetAllAdmin()
    {
        var messages = await _context.ContactMessages
            .AsNoTracking()
            .OrderByDescending(m => m.SentDate)
            .ToListAsync();

        var dtos = messages.Select(m => new ContactMessageDto
        {
            Id = m.Id,
            Name = m.Name,
            Email = m.Email,
            PhoneNumber = m.PhoneNumber,
            Subject = m.Subject,
            Message = m.Message,
            PreferredContactMethod = m.PreferredContactMethod,
            SentDate = m.SentDate,
            IsRead = m.IsRead
        });

        return Ok(dtos);
    }

    [HttpGet("admin/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ContactMessageDto>> GetByIdAdmin(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null) return NotFound();
        if (!message.IsRead) { message.IsRead = true; await _context.SaveChangesAsync(); }
        
        return Ok(new ContactMessageDto {
            Id = message.Id,
            Name = message.Name,
            Email = message.Email,
            PhoneNumber = message.PhoneNumber,
            Subject = message.Subject,
            Message = message.Message,
            PreferredContactMethod = message.PreferredContactMethod,
            SentDate = message.SentDate,
            IsRead = message.IsRead
        });
    }

    [HttpDelete("admin/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAdmin(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null) return NotFound();
        _context.ContactMessages.Remove(message);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }

    [HttpPatch("admin/{id}/toggle-read")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleReadAdmin(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null) return NotFound();
        message.IsRead = !message.IsRead;
        await _context.SaveChangesAsync();
        return Ok(new { isRead = message.IsRead });
    }
}
