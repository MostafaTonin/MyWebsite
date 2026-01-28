using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddHomeSettingsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CertificatesCount",
                table: "AboutSections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "ShowBlogSection",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowCertificationsSection",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowContactSection",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowProjectsSection",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowServicesSection",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TechnologiesCount",
                table: "AboutSections",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CertificatesCount",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowBlogSection",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowCertificationsSection",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowContactSection",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowProjectsSection",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowServicesSection",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "TechnologiesCount",
                table: "AboutSections");
        }
    }
}
