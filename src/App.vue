<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
    name: 'App',
    created() {
    },
    mounted() {
    }
}
</script>

<style lang="scss">
  #app {
      height: 100%;
      font-size: 14px;
      > div {
          height: 100%;
      }
  }
  
</style>
