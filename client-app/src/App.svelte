<script>
  function joinServer() {
    console.log("Join Server");
  }
  socket.connect(6969, "localhost", () => {
    console.log("Iam Connected!!!");
  });
</script>

<main>
  <label for="server">Server Address:</label>
  <input type="text" name="server" />

  <label for="port">Server Address:</label>
  <input type="text" name="port" />

  <label for="boardId">
    <input type="text" name="boardId" />
  </label>
  <button on:click={joinServer}>Join</button>
</main>

<style>
</style>
