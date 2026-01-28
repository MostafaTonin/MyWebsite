using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCertificationsStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionAr",
                table: "Certifications");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Certifications");

            migrationBuilder.DropColumn(
                name: "GradeAr",
                table: "Certifications");

            migrationBuilder.DropColumn(
                name: "GradeEn",
                table: "Certifications");

            migrationBuilder.RenameColumn(
                name: "CredentialUrl",
                table: "Certifications",
                newName: "PlatformLogoUrl");

            migrationBuilder.RenameColumn(
                name: "CertificateImageUrl",
                table: "Certifications",
                newName: "CertificateUrl");

            migrationBuilder.AddColumn<string>(
                name: "CustomPlatformName",
                table: "Certifications",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "Certifications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PlatformType",
                table: "Certifications",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "ShowOnHome",
                table: "Certifications",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomPlatformName",
                table: "Certifications");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "Certifications");

            migrationBuilder.DropColumn(
                name: "PlatformType",
                table: "Certifications");

            migrationBuilder.DropColumn(
                name: "ShowOnHome",
                table: "Certifications");

            migrationBuilder.RenameColumn(
                name: "PlatformLogoUrl",
                table: "Certifications",
                newName: "CredentialUrl");

            migrationBuilder.RenameColumn(
                name: "CertificateUrl",
                table: "Certifications",
                newName: "CertificateImageUrl");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionAr",
                table: "Certifications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Certifications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GradeAr",
                table: "Certifications",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GradeEn",
                table: "Certifications",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
