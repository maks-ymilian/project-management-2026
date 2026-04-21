using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JCK.Migrations
{
    /// <inheritdoc />
    public partial class review_userid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReviewerProfileImage",
                table: "Reviews");

            migrationBuilder.RenameColumn(
                name: "ReviewerName",
                table: "Reviews",
                newName: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Reviews",
                newName: "ReviewerName");

            migrationBuilder.AddColumn<string>(
                name: "ReviewerProfileImage",
                table: "Reviews",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }
    }
}
