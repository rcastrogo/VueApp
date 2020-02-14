<template>
  <div class="w3-container w3-margin-bottom w3-center">
    <h1>Página principal</h1>
    <p>Bienvenido a la página principal de Vue App!!!</p>
    <p class="w3-container w3-center">
      <img src="https://vuejs.org/images/logo.png" alt="Car" style="width:50%"><br/>
      <b>Vue JS</b>
    </p>
  </div>
</template>

<script lang="ts">

  import { Component, Vue } from 'vue-property-decorator';

  @Component
    export default class HomePage extends Vue {


  }
</script>

<style>

</style>