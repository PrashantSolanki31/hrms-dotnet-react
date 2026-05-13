using DockerApp.Data;
using DockerApp.Model;
using DockerApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;
using System.Text.Json;

namespace DockerApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        //private readonly RedisService _redis;

        public UsersController(AppDbContext context)
        {
            _context = context;
            //_redis = redis;
        }

        [Authorize(Roles = "HR")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            string cacheKey = "users:all";

            // 1. CHECK CACHE
          //  var cachedData = await _redis.GetAsync(cacheKey);

            //if (!string.IsNullOrEmpty(cachedData))
            //{
            //    Console.WriteLine("🔥 CACHE HIT (users:all)");
            //    var cachedUsers = JsonSerializer.Deserialize<List<User>>(cachedData);
            //    return Ok(cachedUsers);
            //}
            Console.WriteLine("❌ CACHE MISS (users:all) → Fetching from DB");
            // 2. DB FETCH
            var users = await _context.Users.ToListAsync();

            // 3. STORE IN CACHE
            var json = JsonSerializer.Serialize(users);

            //await _redis.SetAsync(
            //    cacheKey,
            //    json,
            //    TimeSpan.FromMinutes(5)
            //);

            return Ok(users);
        }
    }
    
}
