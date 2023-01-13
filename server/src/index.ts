import * as net from "net";
import { Board } from "./Board";

var HOST = "127.0.0.1";
var PORT = 6969;

let BOARDS: Board[] = [];

net
  .createServer(function (sock) {
    console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);
    sock.on("data", function (data: string) {
      let match: RegExpMatchArray | null;
      if ((match = data.match(/CREATE (d+) (d+)/))) {
      }
    });
    sock.on("close", function (data) {
      console.log("CLOSED: " + sock.remoteAddress + " " + sock.remotePort);
    });
  })
  .listen(PORT, HOST);

console.log("Server listening on " + HOST + ":" + PORT);
