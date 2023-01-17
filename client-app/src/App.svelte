<script>
  import Divider from "./components/Divider.svelte";
  import Space from "./components/Space.svelte";
  import Board from "./Board.svelte";

  let serverAddress = "";
  let port = 0;
  let boardId = null;
  let boardValid = false;
  let boardDimen = { width: 0, height: 0 };

  let errorTxt = "";

  function joinServer() {
    console.log("Join Server");
    socket.connect(port, serverAddress, () => {
      errorTxt = "CONNECTED";
      boardValid = true;
      socket.write(`JOIN ${boardId}`);
    });
  }

  let widthInput, heightInput;
  function createNewBoard() {
    socket.connect(port, serverAddress, () => {
      errorTxt = "CONNECTED";
      boardValid = true;
      socket.write(`CREATE ${widthInput} ${heightInput}`);
    });
  }

  socket.on("error", () => {
    errorTxt = "Cannot connect to server!";
  });
</script>

{#if !boardValid}
  <main class="flex-column justify-center">
    <label for="server">Server Address:</label>
    <input type="text" name="server" bind:value={serverAddress} />

    <label for="port">Server Port:</label>
    <input type="number" name="port" bind:value={port} />

    <Divider />

    <div class="flex">
      <div class="flex-column w-full">
        <div class="flex justify-center">
          <input
            type="number"
            bind:value={widthInput}
            name="width"
            id="width"
            placeholder="Width"
          />
          <Space vertical={false} size="3" />
          <input
            type="number"
            bind:value={heightInput}
            name="height"
            id="height"
            placeholder="Height"
          />
        </div>
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
  <Board
    {port}
    {serverAddress}
    {boardDimen}
    {boardId}
    {socket}
    bind:boardValid
  />
{/if}

<style>
</style>
