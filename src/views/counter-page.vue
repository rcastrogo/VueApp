<template>
  <div class="w3-container w3-margin-bottom w3-center">
    <h1>Contador</h1>
    <div class="w3-card-4 w3-center" style="width:45%; margin:0 auto;">
      <img src="https://www.w3schools.com/w3css/img_snowtops.jpg" alt="Alps" style="width:100%">
      <h1>{{currentCount}}</h1>
      <button class="w3-button w3-block w3-dark-grey" @click="incrementCounter()">Incrementar</button>
      <p class="w3-margin-bottom"></p>
    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class CounterPage extends Vue {

    currentCount: number = 0;

    public incrementCounter(){
      this.currentCount += 1; 
    }

  }
</script>

<style>

</style>