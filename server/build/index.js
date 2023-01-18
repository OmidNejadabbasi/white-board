"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var net = __importStar(require("net"));
var Board_1 = require("./Board");
var HOST = "127.0.0.1";
var PORT = 6969;
var BOARDS = [];
net
    .createServer(function (sock) {
    console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);
    sock.on("error", function (socket) {
        console.log("client error\n");
    });
    sock.on("data", function (dataBuffer) {
        var data = dataBuffer.toString();
        var match;
        if ((match = data.match(/CREATE (\d+) (\d+)/))) {
            var newBoard = new Board_1.Board(Number.parseInt(match[1]), Number.parseInt(match[2]));
            newBoard.subscribe(sock);
            BOARDS.push(newBoard);
        }
        else if ((match = data.match(/JOIN (\d+)/))) {
            var board = BOARDS.find(function (elem) {
                if (match) {
                    return elem.id === Number.parseInt(match[1]);
                }
            });
            if (board) {
                board.subscribe(sock);
            }
            else {
                sock.write("BOARD NOT FOUND");
            }
        }
    });
    sock.on("close", function (data) {
        console.log("CLOSED: " + sock.remoteAddress + " " + sock.remotePort);
    });
})
    .listen(PORT, HOST);
console.log("Server listening on " + HOST + ":" + PORT);
BOARDS.push(new Board_1.Board(40, 30));
console.log("New Board Id : ", BOARDS[0].id);
