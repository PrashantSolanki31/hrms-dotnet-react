using System.ComponentModel.DataAnnotations;

namespace DockerApp.Model
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string Role { get; set; } = "Employee";
    }
}
