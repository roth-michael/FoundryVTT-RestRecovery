<script>
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    export let text;
    export let progress = 0;
    export let progressGhost = 0;

    export let progressBar = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });

    export let progressBarGhost = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });

    $: progress, updateProgress();
    $: progressGhost, updateProgress();

    function updateProgress(){
        progressBar.set(progress);
        progressBarGhost.set(progressGhost);
    }

</script>

<div>
    <div class="healthbar">
        <div class="progress_ghost" style="width:{$progressBarGhost*100}%;"></div>
        <div class="progress" style="width:{$progressBar*100}%;"></div>
        <div class="overlay">{text}</div>
    </div>
</div>

<style lang="scss">

  .healthbar{
    width: 100%;
    height: 20px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #a7a7a7;

    > div {
      height: 100%;
    }

    .progress_ghost{
      z-index: 1;
      background-color: #bb7777;
    }

    .progress {
      z-index: 2;
      background-color: #d93131;
      position: relative;
      top: -20px;
    }

    .overlay{
      z-index: 3;
      position: relative;
      top: -40px;
      text-align: center;
      color: white;
      width: 100%;
      box-shadow: 0 0 2px 2px inset rgb(0 0 0 / 25%);
      line-height: 20px;
    }
  }

</style>