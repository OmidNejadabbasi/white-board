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
exports.Pixel = exports.Board = void 0;
var lod = __importStar(require("lodash"));
var Board = /** @class */ (function () {
    function Board(width, height) {
        this.sockets = [];
        this.id = Board.idCounter++;
        this.pixels = [];
        for (var i = 0; i < height; i++) {
            var _arr = new Array(width);
            lod.fill(_arr, new Pixel(255, 255, 255));
            this.pixels.push(_arr);
        }
        this.width = width;
        this.height = height;
    }
    Board.prototype.subscribe = function (socket) {
        var _this = this;
        this.sockets.push(socket);
        socket.on("close", function () {
            var ind = _this.sockets.indexOf(socket);
            _this.sockets.slice(ind, 1);
        });
        socket.write("BOARD ".concat(this.width, " ").concat(this.height, " ID ").concat(this.id, "\n"));
        console.log("BOARD ".concat(this.width, " ").concat(this.height, " ID ").concat(this.id, "\n"));
        socket.write(this.pixelsLines());
        socket.on("data", function (data) {
            data = data.toString();
            var lines = data.split("\n").filter(function (el) { return el.length > 0; });
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                var matches = line.match(/(\d+) (\d+) (\d+) (\d+) (\d+)/);
                if (matches) {
                    console.log(line);
                    var x = Number.parseInt(matches[1]);
                    var y = Number.parseInt(matches[2]);
                    var r = Number.parseInt(matches[3]);
                    var g = Number.parseInt(matches[4]);
                    var b = Number.parseInt(matches[5]);
                    _this.pixels[y][x] = new Pixel(r, g, b);
                }
                else {
                    console.log("Data format is incorrect!");
                }
            }
            _this.notifyAllBut(socket);
        });
    };
    Board.prototype.notifyAllBut = function (sock) {
        var _this = this;
        this.sockets.forEach(function (socket) {
            if (socket !== sock)
                socket.write(_this.pixelsLines());
        });
    };
    Board.prototype.pixelsLines = function () {
        var string = "";
        for (var i = 0; i < this.pixels.length; i++) {
            for (var j = 0; j < this.pixels[i].length; j++) {
                var p = this.pixels[i][j];
                string += "".concat(j, " ").concat(i, " ").concat(p.r, " ").concat(p.g, " ").concat(p.b, "\n");
            }
        }
        return string;
    };
    Board.idCounter = 1001;
    return Board;
}());
exports.Board = Board;
var Pixel = /** @class */ (function () {
    function Pixel(r, g, b) {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return Pixel;
}());
exports.Pixel = Pixel;
