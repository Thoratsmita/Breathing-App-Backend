const redis = require('redis');

let client = redis.createClient(
    6379,
    '127.0.0.1',
    {
        return_buffers: true,
        auth_pass: null
    }
);

client.on("connect", function(err) {
    if (err) {
        throw err;
    } else {
        console.log("Redis connection successful");
    }
});

module.exports = client;