<template>
  <div id="app" @mousedown="mouseDown">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from "vue"
const isMouseDown = ref(false)
const dinatesX = ref(0)
const dinatesY = ref(0)
function mouseDown(e) {
  isMouseDown.value = true
  dinatesX.value = e.x
  dinatesY.value = e.y
  document.onmousemove = (ev) => {
   
    if (isMouseDown.value) {
      const x = ev.screenX - dinatesX.value
      const y = ev.screenY - dinatesY.value
      //给主进程传入坐标
      let data = {
        appX: x,
        appY: y
      }
      window.api.setPosition(data)
    }
  }
  document.onmouseup = (ev) => {
    isMouseDown.value = false
    document.removeEventListener("mousemove", () => { })
  };
}


</script>

<style lang="scss" scoped>

</style>