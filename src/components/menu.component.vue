<template>

  <div class="w3-bar w3-black">
    
    <router-link to="/" class="w3-bar-item w3-button">Inicio</router-link>
    <router-link to="/counter" class="w3-bar-item w3-button">Contador</router-link>

    <div class="w3-dropdown-hover">
      <button class="w3-button w3-black">Datos</button>
      <div class="w3-dropdown-content w3-bar-block w3-card-4">
        <router-link v-for="item in menuItems" :key="item.name" :to="item.route" class="w3-bar-item w3-button w3-black">
          {{item.name}}
        </router-link>
      </div>
    </div>

    <router-link to="/tabbly-reports" class="w3-bar-item w3-button">Informes</router-link>
    <router-link to="/about" class="w3-bar-item w3-button w3-black w3-right">?</router-link>

  </div>


</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {

  private menuItems: any[];

  constructor(){
    super();
    this.menuItems = [ 
      { route: "/usuarios",    name : "Usuarios"} ,
      { route: "/proveedores", name : "proveedores"},
      { route: "/vehiculos",   name : "Vehículos" }
    ];
  }

}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
