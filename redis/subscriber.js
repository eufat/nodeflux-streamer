const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const redis = require("redis");
const sub = redis.createClient();

sub.on("message", (channel, message) => {
    io.on("connection", socket => {
        socket.emit("redis_frames", { message });
    });
});

sub.subscribe("redis_frames");

sub.on("error", err => {
    console.log("Error " + err);
});
