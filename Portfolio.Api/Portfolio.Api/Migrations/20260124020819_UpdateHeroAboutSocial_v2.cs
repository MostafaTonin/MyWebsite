using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHeroAboutSocial_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BioAr",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BioEn",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CtaPrimaryTextAr",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CtaPrimaryTextEn",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CtaSecondaryTextAr",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CtaSecondaryTextEn",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CvUrl",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FullNameAr",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FullNameEn",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroGreetingAr",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroGreetingEn",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PositionAr",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PositionEn",
                table: "AboutSections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ProjectsCompleted",
                table: "AboutSections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "YearsOfExperience",
                table: "AboutSections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SocialLinks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Platform = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IconName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialLinks", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SocialLinks");

            migrationBuilder.DropColumn(
                name: "BioAr",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "BioEn",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "CtaPrimaryTextAr",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "CtaPrimaryTextEn",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "CtaSecondaryTextAr",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "CtaSecondaryTextEn",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "CvUrl",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "FullNameAr",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "FullNameEn",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "HeroGreetingAr",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "HeroGreetingEn",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "PositionAr",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "PositionEn",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "ProjectsCompleted",
                table: "AboutSections");

            migrationBuilder.DropColumn(
                name: "YearsOfExperience",
                table: "AboutSections");
        }
    }
}
