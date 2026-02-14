
import sys
import redis
import os

def seed_url(url, redis_host='localhost', redis_port=6379, redis_key='nitt:start_urls'):
    """Pushes a URL to the Redis list for Scrapy to consume."""
    try:
        r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)
        # Check if Redis is accessible
        r.ping()
        
        # LPush adds to the head of the list. Scrapy-redis pops from the tail (FIFO) or head (LIFO) depending on config.
        # But generally, we just want it in the list.
        r.lpush(redis_key, url)
        print(f"Successfully added '{url}' to '{redis_key}'")
    except redis.ConnectionError:
        print(f"Error: Could not connect to Redis at {redis_host}:{redis_port}")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python seed.py <url> [redis_host] [redis_port]")
        sys.exit(1)
    
    url = sys.argv[1]
    host = sys.argv[2] if len(sys.argv) > 2 else 'localhost'
    port = int(sys.argv[3]) if len(sys.argv) > 3 else 6379
    
    seed_url(url, host, port)
