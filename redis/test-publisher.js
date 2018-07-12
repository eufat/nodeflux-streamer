const redis = require("redis");
const sub = redis.createClient();
const pub = redis.createClient();

sub.on("subscribe", function(channel, count) {
    let i = 0;
    while (i < 10) {
        pub.publish("redis_frames", "Some message.");
    }
});
