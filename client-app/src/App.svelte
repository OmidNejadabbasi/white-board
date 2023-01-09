<script>
  import Divider from "./components/Divider.svelte";
  import Space from "./components/Space.svelte";

  function joinServer() {
    console.log("Join Server");
  }

  function createNewBoard() {}

  socket.connect(6969, "localhost", () => {
    console.log("Iam Connected!!!");
  });
</script>

<main class="flex-column justify-center">
  <label for="server">Server Address:</label>
  <input type="text" name="server" />

  <label for="port">Server Port:</label>
  <input type="text" name="port" />

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
</main>

<style>
</style>
