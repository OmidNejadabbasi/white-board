import { Socket } from "dgram";
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
    this.pixels = lod.times(height, () => new Array<Pixel>(width));
    this.width = width;
    this.height = height;
  }

  subscribe(socket: Socket) {
    this.sockets.push(socket);
    socket.on("close", () => {
      let ind = this.sockets.indexOf(socket);
      this.sockets.slice(ind, 1);
    });
    socket.send(`BOARD ${this.width} ${this.height}\n`);
    socket.send(this.pixelsLines());
  }

  pixelsLines(): string {
    let string = "";
    for (let i = 0; i < this.pixels.length; i++) {
      for (let j = 0; j < this.pixels[i].length; j++) {
        let p = this.pixels[i][j];
        string += `${i} ${j} ${p.r} ${p.g} ${p.b}\n`;
      }
    }

    return string;
  }
}

export class Pixel {
  r: number = 0;
  g: number = 0;
  b: number = 0;
}
