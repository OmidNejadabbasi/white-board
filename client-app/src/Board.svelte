<script>
  import { Pixel } from "./Pixel";
  import { bufferTime, filter, Subject } from "rxjs";
  import { onDestroy, onMount } from "svelte";
  import * as lod from "lodash";

  export let serverAddress;
  export let port;
  export let boardDimen;
  export let boardId;
  export let socket;
  export let boardValid;

  let boardCanvas;
  let pixelObservable = new Subject();
  let prevData = [];
  let boardData, boardContext;

  socket.on("error", () => {
    boardValid = false;
  });

  socket.on("data", (data) => {
    data = data.toString();
    let lines = data.split("\n");
    lines.forEach((line) => {
      if (line.match(/(\d+) (\d+) (\d+) (\d+) (\d+)/)) {
        let matches = line.match(/(\d+) (\d+) (\d+) (\d+) (\d+)/);
        if (matches) {
          console.log(line);
          let x = Number.parseInt(matches[1]);
          let y = Number.parseInt(matches[2]);
          let r = Number.parseInt(matches[3]);
          let g = Number.parseInt(matches[4]);
          let b = Number.parseInt(matches[5]);
          pixelObservable.next(new Pixel(r, g, b, x, y));
        } else {
          console.log("Data format is incorrect!");
        }
      } else if (line.match(/BOARD (\d+) (\d+)/)) {
        let boardInfo = line.match(/BOARD (\d+) (\d+)/);
        console.log(line);
        boardValid = true;
        if (boardInfo) {
          boardDimen = {
            width: Number.parseInt(boardInfo[1]),
            height: Number.parseInt(boardInfo[2]),
          };
          console.log(boardDimen);
        }
        boardContext = boardCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        boardData = boardContext.getImageData(
          0,
          0,
          boardDimen.width,
          boardDimen.height
        );
        console.log(boardData);
        prevData = lod.chunk(boardData.data, 4);
      }
    });
  });

  let canvas = {};

  onMount(() => {
    setTimeout(() => {});
    pixelObservable.pipe(bufferTime(4000)).subscribe((pixels) => {
      console.log("pixesl observable");
      boardContext = boardCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      boardData = boardContext.getImageData(
        0,
        0,
        boardDimen.width,
        boardDimen.height
      );
      if (pixels.length > 0) {
        for (let i = 0; i < pixels.length; i++) {
          let index = pixels[i].y * 4 * boardData.width + pixels[i].x * 4;
          boardData.data[index] = pixels[i].r;
          boardData.data[index + 1] = pixels[i].g;
          boardData.data[index + 2] = pixels[i].b;
          boardData.data[index + 3] = 255;
          console.log("pixel updated: " + JSON.stringify(pixels[i]));
        }
        boardContext.putImageData(boardData, 0, 0);
        prevData = lod.chunk(boardData.data, 4);
      }
      boardContext = boardCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      boardData = boardContext.getImageData(
        0,
        0,
        boardDimen.width,
        boardDimen.height
      );
      debugger;
      lod.chunk(lod.chunk(boardData.data, 4), 4000).forEach((val, index) => {
        let sentData = "";
        index = index * 4000;
        for (let i = 0; i < val.length; i++) {
          let prevPixel = prevData[index + i];
          let currentPix = val[i];
          if (!lod.isEqual(prevPixel, currentPix)) {
            let x = (index + i) % boardDimen.width;
            let y = Number.parseInt((index + i) / boardDimen.width);

            sentData += `${x} ${y} ${val[i][0]} ${val[i][1]} ${val[i][2]}\n`;
          }
        }
        if (sentData.length > 0) {
          debugger;
          socket.write(sentData);
        }
        prevData = lod.chunk(boardData.data, 4);
      });
    });

    canvas.node = boardCanvas;
    canvas.context = boardCanvas.getContext("2d", { willReadFrequently: true });
    canvas.context.fillCircle = function (x, y, radius, fillColor) {
      this.fillStyle = fillColor;
      this.beginPath();
      this.moveTo(x, y);
      this.arc(x, y, radius, 0, Math.PI * 2, false);
      this.fill();
    };
    canvas.node.onmousedown = function (e) {
      canvas.isDrawing = true;
    };
  });
  function mouseMove(e) {
    if (!canvas.isDrawing) {
      return;
    }
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    var radius = 10; // or whatever
    var fillColor = "#ff0000";
    canvas.context.fillCircle(x, y, radius, fillColor);
  }
  document.onmouseup = function (e) {
    canvas.isDrawing = false;
  };

  onDestroy(() => {
    socket.end();
  });
</script>

<div class="flex-column align-center">
  <p>
    {serverAddress}:{port} - Board ID: {boardId}
  </p>
  <p class="text-center">
    {boardDimen.width} * {boardDimen.height}
  </p>
  <canvas
    class="border-1"
    bind:this={boardCanvas}
    height={boardDimen.height}
    width={boardDimen.width}
    on:mousemove={mouseMove}
  >
    Shit! HTML Canvas Not supported!
  </canvas>
</div>
