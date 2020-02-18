<template>
  <div class="w3-container w3-margin-bottom">
    <h1>Parámetros de configuración</h1>
    <p>Lista de valores configurables.</p>

    <div v-if="loaded">
      <div class="w3-container w3-margin-bottom">
        <TableHeaderComponent :tick="tick" :pagination="paginationInfo" @onAction="doAction($event)"></TableHeaderComponent>
        <table v-if="data" class="w3-table-all">
          <thead>
            <tr @click="doSort($event)">
              <th style="width:1%;"></th>
              <th class="w3-hover-gray sorteable" style="width:20%;">Nombre</th>
              <th class="w3-hover-gray sorteable">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(parametro, index) in paginationInfo.visibleItems" :key="parametro.key" :id="'row-' + parametro.key">
              <td class="w3-border-right">
                <input type="checkbox" :checked="parametro.__checked" @click="doAction({ name : 'check-item', data : index})" />
              </td>
              <td><a href="#" @click.prevent="doAction({ name : 'edit-row', data : parametro.key })">{{ parametro.key }}</a></td>
              <td>{{ parametro.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <form id="param-edit-dialog" class="" style="display:none">
      <label for="txt-key">Nombre</label>
      <input id="txt-key" type="text" :value="current.key" class="w3-input w3-border w3-round" /><br />
      <label for="txt-value">Valor</label>
      <input id="txt-value" type="text" :value="current.value" class="w3-input w3-border w3-round" /><br />
    </form>

  </div>
</template>

<script lang="ts">

  import { Component, Vue } from 'vue-property-decorator';
  import { DbWrapperService } from '@/services/dbWrapper.service';
  import { utils, Paginator, DialogHelper } from '@/extensions/extensions';
  import TableHeaderComponent from '@/components/table-header.component.vue'

  const ROWS_PER_PAGE = 5;

  interface Param {
    key:string;
    value:any;
  }

  @Component({
    components: {
      TableHeaderComponent
    }
  })
  export default class ParametroPage extends Vue {

    db: DbWrapperService;

    tick    = 0;
    loaded  = false;
    data: Param[] = [];
    current = { key : '', value : '' };
    paginationInfo: PaginationInfo;
    sortBy = '';
    desc   = false;

    created() {
      this.init();
      this.db = new DbWrapperService('app.db');
      this.db
          .openDb()
          .then( this.loadData );
    }

    loadData() {
      this.db
          .readAll('params')
          .then( (values: Param[]) =>{
            this.loaded = true;
            this.sortBy = 'key';
            this.data = values.orderBy(this.sortBy);
            this.goToPage('first');
          });

    }

    init() {
      this.current = { key : '', value : '' };
      this.data = [];
      this.paginationInfo = Paginator.paginate(this.data, 1, ROWS_PER_PAGE, '');
      this.paginationInfo.title = 'Parámetros: Cargando datos...';
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
      this.paginationInfo = Paginator.paginate(this.data, __page, ROWS_PER_PAGE, '');
      this.syncTitle();
    }

    syncTitle() {
      let __total      = this.paginationInfo.totalItems
      let __selected   = this.paginationInfo.getChecked().length;
      let __template   = 'Parámetros: {0} elementos'.format(__total);
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

    goToPageOf(target: any) {
      let __index = this.data.indexOf(target);
      if (__index > -1) {
        let __page = Math.floor(__index / this.paginationInfo.pageSize);
        this.goToPage((__page + 1).toString());
      }
    }

    // ============================================================================================
    // Ordenación
    // ============================================================================================
    doSort(mouseEvent) {
      let __field = ['key',
                     'value'][mouseEvent.target.cellIndex - 1];
      if (this.sortBy && this.sortBy == __field) {
        this.desc = !this.desc;
      } else {
        this.desc = false;
      }
      this.sortBy = __field;
      this.data = this.data.sortBy(__field, this.desc);
      this.goToPage('first');
    }

    // ============================================================================================
    // Borrado de elementos
    // ============================================================================================
    private delete() {
      this.paginationInfo.visibleItems.reverse();
      let __checkedItems = this.paginationInfo.getChecked();

      if(__checkedItems.length == 0) return;

      let __target = <Param>__checkedItems[0].item;
      
      new DialogHelper().getDialogWrapper('dialog-container')        
                        .setTitle('Borrado de parámetros')
                        .setBody (utils.$$('div', { 
                          className : 'w3-center',
                          innerHTML : '¿Está seguro de eliminar el parámetro seleccionado?' 
                        }))
                        .show((dlg) => {
                          this.db
                              .delete('params', __target.key)
                              .then( () => {
                                this.data.remove(__target);
                                this.goToPage('current');
                              });
                          dlg.close();
                        });
    };

    // ============================================================================================
    // Inserción de elementos
    // ============================================================================================
    private _dialog: HTMLElement;
    private insert() {

      this._dialog = this._dialog || <HTMLElement>utils.$('param-edit-dialog');
      this.current = { key: '', value: '' };
      this.syncDataBind();

      new DialogHelper().getDialogWrapper('dialog-container')
                        .setTitle('Nuevo parámetro')
                        .setBody(this._dialog)
                        .disableClickOutside()
                        .onInit( dlg => {                          
                          setTimeout(() => {
                            let container = <HTMLElement>dlg.container;
                            (<HTMLInputElement>container.querySelector('#txt-key')).focus();
                          },40);
                        })
                        .show((dlg) => {
  
                          let __payload = {
                            key   : (<HTMLInputElement>utils.$('txt-key')).value,
                            value : (<HTMLInputElement>utils.$('txt-value')).value
                          };

                          if (!__payload.key || !__payload.value) {
                            this.showError( { message : 'Faltan valores obligatorios' } );
                            return;
                          }
                          this.db
                              .save('params', __payload)
                              .then( (data: Param) => {
                                this.current = data;
                                this.data.push(data);
                                this.paginationInfo.visibleItems.push(data)
                                this.data = this.data.sortBy(this.sortBy, this.desc);                                            
                                this._dialog.style.display = 'none';
                                dlg.close();                                        
                                this.goToPageOf(data);                                            
                              }).catch( error => {
                                this.showError(error);
                              });
                        });
    
      this._dialog.style.display = 'block';
    }

    // ============================================================================================
    // Edición de elementos
    // ============================================================================================
    private edit(target: Param) {

      this._dialog = this._dialog || <HTMLElement>utils.$('param-edit-dialog');
      this.current = target;
      this.syncDataBind();

      new DialogHelper().getDialogWrapper('dialog-container')        
                        .setTitle('Edición de parámetros')
                        .setBody(this._dialog)
                        .disableClickOutside()
                        .onInit( dlg => {                          
                          setTimeout(() => {
                            let container = <HTMLElement>dlg.container;
                            (<HTMLInputElement>container.querySelector('#txt-value')).focus();
                          },40);
                        })
                        .show((dlg) => {
 
                          let __payload = {
                            key          : this.current.key,
                            value        : (<HTMLInputElement>utils.$('txt-value')).value
                          };

                          this.db
                              .save('params', __payload)
                              .then( (data: Param) => {                               
                                this.current.value = data.value;
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
        let __id = value.data;
        let __target = this.data.where({ key : __id })[0];
        return this.edit(__target);
      }
      // =========================================================
      // Buscar
      // =========================================================
      if (value.name === 'search'){
        if (value.data) {
          this.data = this.data.where( v => v.key
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