<script lang="ts">
  export let size: string = "250px"
</script>

<div class="spinnerContainer">
  <div class="spinner" style={`--size: ${size}`} />
</div>

<style>
  div.spinnerContainer {
    width: 100%;
    text-align: center;
  }
  div.spinner {
    width: var(--size);
    height: var(--size);
    display: inline-block;
    border: 5px solid var(--border-main);
    border-top: 5px solid transparent;
    border-radius: 50%;
  }

  .spinner {
    transition-property: transform;
    animation-name: rotate;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
