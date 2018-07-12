const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const redis = require("redis");
const sub = redis.createClient();

/* const sub = redis.createClient({
    host: "52.221.238.228",
    port: "7001",
    password: ""
}); */

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
    // console.log("a user connected");
    socket.on("disconnect", function() {
        console.log("user disconnected");
    });
});

sub.on("message", (channel, message) => {
    console.log(`From ${channel} sent: ${message}`);
    io.sockets.emit("redis_frames", { message });
    console.log("Message sent to socket: ", message);
});

sub.subscribe("redis_frames");

sub.on("error", err => {
    console.log("Error " + err);
});

http.listen(3000, function() {
    console.log("listening on *:3000");
});
