<template>

  <div>
    
    <div class="w3-container w3-margin-bottom">
      <h1>Tabbly Report sample</h1>
      <p>Informes de prueba usando Tabbly.js</p>
      <button class="w3-button w3-white w3-border" click="listVehiculos()">Vehículos</button>
      <button class="w3-button w3-white w3-border" click="listUsuarios()">Usuarios</button>
      <button class="w3-button w3-white w3-border" click="listProveedores()">Proveedores</button>
      <button class="w3-button w3-white w3-border" click="runWebWorker()">Web worker</button>
    </div>

    <div class="w3-container w3-margin-bottom">
      <div class="w3-bar w3-black">
        <button class="w3-bar-item w3-button tablink w3-dark-grey" @click="openTab(this,'tab-report')">Report</button>
        <button class="w3-bar-item w3-button tablink" @click="openTab(this, 'tab-report-txt')">Txt</button>
        <button class="w3-bar-item w3-button tablink" @click="openTab(this, 'tab-report-data')">Data</button>
        <button class="w3-bar-item w3-button tablink" @click="openTab(this, 'tab-report-log')">Log</button>
      </div>

      <div id="tab-report" class="w3-container w3-border tab">
        <p></p>
        <div id="progress-bar-container" style="display:none;">
          <div id="progress-bar-message" class="w3-center"></div>
          <div class="w3-light-grey w3-round">
            <div id="progress-bar" class="w3-container w3-green w3-center w3-round" style="width:0"></div>
          </div>
        </div>
        <div id="table-container" class="w3-container w3-margin-bottom"></div>
      </div>

      <div id="tab-report-txt" class="w3-container w3-border tab" style="display:none">
        <p></p>
        <div  class="w3-container w3-margin-bottom">
          <div class="w3-container w3-round w3-border" style="max-height: 30em; overflow:auto">
            <pre class="w3-black w3-round w3-padding">{{reportFile}}</pre>
          </div>
        </div>
      </div>

      <div id="tab-report-data" class="w3-container w3-border tab" style="display:none">
        <p></p>
        <div class="w3-container w3-margin-bottom">
          <div class="w3-container w3-round w3-border" style="max-height: 30em; overflow:auto">
            <pre class="w3-black w3-round w3-padding">{{reportData}}</pre>
          </div>
        </div>
      </div>

      <div id="tab-report-log" class="w3-container w3-border tab">
        <p></p>
        <div class="w3-container w3-margin-bottom">
          <div id="rowsContainer">
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<script lang="ts">

  import { Component, Vue } from 'vue-property-decorator';
  import { utils } from '@/extensions/extensions';
  import { TabblyService } from '@/services/tabbly.service';
  import { VehiculoService,
           UsuarioService,
           ProveedorService,
           ResourceService } from '@/services/api/index';

  @Component
  export default class TableReportsPage extends Vue {

    private _tabblyService: TabblyService;
    public reportFile: string = 'Hola';
    public reportData:string = 'mundo';

    public listUsuarios() {

      console.log('listUsuarios');

      var __container = <HTMLDivElement>utils.$('table-container');
      var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');

      // this.resourceService
      //     .getResource('tabbly-reports/usu-0001.txt')
      //     .subscribe(result => {
      //       this.reportFile = result;
      //       var __rd  = this._tabblyService.parse(result);
      //       this.usuariosApiService.getAll().subscribe(
      //         data => {
      //           this.reportData = JSON.stringify(data, undefined, 2);
      //           this._tabblyService.fromReportDefinition(__rd, data, (html: string) => {       
      //             __container.innerHTML = html;
      //             __rowsContainer.innerHTML = ''
      //           });
      //         })
      //     });

    }

    public listProveedores() {

      console.log('listProveedores');

      var __container = <HTMLDivElement>utils.$('table-container');
      var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');

      // this.resourceService
      //     .getResource('tabbly-reports/pro-0001.txt')
      //     .subscribe(result => {
      //       this.reportFile = result;
      //       var __rd  = this._tabblyService.parse(result);
      //       this.proveedoresApiService.getAll().subscribe(
      //         data => {
      //           this.reportData = JSON.stringify(data, undefined, 2);
      //           this._tabblyService.fromReportDefinition(__rd, data, (html: string) => {       
      //             __container.innerHTML     = html;
      //             __rowsContainer.innerHTML = ''
      //           });
      //         })
      //     });

    }

    public listVehiculos() {

      console.log('listVehiculos');

      var __container = <HTMLDivElement>utils.$('table-container');
      var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');
      

      // this.resourceService
      //     .getResource('tabbly-reports/veh-0001.txt')
      //     .subscribe(result => {
      //       this.reportFile = result;
      //       var __rd  = this._tabblyService.parse(result);
      //       this.vehiculosApiService.getAll().subscribe(
      //         data => {
      //           this.reportData = JSON.stringify(data, undefined, 2);
      //           this._tabblyService.fromReportDefinition(__rd, data, (html: string) => {       
      //             __container.innerHTML = html;
      //             if(__rd.context.onEndfn) __rd.context.onEndfn({ data      : data,
      //                                                             container : __rowsContainer,
      //                                                             utils     : utils });  
      //           });
      //         })
      //     });

    }

    public openTab(event, tabName) {

      console.log(event, tabName);

      var i, x, tablinks;
      x = document.getElementsByClassName("tab");
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablink");
      for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-dark-grey", "");
      }
      document.getElementById(tabName).style.display = "block";
      event.currentTarget.className += " w3-dark-grey";
    };

  }
</script>

<style>

</style>