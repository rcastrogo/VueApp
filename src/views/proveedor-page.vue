<template>
  <div class="w3-container w3-margin-bottom">
    <div class="w3-container w3-margin-bottom">
        <h1>Proveedores</h1>
        <p>Relación de proveedores</p>

        <p><em>Cargando...</em></p>

    </div>

    <form id="proveedor-edit-dialog" class="" style="display:none">
        <label for="txt-id">Id</label>
        <input id="txt-id" type="text" class="w3-input w3-border w3-round" readonly /><br />
        <label for="txt-nif">Nif</label>
        <input id="txt-nif" type="text" class="w3-input w3-border w3-round" /><br />

        <label for="txt-nombre">Marca</label>
        <input id="txt-nombre" type="text" class="w3-input w3-border w3-round" /><br />
        <label for="txt-descripcion">Modelo</label>
        <input id="txt-descripcion" type="text" class="w3-input w3-border w3-round" /><br />
    </form>

  </div>
</template>

<script lang="ts">

  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class ProveedorPage extends Vue {
  

  }
</script>

<style>

</style>