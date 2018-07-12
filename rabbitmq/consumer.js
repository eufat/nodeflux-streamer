const amqp = require("amqplib/callback_api");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const redis = require("redis");
const client = redis.createClient();

amqp.connect(
    "amqp://localhost",
    (err, conn) => {
        conn.createChannel((err, ch) => {
            const q = "frames";

            ch.assertQueue(q, { durable: false });

            ch.consume(
                q,
                msg => {
                    const message = msg.content.toString();

                    io.on("connection", socket => {
                        socket.emit("rabbitmq_frames", { message });
                    });
                },
                { noAck: true }
            );
        });
    }
);
