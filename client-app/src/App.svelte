<script>
  import Divider from "./components/Divider.svelte";
  import Space from "./components/Space.svelte";
  import { bufferTime, filter, Subject } from "rxjs";
  import { Pixel } from "./Pixel";

  let serverAddress = "";
  let port = 0;
  let boardId = null;
  let boardReady = false;
  let boardDimen = { width: 0, height: 0 };
  let boardCanvas;
  let pixelObservable = new Subject();

  let errorTxt = "";

  socket.on("data", (data) => {
    data = data.toString();
    let lines = data.split("\n");
    for (let line of lines) {
      if (line.match(/BOARD (\d+) (\d+)/)) {
        let boardData = line.match(/BOARD (\d+) (\d+)/);
        boardReady = true;
        if (boardData) {
          boardDimen = {
            width: Number.parseInt(boardData[1]),
            height: Number.parseInt(boardData[2]),
          };
        }
        errorTxt = `Board with ID ${boardId} not found!`;
      } else if (line.match(/(\d+) (\d+) (\d+) (\d+) (\d+)/)) {
        console.log(line);
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
      }
    }
  });

  function joinServer() {
    console.log("Join Server");
    socket.connect(port, serverAddress, () => {
      errorTxt = "CONNECTED";
      socket.write(`JOIN ${boardId}\n`);
    });
  }

  function createNewBoard() {}

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

  socket.on("error", () => {
    errorTxt = "Cannot connect to server!";
  });
</script>

{#if !boardReady}
  <main class="flex-column justify-center">
    <label for="server">Server Address:</label>
    <input type="text" name="server" bind:value={serverAddress} />

    <label for="port">Server Port:</label>
    <input type="number" name="port" bind:value={port} />

    <Divider />

    <div class="flex">
      <div class="flex-column w-full">
        <p>To create new board:</p>
        <button on:click={createNewBoard}>Create New Board</button>
      </div>
      <Divider vertical={true} />

      <div class="flex-column w-full">
        <div class="flex">
          <p>Board ID:</p>
          <Space vertical={false} size="3" />
          <input
            class="flex-1"
            type="text"
            name="boardId"
            bind:value={boardId}
          />
        </div>
        <button on:click={joinServer}>Join</button>
      </div>
    </div>

    <Space size="8" />

    <p class="color-red text-centered">{errorTxt}</p>
  </main>
{:else}
  <div class="flex-column align-center">
    <p>{serverAddress}:{port} - Board ID: {boardId}</p>
    <p class="text-center">{boardDimen.width} * {boardDimen.height}</p>
    <canvas
      class="border-1"
      bind:this={boardCanvas}
      height={boardDimen.height}
      width={boardDimen.width}
    >
      Shit! HTML Canvas Not supported!
    </canvas>
  </div>
{/if}

<style>
</style>
