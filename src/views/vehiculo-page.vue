<template>
  <div class="w3-container w3-margin-bottom">
    <div class="w3-container w3-margin-bottom">
        <h1>Vehículos</h1>
        <p>Relación de vehículos</p>

        <p v-if="!visibleItems"><em>Cargando...</em></p>

        <!--<app-table-header [pagination]="paginationInfo" (onAction)="doAction($event)"></app-table-header>-->
        <table v-if="visibleItems" class="w3-table-all">
            <thead>
                <tr @click="doSort($event)">
                    <th style="width:1%;"></th>
                    <th class="w3-hover-gray sorteable">Id</th>
                    <th class="w3-hover-gray sorteable">Matrícula</th>
                    <th class="w3-hover-gray sorteable">Marca</th>
                    <th class="w3-hover-gray sorteable">Modelo</th>
                    <th class="w3-hover-gray sorteable">Fecha</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="vehiculo in visibleItems" :key="vehiculo._id" :id="'row-' + vehiculo._id">
                    <td class="w3-border-right">
                        <input type="checkbox" @click="doAction({ name : 'check-item', data : i})" />
                    </td>
                    <td><a @click="doAction({ name : 'edit-row', data : vehiculo._id })">{{ vehiculo._id }}</a></td>
                    <td>{{ vehiculo._matricula }}</td>
                    <td>{{ vehiculo._marca }}</td>
                    <td>{{ vehiculo._modelo }}</td>
                    <td>
                        {{ vehiculo._fechaDeAlta }}
                        <button title="Añadir a favoritos" class="fa fa-star" style="float:right" @click="doAddToFavorites($event)"></button>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>

    <form id="vehiculo-edit-dialog" class="" style="display:none">
        <label for="txt-id">Id</label>
        <input id="txt-id" type="text" class="w3-input w3-border w3-round" readonly /><br />
        <label for="txt-matricula">Matrícula</label>
        <input id="txt-matricula" type="text" class="w3-input w3-border w3-round" /><br />

        <label for="txt-marca">Marca</label>
        <input id="txt-marca" type="text" class="w3-input w3-border w3-round" /><br />
        <label for="txt-modelo">Modelo</label>
        <input id="txt-modelo" type="text" class="w3-input w3-border w3-round" /><br />
    </form>

  </div>
</template>

<script lang="ts">

  import { Vehiculo } from '@/models/index';
  import { VehiculoService } from '@/services/api/index';
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class VehiculoPage extends Vue {
  
    public visibleItems: Vehiculo[];
    private apiService: VehiculoService;

    constructor() {
      super();
      this.visibleItems = [];
      this.apiService = new VehiculoService();
    }

    mounted() {
      this.loadData();
    }

    // ==========================================================================================
    // Carga de datos
    // ==========================================================================================
    loadData() {
      this.apiService
          .getAll()
          .then( ({data}) => {
            this._sortBy = '_matricula';
            this.visibleItems = data.orderBy(this._sortBy);
            //this.goToPage('first');
          });
    }

    // ============================================================================================
    // Ordenación
    // ============================================================================================
    private _sortBy = '';
    private _desc = false;
    doSort(mouseEvent) {
      let __field = ['_id',
                     '_matricula',
                     '_marca',
                     '_modelo',
                     '_fechaDeAlta'][mouseEvent.target.cellIndex - 1];
      if (this._sortBy && this._sortBy == __field) {
        this._desc = !this._desc;
      } else {
        this._desc = false;
      }
      this._sortBy = __field;
      this.visibleItems = this.visibleItems.sortBy(__field, this._desc);
      //this.goToPage('first');
    }

    doAddToFavorites(sender: HTMLButtonElement) { 
      //console.log('Current -> Id : {_id}, Matrícula : {_matricula}'.merge(this.current));
      //console.log(utils.isNumber(5));
      //console.log(this.vehiculos.select('_id'));
      //console.log('Add to favorites {0}, {1}'.format(1, 2));
    }


  }
</script>

<style>

</style>