import { attempt } from "lodash";
import * as net from "net";
import { Board } from "./Board";

var HOST = "127.0.0.1";
var PORT = 6969;

let BOARDS: Board[] = [];

net
  .createServer(function (sock) {
    console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);
    sock.on("data", function (dataBuffer: Buffer) {
      let data = dataBuffer.toString();
      console.log(data);

      let match: RegExpMatchArray | null;
      if ((match = data.match(/CREATE (d+) (d+)/))) {
        let newBoard = new Board(
          Number.parseInt(match[1]),
          Number.parseInt(match[2])
        );
        newBoard.subscribe(sock);
        BOARDS.push(newBoard);
      } else if ((match = data.match(/JOIN (\d+)/))) {
        BOARDS.find((elem) => {
          if (match) {
            return elem.id === Number(match[1]);
          }
        })?.subscribe(sock);
      }
    });
    sock.on("close", function (data) {
      console.log("CLOSED: " + sock.remoteAddress + " " + sock.remotePort);
    });
  })
  .listen(PORT, HOST);

console.log("Server listening on " + HOST + ":" + PORT);

BOARDS.push(new Board(200, 400));
console.log("new Board Id : ", BOARDS[0].id);
