<script>
  import Divider from "./components/Divider.svelte";
  import Space from "./components/Space.svelte";

  let serverAddress = "";
  let port = 0;

  let errorTxt = "";

  function joinServer() {
    console.log("Join Server");
    socket.connect(port, serverAddress, () => {
      errorTxt = "CONNECTED";
    });
  }

  function createNewBoard() {}

  socket.on("error", () => {
    errorTxt = "Cannot connect to server!";
  });
</script>

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
        <input class="flex-1" type="text" name="boardId" />
      </div>
      <button on:click={joinServer}>Join</button>
    </div>
  </div>

  <Space size="8" />

  <p class="color-red text-centered">{errorTxt}</p>
</main>

<style>
</style>
