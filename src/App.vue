

<template>
  <div id="app">
    <menu-component/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import MenuComponent from './components/menu.component.vue';

  @Component({
    components: {
      MenuComponent
    },
  })
  export default class App extends Vue {

    
  }
</script>

<style>

</style>
