<template>
  <div class="w3-container w3-margin-bottom">
    <div class="w3-container w3-margin-bottom">
        <h1>Vehículos</h1>
        <p>Relación de vehículos</p>

        <p v-if="!loaded"><em>Cargando...</em></p>

        <TableHeaderComponent :tick="tick" :pagination="paginationInfo" @onAction="doAction($event)"></TableHeaderComponent>
        <table v-if="vehiculos" class="w3-table-all">
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
                <tr v-for="(vehiculo, index) in paginationInfo.visibleItems" :key="vehiculo._id" :id="'row-' + vehiculo._id">
                    <td class="w3-border-right">
                        <input type="checkbox" :checked="vehiculo.__checked" @click="doAction({ name : 'check-item', data : index})" />
                    </td>
                    <td><a href="#" @click.prevent="doAction({ name : 'edit-row', data : vehiculo._id })">{{ vehiculo._id }}</a></td>
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
        <input id="txt-id" type="text" :value="current._id" class="w3-input w3-border w3-round" readonly /><br />
        <label for="txt-matricula">Matrícula</label>
        <input id="txt-matricula" type="text" :value="current._matricula" class="w3-input w3-border w3-round" /><br />

        <label for="txt-marca">Marca</label>
        <input id="txt-marca" type="text" :value="current._marca" class="w3-input w3-border w3-round" /><br />
        <label for="txt-modelo">Modelo</label>
        <input id="txt-modelo" type="text" :value="current._modelo" class="w3-input w3-border w3-round" /><br />
    </form>

  </div>
</template>

<script lang="ts">

  import { utils, Paginator, DialogHelper } from '@/extensions/extensions';
  import { Vehiculo } from '@/models/index';
  import { VehiculoService } from '@/services/api/index';
  import { Component, Vue } from 'vue-property-decorator';

  import TableHeaderComponent from '@/components/table-header.component.vue'

  const ROWS_PER_PAGE = 5;

  @Component({
    components: {
      TableHeaderComponent
    }
  })
  export default class VehiculoPage extends Vue {

    private loaded = false;

    public tick = 0;
    public vehiculos: Vehiculo[];
    public current: Vehiculo;
    public paginationInfo: PaginationInfo;
    private apiService: VehiculoService;

    created() {
      this.init();
    }

    mounted() {
      this.loadData();
    }

    init() {
      this.current = { _id : 0, _matricula : '', _marca : '', _modelo : '', _fechaDeAlta : ''};
      this.vehiculos = [];
      this.paginationInfo = Paginator.paginate(this.vehiculos, 1, ROWS_PER_PAGE, '');
      this.paginationInfo.title = 'Vehículos: Cargando datos...';
      this.apiService = new VehiculoService();
    }

    // ==========================================================================================
    // Carga de datos
    // ==========================================================================================
    loadData() {
      this.apiService
          .getAll()
          .then( ({data}) => {
            this.loaded = true;
            this._sortBy = '_id';
            this.vehiculos = data.orderBy(this._sortBy);
            this.goToPage('first');
          });
    }

    // ============================================================================================
    // Paginación
    // ============================================================================================
    goToPage(page: string) {
      var __page = ~~page;
      if (page === 'current')  __page = this.paginationInfo.currentPage;
      if (page === 'first')    __page = 1;
      if (page === 'previous') __page = this.paginationInfo.currentPage - 1;
      if (page === 'next')     __page = this.paginationInfo.currentPage + 1;
      if (page === 'last')     __page = this.paginationInfo.totalPages;
      this.paginationInfo = Paginator.paginate(this.vehiculos, __page, ROWS_PER_PAGE, '');
      this.syncTitle();
    }

    syncTitle() {
      let __total      = this.paginationInfo.totalItems
      let __selected   = this.paginationInfo.getChecked().length;
      let __template   = 'Vehículos: {0} elementos'.format(__total);
      let __template_s = ' ({0} seleccionados)'.format(__selected);
      if (__selected) {
        this.paginationInfo.title = __template + __template_s;
      } else {
        this.paginationInfo.title = __template;
      }
      this.syncDataBind();
    }

    syncDataBind() {
      this.tick++;
    }

    goToPageOf(target: Vehiculo) {
      let __index = this.vehiculos.indexOf(target);
      if (__index > -1) {
        let __page = Math.floor(__index / this.paginationInfo.pageSize);
        this.goToPage((__page + 1).toString());
      }
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
      this.vehiculos = this.vehiculos.sortBy(__field, this._desc);
      this.goToPage('first');
    }

    doAddToFavorites(sender: HTMLButtonElement) { 
      console.log('Current -> Id : {_id}, Matrícula : {_matricula}'.merge(this.current));
      console.log(utils.isNumber(5));
      console.log(this.vehiculos.select('_id'));
      console.log('Add to favorites {0}, {1}'.format(1, 2));
    }


    // ============================================================================================
    // Borrado de elementos
    // ============================================================================================
    private delete() {
      this.paginationInfo.visibleItems.reverse();
      let __checkedItems = this.paginationInfo.getChecked();

      if(__checkedItems.length == 0) return;

      let __target = <Vehiculo>__checkedItems[0].item;

      let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                    .setTitle('Borrado de vehículos')
                                    .setBody ('¿Está seguro de eliminar el vehículo seleccionado?')
                                    .show((dlg) => {
                                      this.apiService
                                          .delete(__target._id)
                                          .then( () => {
                                            this.vehiculos.remove(__target);
                                            this.goToPage('current');
                                          },
                                          error => this.showError(error)
                                      );
                                      dlg.close();
                                    });
    };

    // ============================================================================================
    // Inserción de elementos
    // ============================================================================================
    private _dialog: HTMLElement;
    private insert() {

      this._dialog = this._dialog || <HTMLInputElement>utils.$('vehiculo-edit-dialog');
      this.current = { _id: 0, _matricula: '', _marca: '', _modelo: '', _fechaDeAlta: '' };
      this.syncDataBind();

      let __dlg = new DialogHelper().getDialogWrapper('dialog-container')
                                    .setTitle('Nuevo vehículo')
                                    .setBody(this._dialog)
                                    .disableClickOutside()
                                    .show((dlg) => {
  
                                      let __payload = {
                                        _id          : 0,
                                        _matricula   : (<HTMLInputElement>utils.$('txt-matricula')).value,
                                        _marca       : (<HTMLInputElement>utils.$('txt-marca')).value,
                                        _modelo      : (<HTMLInputElement>utils.$('txt-modelo')).value,
                                        _fechaDeAlta : ''
                                      };

                                      this.apiService
                                          .post(__payload)
                                          .then( ({ data }) => {
                                            this.current = data;
                                            this.vehiculos.push(data);
                                            this.paginationInfo.visibleItems.push(data)
                                            this._dialog.style.display = 'none';
                                            dlg.close();                                        
                                            this.vehiculos = this.vehiculos.sortBy(this._sortBy, this._desc);
                                            this.goToPageOf(data);
                                          },
                                          error => this.showError(error)
                                          );
                                    });
    
      this._dialog.style.display = 'block';
    }

    // ============================================================================================
    // Edición de elementos
    // ============================================================================================
    private edit(target: Vehiculo) {

      this._dialog = this._dialog || <HTMLInputElement>utils.$('vehiculo-edit-dialog');
      this.current = target;
      this.syncDataBind();

      let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                    .setTitle('Edición de vehículos')
                                    .setBody(this._dialog)
                                    .disableClickOutside()
                                    .show((dlg) => {
 
                                      let __payload = {
                                        _id          : ~~(<HTMLInputElement>utils.$('txt-id')).value,
                                        _matricula   : (<HTMLInputElement>utils.$('txt-matricula')).value,
                                        _marca       : (<HTMLInputElement>utils.$('txt-marca')).value,
                                        _modelo      : (<HTMLInputElement>utils.$('txt-modelo')).value,
                                        _fechaDeAlta : ''
                                      };

                                      this.apiService
                                          .put(__payload)
                                          .then( ({ data }) => {
                                            this.current._matricula = data._matricula;
                                            this.current._marca = data._marca;
                                            this.current._modelo = data._modelo;
                                            this._dialog.style.display = 'none';
                                            dlg.close();                                          
                                          },
                                            error => this.showError(error)
                                          );
                                    });
      this._dialog.style.display = 'block';

    }

    // ===========================================================
    // Acciones sobre los elementos, paginación, etc...
    // ===========================================================
    doAction(value: { name: string, data: any }) {   
      // =========================================================
      // Paginación
      // =========================================================
      if (value.name === 'page') return this.goToPage(value.data);
      if (value.name === 'first'    ||
          value.name === 'previous' ||
          value.name === 'next'     ||
          value.name === 'last') return this.goToPage(value.name);
      // =========================================================
      // Check/Uncheck
      // =========================================================
      if (value.name === 'check-item') {
        let target = this.paginationInfo.visibleItems[value.data];
        target.__checked = !target.__checked;
        this.syncTitle();
      }
      // =========================================================
      // Borrado
      // =========================================================
      if (value.name === 'delete') return this.delete();
      // =========================================================
      // Nuevo
      // =========================================================
      if (value.name === 'new') return this.insert();
      // =========================================================
      // Edición (Seleccionado)
      // =========================================================
      if (value.name === 'edit'){
        let __checkedItems = this.paginationInfo.getChecked();
        if(__checkedItems.length == 0) return;
        return this.edit(__checkedItems[0].item);
      }
      // =========================================================
      // Edición (link)
      // =========================================================
      if (value.name === 'edit-row'){
        let __id = ~~value.data;
        let __target = this.vehiculos.where({ _id : __id })[0];
        return this.edit(__target);
      }
      // =========================================================
      // Buscar
      // =========================================================
      if (value.name === 'search'){
        if (value.data) {
          this.vehiculos = this.vehiculos.where( v => v._marca
                                                       .toLowerCase()
                                                       .includes(value.data.toLowerCase()));
          return this.goToPage('first');
        }
        return this.loadData();
      }

    }

    showError(error: any) {

      let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                    .setTitle('Error')
                                    .setBody (error.message)
                                    .show();
      console.error(error); 
    }

  }
</script>

<style>

</style>