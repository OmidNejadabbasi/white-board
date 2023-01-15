<script>
  import { Pixel } from "./Pixel";
  import { bufferTime, filter, Subject } from "rxjs";
  import { onDestroy } from "svelte";

  export let serverAddress;
  export let port;
  export let boardDimen;
  export let boardId;
  export let socket;
  export let boardValid;

  let boardCanvas;
  let pixelObservable = new Subject();

  socket.on("data", (data) => {
    data = data.toString();
    let lines = data.split("\n");
    lines.forEach((line) => {
      if (line.match(/(\d+) (\d+) (\d+) (\d+) (\d+)/)) {
        let matches = line.match(/(\d+) (\d+) (\d+) (\d+) (\d+)/);
        if (matches) {
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
        let boardData = line.match(/BOARD (\d+) (\d+)/);
        boardValid = true;
        if (boardData) {
          boardDimen = {
            width: Number.parseInt(boardData[1]),
            height: Number.parseInt(boardData[2]),
          };
        }
      }
    });
  });

  pixelObservable
    .pipe(
      bufferTime(220),
      filter((a) => a.length > 0)
    )
    .subscribe((pixels) => {
      let boardContext = boardCanvas.getContext("2d");
      let boardData = boardContext.getImageData(
        0,
        0,
        boardDimen.width,
        boardDimen.height
      );
      for (let i = 0; i < pixels.length; i++) {
        let index = pixels[i].x * 4 * boardData.width + pixels[i].y * 4;
        boardData.data[index] = pixels[i].r;
        boardData.data[index + 1] = pixels[i].g;
        boardData.data[index + 2] = pixels[i].b;
        boardData.data[index + 3] = 255;
      }
      boardContext.putImageData(boardData, 0, 0);
    });

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
  >
    Shit! HTML Canvas Not supported!
  </canvas>
</div>
;
