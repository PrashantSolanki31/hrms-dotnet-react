using StackExchange.Redis;

namespace DockerApp.Services;

public class RedisService
{
    private readonly IDatabase _cache;

    public RedisService(IConfiguration config)
    {
        var redis = ConnectionMultiplexer.Connect(config["Redis:Connection"]);
        _cache = redis.GetDatabase();
    }

    public async Task<string?> GetAsync(string key)
    {
        return await _cache.StringGetAsync(key);
    }

    public async Task SetAsync(string key, string value, TimeSpan? expiry = null)
    {
        if (expiry.HasValue)
        {
            await _cache.StringSetAsync(key, value, expiry.Value);
        }
        else
        {
            await _cache.StringSetAsync(key, value);
        }
    }
    public async Task RemoveAsync(string key)
    {
        await _cache.KeyDeleteAsync(key);
    }
}