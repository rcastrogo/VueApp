<template>
  <div class="w3-container w3-margin-bottom">
    <div class="w3-container w3-margin-bottom">
      <h1>Usuarios</h1>
      <p>Relación de usuarios</p>

      <p v-if="!loaded"><em>Cargando...</em></p>

      <TableHeaderComponent :tick="tick" :pagination="paginationInfo" @onAction="doAction($event)"></TableHeaderComponent>
      <table v-if="usuarios" class="w3-table-all">
        <thead>
          <tr @click="doSort($event)">
            <th style="width:1%;"></th>
            <th class="w3-hover-gray sorteable">Id</th>
            <th class="w3-hover-gray sorteable">Nif</th>
            <th class="w3-hover-gray sorteable">Nombre</th>
            <th class="w3-hover-gray sorteable">Descripción</th>
            <th class="w3-hover-gray sorteable">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(usuario, index) in paginationInfo.visibleItems" :key="usuario._id" :id="'row-' + usuario._id">
            <td class="w3-border-right">
              <input type="checkbox" :checked="usuario.__checked" @click="doAction({ name : 'check-item', data : index})" />
            </td>
            <td><a href="#" @click.prevent="doAction({ name : 'edit-row', data : usuario._id })">{{ usuario._id }}</a></td>
            <td>{{ usuario._nif }}</td>
            <td>{{ usuario._nombre }}</td>
            <td>{{ usuario._descripcion }}</td>
            <td>
              {{ usuario._fechaDeAlta }}
              <button title="Añadir a favoritos" class="fa fa-star" style="float:right" @click="doAddToFavorites($event)"></button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <form id="usuario-edit-dialog" class="" style="display:none">
        <label for="txt-id">Id</label>
        <input id="txt-id" type="text" :value="current._id" class="w3-input w3-border w3-round" readonly /><br />
        <label for="txt-nif">Nif</label>
        <input id="txt-nif" type="text" :value="current._nif" class="w3-input w3-border w3-round" /><br />

        <label for="txt-nombre">Marca</label>
        <input id="txt-nombre" type="text" :value="current._nombre" class="w3-input w3-border w3-round" /><br />
        <label for="txt-descripcion">Modelo</label>
        <input id="txt-descripcion" type="text" :value="current._descripcion" class="w3-input w3-border w3-round" /><br />
    </form>

  </div>
</template>

<script lang="ts">

  import { utils, Paginator, DialogHelper } from '@/extensions/extensions';
  import { Usuario } from '@/models/index';
  import { UsuarioService } from '@/services/api/index';
  import { Component, Vue } from 'vue-property-decorator';

  import TableHeaderComponent from '@/components/table-header.component.vue'

  const ROWS_PER_PAGE = 5;
  
  @Component({
    components: {
      TableHeaderComponent
    }
  })
  export default class UsuarioPage extends Vue {
  
    
    private loaded = false;

    public tick = 0;
    public usuarios: Usuario[];
    public current: Usuario;
    public paginationInfo: PaginationInfo;
    private apiService: UsuarioService;

    created() {
      this.init();
    }

    mounted() {
      this.loadData();
    }

    init() {
      this.current = { _id : 0, _nif : '', _nombre : '', _descripcion : '', _fechaDeAlta : ''};
      this.usuarios = [];
      this.paginationInfo = Paginator.paginate(this.usuarios, 1, ROWS_PER_PAGE, '');
      this.paginationInfo.title = 'Vehículos: Cargando datos...';
      this.apiService = new UsuarioService();
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
            this.usuarios = data.orderBy(this._sortBy);
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
      this.paginationInfo = Paginator.paginate(this.usuarios, __page, ROWS_PER_PAGE, '');
      this.syncTitle();
    }

    syncTitle() {
      let __total      = this.paginationInfo.totalItems
      let __selected   = this.paginationInfo.getChecked().length;
      let __template   = 'Usuarios: {0} elementos'.format(__total);
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

    goToPageOf(target: Usuario) {
      let __index = this.usuarios.indexOf(target);
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
                     '_nif',
                     '_nombre',
                     '_descripcion',
                     '_fechaDeAlta'][mouseEvent.target.cellIndex - 1];
      if (this._sortBy && this._sortBy == __field) {
        this._desc = !this._desc;
      } else {
        this._desc = false;
      }
      this._sortBy = __field;
      this.usuarios = this.usuarios.sortBy(__field, this._desc);
      this.goToPage('first');
    }

    doAddToFavorites(sender: HTMLButtonElement) { 
      console.log('Current -> Id : {_id}, Nif : {_nif}'.merge(this.current));
      console.log(utils.isNumber(5));
      console.log(this.usuarios.select('_id'));
      console.log('Add to favorites {0}, {1}'.format(1, 2));
    }


    // ============================================================================================
    // Borrado de elementos
    // ============================================================================================
    private delete() {
      this.paginationInfo.visibleItems.reverse();
      let __checkedItems = this.paginationInfo.getChecked();

      if(__checkedItems.length == 0) return;

      let __target = <Usuario>__checkedItems[0].item;

      let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                    .setTitle('Borrado de usuarios')
                                    .setBody ('¿Está seguro de eliminar el usuario seleccionado?')
                                    .show((dlg) => {
                                      this.apiService
                                          .delete(__target._id)
                                          .then( () => {
                                            this.usuarios.remove(__target);
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

      this._dialog = this._dialog || <HTMLInputElement>utils.$('usuario-edit-dialog');
      this.current = { _id: 0, _nif: '', _nombre: '', _descripcion: '', _fechaDeAlta: '' };
      this.syncDataBind();

      let __dlg = new DialogHelper().getDialogWrapper('dialog-container')
                                    .setTitle('Nuevo usuarios')
                                    .setBody(this._dialog)
                                    .disableClickOutside()
                                    .show((dlg) => {
  
                                      let __payload = {
                                        _id          : 0,
                                        _nif         : (<HTMLInputElement>utils.$('txt-nif')).value,
                                        _nombre      : (<HTMLInputElement>utils.$('txt-nombre')).value,
                                        _descripcion : (<HTMLInputElement>utils.$('txt-descripcion')).value,
                                        _fechaDeAlta : ''
                                      };

                                      this.apiService
                                          .post(__payload)
                                          .then( ({ data }) => {
                                            this.current = data;
                                            this.usuarios.push(data);
                                            this.paginationInfo.visibleItems.push(data)
                                            this._dialog.style.display = 'none';
                                            dlg.close();                                        
                                            this.usuarios = this.usuarios.sortBy(this._sortBy, this._desc);
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
    private edit(target: Usuario) {

      this._dialog = this._dialog || <HTMLInputElement>utils.$('usuario-edit-dialog');
      this.current = target;
      this.syncDataBind();

      let __dlg = new DialogHelper().getDialogWrapper('dialog-container')        
                                    .setTitle('Edición de usuarios')
                                    .setBody(this._dialog)
                                    .disableClickOutside()
                                    .show((dlg) => {
 
                                      let __payload = {
                                        _id          : ~~(<HTMLInputElement>utils.$('txt-id')).value,
                                        _nif         : (<HTMLInputElement>utils.$('txt-nif')).value,
                                        _nombre      : (<HTMLInputElement>utils.$('txt-nombre')).value,
                                        _descripcion : (<HTMLInputElement>utils.$('txt-descripcion')).value,
                                        _fechaDeAlta : ''
                                      };

                                      this.apiService
                                          .put(__payload)
                                          .then( ({ data }) => {
                                            this.current._nif = data._nif;
                                            this.current._nombre = data._nombre;
                                            this.current._descripcion = data._descripcion;
                                            this._dialog.style.display = 'none';
                                            this.syncDataBind();
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
        let __target = this.usuarios.where({ _id : __id })[0];
        return this.edit(__target);
      }
      // =========================================================
      // Buscar
      // =========================================================
      if (value.name === 'search'){
        if (value.data) {
          this.usuarios = this.usuarios.where( v => v._nombre
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