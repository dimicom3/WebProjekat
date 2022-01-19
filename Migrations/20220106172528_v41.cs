using Microsoft.EntityFrameworkCore.Migrations;

namespace webProjekat.Migrations
{
    public partial class v41 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Sifra",
                table: "User",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CategoryID",
                table: "Thread",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Thread_CategoryID",
                table: "Thread",
                column: "CategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Thread_Categories_CategoryID",
                table: "Thread",
                column: "CategoryID",
                principalTable: "Categories",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Thread_Categories_CategoryID",
                table: "Thread");

            migrationBuilder.DropIndex(
                name: "IX_Thread_CategoryID",
                table: "Thread");

            migrationBuilder.DropColumn(
                name: "Sifra",
                table: "User");

            migrationBuilder.DropColumn(
                name: "CategoryID",
                table: "Thread");
        }
    }
}
