<script>
  export let vertical = false;
</script>

<div
  style="{vertical ? 'max-height:100%; ' : 'max-width:100%;'} {vertical
    ? 'width: 4px'
    : 'height: 4px'}"
/>

<style>
  div {
    margin: 8px;
    background-color: rgb(186, 186, 186);
    border-radius: 2px;
  }
</style>
