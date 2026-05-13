using DockerApp.Data;
using DockerApp.Model;
using Microsoft.EntityFrameworkCore;

namespace DockerApp.DataSeeder;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (!db.Users.Any(u => u.Role == "HR"))
        {
            db.Users.Add(new User
            {
                Name = "Admin",
                Email = "admin@gmail.com",
                Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "HR"
            });

            db.SaveChanges();
        }
    }
}