using Portfolio.Api.DTOs;

namespace Portfolio.Api.Interfaces;

public interface ICertificationService
{
    Task<IEnumerable<CertificationDto>> GetAllCertificationsAsync();
    Task<IEnumerable<CertificationDto>> GetAdminCertificationsAsync();
    Task<IEnumerable<CertificationDto>> GetFeaturedCertificationsAsync();
    Task<IEnumerable<CertificationDto>> GetCertificationsByPlatformAsync(string platformType);
    Task<CertificationDto?> GetCertificationByIdAsync(int id);
    Task<CertificationDto> CreateCertificationAsync(CreateCertificationDto dto);
    Task UpdateCertificationAsync(int id, UpdateCertificationDto dto);
    Task DeleteCertificationAsync(int id);
    Task ToggleCertificationStatusAsync(int id);
}
