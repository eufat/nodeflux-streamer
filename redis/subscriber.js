const app = require("express")();
const http = require("http").Server(app);
// const io = require("socket.io")(http);
const redis = require("redis");
const WebSocket = require("ws");
// const jpeg = require("jpeg-js");
// const inkjet = require("inkjet");

const writeCSV = require("../utils/csv");

// const sub = redis.createClient();

const sub = redis.createClient({
    host: "52.221.238.228",
    port: "7001"
});

const wss = new WebSocket.Server({
    port: 8080
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// io.on("connection", function(socket) {
//     // console.log("a user connected");
//     socket.on("disconnect", function() {
//         console.log("user disconnected");
//     });
// });

wss.on("connection", function connection(ws) {
    console.log("Connected with client.");

    // let i = 1;
    // setInterval(() => {
    //     let message = `Message #${i}`;
    //     ws.send(message);
    //     console.log("Message sent: ", message);
    //     i++;
    // }, 1000);
    let i = 0;

    sub.on("message", (channel, message) => {
        // const jpegData = jpeg.decode(message);
        ws.send(message);

        console.log(`From ${channel} sent ${i}`);
        i++;

        /*
        inkjet.decode(message, (err, decoded) => {
            if (err) {
                console.log("Error: ", err);
            } else {
                console.log("Image width: ", decoded.width);
                console.log("Image height: ", decoded.height);

                const jpegData = decoded.data;

                const base64Image = Buffer.from(jpegData).toString("base64");
                ws.send(base64Image);
            }
            // decoded: { width: number, height: number, data: Uint8Array }
        });

        */
        // console.log(`From ${channel} sent: ${base64Image}`);
        // message = Buffer.from(message, "base64");

        // io.sockets.emit("redis_frames", { message });
        console.log(
            // `Message sent to socket: ${message}, encoded: ${base64Image}`
            `Message sent from channel: ${channel}`
        );
    });

    sub.subscribe("nodeflux");
});

sub.on("error", err => {
    console.log("Error " + err);
});

http.listen(3000, function() {
    console.log("listening on *:3000");
});
