using DockerApp.Data;
using DockerApp.DTO;
using DockerApp.Model;
using DockerApp.Requests;
using DockerApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DockerApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        //private readonly RedisService _redis;
        public AuthController(AppDbContext context, IConfiguration config )
        {
            _context = context;
            _config = config;
            //_redis = redis;
        }
        [Authorize(Roles = "HR")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO registerDTO)
        {
            Log.Information("Registration attempt for {Email}", registerDTO.Email);

            try
            {
                var existingUser = _context.Users
                    .FirstOrDefault(x => x.Email == registerDTO.Email);

                if (existingUser != null)
                {
                    Log.Warning("Registration failed: User already exists {Email}", registerDTO.Email);
                    return BadRequest("User already exists");
                }

                var user = new User
                {
                    Name = registerDTO.Name,
                    Email = registerDTO.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password),
                    Role = "Employee"
                };

                _context.Users.Add(user);
                _context.SaveChanges();
                //await _redis.RemoveAsync("users:all");

                Log.Information("User {Email} registered successfully with role {Role}", user.Email, user.Role);

                return Ok(new
                {
                    user.Id,
                    user.Email,
                    user.Role
                });
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred during registration for {Email}", registerDTO.Email);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("login")]
        public async  Task<IActionResult> Login(LoginRequest loginRequest)
        {
            Log.Information("Login attempt for user {Email}", loginRequest.Email);

            try
            {
                var user = _context.Users
                    .FirstOrDefault(x => x.Email == loginRequest.Email);

                if (user == null)
                {
                    Log.Warning("Login failed: User not found for {Email}", loginRequest.Email);
                    return Unauthorized();
                }

                bool isValid = BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password);

                if (!isValid)
                {
                    Log.Warning("Login failed: Invalid password for {Email}", loginRequest.Email);
                    return Unauthorized();
                }

                var token = GenerateJwtToken(user);
                var safeUser = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role
                };

                var cacheKey = $"user:{user.Id}";
                var cacheValue = System.Text.Json.JsonSerializer.Serialize(safeUser);

               // await _redis.SetAsync(cacheKey, cacheValue, TimeSpan.FromMinutes(10));

                Log.Information("User {Email} cached in Redis", user.Email);

                Log.Information("User {Email} logged in successfully", loginRequest.Email);

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred during login for {Email}", loginRequest.Email);
                return StatusCode(500, "Internal server error");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), 
            new Claim(ClaimTypes.Name, user.Name),                    
            new Claim(ClaimTypes.Email, user.Email),                  
            new Claim(ClaimTypes.Role, user.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}