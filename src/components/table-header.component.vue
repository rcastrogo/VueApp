<template>

  <div class="w3-bar w3-border-top w3-border-left w3-border-right" :data-tick="tick">

    <span class="w3-left" style="padding:6px 0 4px 8px;" header-title>{{pagination.title}}</span>
    <div>
      <button class="w3-button w3-xlarge w3-right fa fa-plus w3-border-left" style="padding: 7px 4px;" title="Insertar" @click="onAction({ name : 'new', data : {} })"></button>
      <button class="w3-button w3-xlarge w3-right fa fa-trash w3-border-left" style="padding: 7px 4px;" title="Eliminar" @click="onAction({ name : 'delete', data : {} })"></button>
      <button class="w3-button w3-xlarge w3-right fa fa-edit w3-border-left" style="padding: 9px 4px 5px 4px;" title="Editar" @click="onAction({ name : 'edit', data : {} })"></button>

      <button @click="onAction({ name : 'last', data : {} })" class="w3-button w3-right w3-border-left" style="padding: 8px;">&#10095;&#10095;</button>
      <button @click="onAction({ name : 'next', data : {} })" class="w3-button w3-right w3-border-left" style="padding: 8px;">&#10095;</button>
      <input class="w3-right w3-center" style="width: 3em;padding:8px; border:none" :value="pagination.currentPage" @blur="goToPage($event.target)" @keyup.enter="goToPage($event.target)" />
      <button @click="onAction({ name : 'previous', data : {} })" class="w3-button w3-right w3-border-left w3-border-right" style="padding: 8px;">&#10094;</button>
      <button @click="onAction({ name : 'first', data : {} })" class="w3-button w3-right w3-border-left" style="padding: 8px;">&#10094;&#10094;</button>
    </div>
 
    <div class="" style="margin:0; padding:0" header-search>
      <input type="text" style="padding:8px; border:none" placeholder="Buscar.." @blur="search($event.target)" @keyup.enter="search($event.target)">
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class TableHeaderComponent extends Vue {
  
  @Prop()
  pagination: PaginationInfo;

  @Prop()
  tick: string;

  public mounted() {

  }

  @Emit('onAction')
  public onAction(action: { name: string, data: any }) {
    return action;
  }

  public goToPage(sender: HTMLInputElement) {
    console.log(sender.value);
    let __page = sender.value;
    this.onAction( { name : 'page', data : __page});
  }

  public search(sender: HTMLInputElement) {
    this.onAction( { name : 'search', data : sender.value});  
  }

}
</script>

<style scoped>
  [header-search]{ float:right; }
  @media only screen and (max-width: 740px) {
    [header-search] { display: inline-block; width:100%; float:none; border-top:solid 1px silver}
    [header-search] input{ width:100%;  }
  }
  @media only screen and (max-width: 360px) {
    [header-title]{ display: inline-block; width:100%; border-bottom:solid 1px silver }
  }
</style>
