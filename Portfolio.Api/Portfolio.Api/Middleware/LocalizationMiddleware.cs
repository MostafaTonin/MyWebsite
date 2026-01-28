using System.Globalization;

namespace Portfolio.Api.Middleware;

/// <summary>
/// Middleware لدعم اللغات المتعددة
/// </summary>
public class LocalizationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string[] _supportedLanguages = { "ar", "en" };

    public LocalizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // قراءة اللغة من Header
        var language = context.Request.Headers["Accept-Language"].FirstOrDefault() ?? "ar";
        
        // التحقق من أن اللغة مدعومة
        if (!_supportedLanguages.Contains(language))
        {
            language = "ar"; // اللغة الافتراضية
        }

        // تعيين اللغة الحالية
        var culture = new CultureInfo(language);
        CultureInfo.CurrentCulture = culture;
        CultureInfo.CurrentUICulture = culture;

        // إضافة اللغة إلى Items للوصول إليها في Controllers
        context.Items["Language"] = language;

        await _next(context);
    }
}
