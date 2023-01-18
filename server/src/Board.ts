import { Socket } from "net";
import * as lod from "lodash";

export class Board {
  private static idCounter: number = 1001;

  private sockets: Socket[] = [];

  id: number;
  pixels: Pixel[][];
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.id = Board.idCounter++;
    this.pixels = [];
    for (let i = 0; i < height; i++) {
      let _arr = new Array(width);
      lod.fill(_arr, new Pixel(255, 255, 255));

      this.pixels.push(_arr);
    }

    this.width = width;
    this.height = height;
  }

  subscribe(socket: Socket) {
    this.sockets.push(socket);
    socket.on("close", () => {
      let ind = this.sockets.indexOf(socket);
      this.sockets.slice(ind, 1);
    });
    socket.write(`BOARD ${this.width} ${this.height} ID ${this.id}\n`);
    console.log(`BOARD ${this.width} ${this.height} ID ${this.id}\n`);
    socket.write(this.pixelsLines());
    socket.on("data", (data: string) => {
      data = data.toString();
      let lines = data.split("\n").filter((el) => el.length > 0);
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let matches = line.match(/(\d+) (\d+) (\d+) (\d+) (\d+)/);
        if (matches) {
          let x = Number.parseInt(matches[1]);
          let y = Number.parseInt(matches[2]);
          let r = Number.parseInt(matches[3]);
          let g = Number.parseInt(matches[4]);
          let b = Number.parseInt(matches[5]);
          this.pixels[y][x] = new Pixel(r, g, b);
        } else {
          console.log("Data format is incorrect!");
        }
      }
      this.notifyAllBut(socket);
    });
  }

  notifyAllBut(sock: Socket) {
    this.sockets.forEach((socket) => {
      if (socket !== sock) socket.write(this.pixelsLines());
    });
  }

  pixelsLines(): string {
    let string = "";
    for (let i = 0; i < this.pixels.length; i++) {
      for (let j = 0; j < this.pixels[i].length; j++) {
        let p = this.pixels[i][j];
        string += `${j} ${i} ${p.r} ${p.g} ${p.b}\n`;
      }
    }

    return string;
  }
}

export class Pixel {
  r: number = 0;
  g: number = 0;
  b: number = 0;
  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}
