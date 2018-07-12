const redis = require("redis");
const sub = redis.createClient();
const pub = redis.createClient();

console.log("Waiting for subscriber ...");

sub.on("subscribe", function(channel, count) {
    console.log("Subscriber connected: ", channel);
    setInterval(() => {
        const message = "Some message.";
        console.log("sending: ", message);
        pub.publish("redis_frames", message);
    }, 1000);
});

let iterator = 1;
setInterval(() => {
    const message = `message #${iterator}.`;
    console.log("sending: ", message);
    pub.publish("redis_frames", message);
    iterator++;
}, 1000);

sub.on("error", err => {
    console.log("Error " + err);
});
