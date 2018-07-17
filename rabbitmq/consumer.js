const amqp = require("amqplib/callback_api");
const WebSocket = require("ws");

const writeCSV = require("../utils/csv");

const wss = new WebSocket.Server({
    port: 8090
});

amqp.connect(
    "amqp://54.169.10.141:7002",
    (err, conn) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Connected with producer.");

            wss.on("connection", function connection(ws) {
                // console.log("Connected with client.");

                conn.createChannel(function(err, ch) {
                    const ex = "processed_img";

                    ch.assertExchange(ex, "fanout", { durable: false });

                    ch.assertQueue("", { exclusive: true }, function(err, q) {
                        console.log(
                            " [*] Waiting for messages in %s. To exit press CTRL+C",
                            q.queue
                        );
                        ch.bindQueue(q.queue, ex, "");

                        ch.consume(
                            q.queue,
                            function(msg) {
                                const message = msg.content.toString();
                                const ob = JSON.parse(message);

                                ws.send(ob.data);

                                delete ob["data"];
                                console.log("Sending frame: ", ob.frame);

                                ob["timestamp"] = new Date().getTime();

                                writeCSV(ob);
                                // console.log(" [x] %s", msg.content.toString());
                            },
                            { noAck: true }
                        );
                    });
                });
            });
        }
    }
);
