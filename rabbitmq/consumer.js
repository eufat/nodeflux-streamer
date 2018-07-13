const amqp = require("amqplib/callback_api");
const WebSocket = require("ws");

const wss = new WebSocket.Server({
    port: 8080
});

amqp.connect(
    "amqp://52.221.238.228:7002",
    (err, conn) => {
        wss.on("connection", function connection(ws) {
            console.log("Connected with client.");

            conn.createChannel((err, ch) => {
                const q = "processed_img";
                ch.assertQueue(q, { durable: false });

                let i = 0;
                ch.consume(
                    q,
                    msg => {
                        const message = msg.content.toString();

                        ws.send(message);

                        i++;
                    },
                    { noAck: true }
                );
            });
        });
    }
);
