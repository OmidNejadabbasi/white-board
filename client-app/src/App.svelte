<script>
  import Divider from "./components/Divider.svelte";
  import Space from "./components/Space.svelte";

  let serverAddress = "";
  let port = 0;
  let boardId = null;
  let boardReady = false;
  let boardDimen = { width: 0, height: 0 };
  let boardCanvas;

  let errorTxt = "";

  socket.on("data", (data) => {
    data = data.toString();
    let lines = data.split("\n");
    console.log(data);
    for (let line of lines) {
      if (line.match(/BOARD (\d+) (\d+)/)) {
        let boardData = line.match(/BOARD (\d+) (\d+)/);
        if (boardData) {
          boardDimen = {
            width: new Number(boardData[1]),
            height: new Number(boardData[2]),
          };
        }
      } else if (line.match("BOARD NOT FOUND")) {
        errorTxt = `Board with ID ${boardId} not found!`;
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
    <canvas class="border-1" bind:this={boardCanvas}>
      Shit! HTML Canvas Not supported!
    </canvas>
  </div>
{/if}

<style>
</style>
