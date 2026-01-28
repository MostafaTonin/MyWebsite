using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddExtendedAboutFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExperienceDescriptionAr",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ExperienceDescriptionEn",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ExtendedBioAr",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ExtendedBioEn",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "FreelanceProjectsCount",
                table: "AboutSections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "ShowExperience",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowExtendedBio",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowHeroAbout",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowSoftSkills",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowStats",
                table: "AboutSections",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SoftSkillsAr",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SoftSkillsEn",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExperienceDescriptionAr",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ExperienceDescriptionEn",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ExtendedBioAr",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ExtendedBioEn",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "FreelanceProjectsCount",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowExperience",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowExtendedBio",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowHeroAbout",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowSoftSkills",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ShowStats",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "SoftSkillsAr",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "SoftSkillsEn",
                table: "AboutSections");
        }
    }
}
