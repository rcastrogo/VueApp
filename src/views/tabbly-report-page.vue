<template>

  <div>
    
    <div class="w3-container w3-margin-bottom" id="botonera">
      <h1 class="w3-center">Tabbly Report sample</h1>
      <p class="w3-center">Informes de prueba usando Tabbly.js</p>
      <button class="w3-button w3-white w3-border" @click="listVehiculos()">Vehículos</button>
      <button class="w3-button w3-white w3-border" @click="listUsuarios()">Usuarios</button>
      <button class="w3-button w3-white w3-border" @click="listProveedores()">Proveedores</button>
      <button class="w3-button w3-white w3-border" @click="runWebWorker()">Web worker</button>
    </div>

    <div class="w3-container w3-margin-bottom">
      <div class="w3-bar w3-black">
        <button class="w3-bar-item w3-button tablink w3-dark-grey" @click="openTab($event,'tab-report')">Report</button>
        <button class="w3-bar-item w3-button tablink" @click="openTab($event, 'tab-report-txt')">Txt</button>
        <button class="w3-bar-item w3-button tablink" @click="openTab($event, 'tab-report-data')">Data</button>
        <button class="w3-bar-item w3-button tablink" @click="openTab($event, 'tab-report-log')">Log</button> 
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
        <div class="w3-container w3-round w3-border" style="max-height: 30em; overflow:auto">
          <pre class="w3-black w3-round w3-padding">{{reportFile}}</pre>
        </div>
      </div>

      <div id="tab-report-data" class="w3-container w3-border tab" style="display:none">
        <p></p>
        <div class="w3-container w3-round w3-border" style="max-height: 30em; overflow:scroll">
          <pre class="w3-black w3-round w3-padding" style="overflow:visible">{{reportData}}</pre>
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

    private _txtService: ResourceService;
    private _userApiService: UsuarioService;
    private _proveedorApiService : ProveedorService;
    private _vehiculoApiService : VehiculoService;
    private _rptService: TabblyService;

    reportFile: string = '';
    reportData:string = '';

    mounted() {
      this._txtService = new ResourceService('assets/');
      this._userApiService = new UsuarioService();
      this._proveedorApiService = new ProveedorService();
      this._vehiculoApiService = new VehiculoService();
      this._rptService = new TabblyService();
      this.initWorker();
    }

    public listUsuarios() {
    
      var __container = <HTMLDivElement>utils.$('table-container');
      var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');  
      
      this._txtService
          .getResource('tabbly-reports/usu-0001.txt')
          .then( result => {
            this.reportFile = result.data;
            return { 
              rd   : this._rptService.parse(result.data),
              data : this._userApiService.getAll()
            };             
          })
          .then( ( { rd, data } ) => {
            data.then( ({ data }) => {
              this.reportData = JSON.stringify(data, undefined, 2);
              this._rptService
                  .fromReportDefinition(rd, data, (html: string) => {       
                __container.innerHTML = html;
                __rowsContainer.innerHTML = ''
              });
            })
          })
          .catch( error => {
            console.log(error);
          });
    }

    public listProveedores() {

      var __container = <HTMLDivElement>utils.$('table-container');
      var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');  
      
      this._txtService
          .getResource('tabbly-reports/pro-0001.txt')
          .then( result => {
            this.reportFile = result.data;
            return { 
              rd   : this._rptService.parse(result.data),
              data : this._proveedorApiService.getAll()
            };             
          })
          .then( ( { rd, data } ) => {
            data.then( ({ data }) => {
              this.reportData = JSON.stringify(data, undefined, 2);
              this._rptService
                  .fromReportDefinition(rd, data, (html: string) => {       
                __container.innerHTML = html;
                __rowsContainer.innerHTML = ''
              });
            })
          })
          .catch( error => {
            console.log(error);
          });

    }

    public listVehiculos() {

      var __container = <HTMLDivElement>utils.$('table-container');
      var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');  
      
      this._txtService
          .getResource('tabbly-reports/veh-0001.txt')
          .then( result => {
            this.reportFile = result.data;
            return { 
              rd   : this._rptService.parse(result.data),
              data : this._vehiculoApiService.getAll()
            };             
          })
          .then( ( { rd, data } ) => {
            data.then( ({ data }) => {
              this.reportData = JSON.stringify(data, undefined, 2);
              this._rptService
                  .fromReportDefinition(rd, data, (html: string) => {       
                __container.innerHTML = html;
                __rowsContainer.innerHTML = ''
              });
            })
          })
          .catch( error => {
            console.log(error);
          });

    }

    private _worker: Worker;
    private initWorker() {
      let __script = './assets/web-worker-reports.worker.js?t{0}'.format(new Date().getTime());
      let __messageHandler = new MessageHandler()
      this._worker = new Worker(__script);
      this._worker.onmessage = ({data}) => {
        let __data = JSON.parse(data);
        if (__data.type && __data.type === 'report.data.ready') {
          this.reportData = JSON.stringify(__data, undefined, 2);
          return;
        }
        __messageHandler.handle(__data);
      };
    }

    public runWebWorker() {
      if (this._worker) {
        var __container = <HTMLDivElement>utils.$('table-container');
        var __rowsContainer = <HTMLDivElement>utils.$('rowsContainer');
        let __message = { action : 'load-report',
                          report : { source  : './web-worker-reports/pro-0001.js',
                                     data    : './json/proveedores.json',
                                     method  : 'get' } };
        this._worker.postMessage(__message);
        __container.innerHTML = '';
        __rowsContainer.innerHTML = '';
        this.reportData = '';
        this.reportFile = ''
      }
    }


    public openTab(event, tabName) {
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

  class MessageHandler {

    private _container: HTMLElement;
    private _progressBarContainer: HTMLElement;
    private _progressBarMessage: HTMLElement;
    private _progressBar: HTMLElement;

    constructor() {
      this._container            = <HTMLElement>utils.$('table-container');
      this._progressBarContainer = <HTMLElement>utils.$('progress-bar-container');
      this._progressBarMessage   = <HTMLElement>utils.$('progress-bar-message');
      this._progressBar          = <HTMLElement>utils.$('progress-bar');
      this._container.innerHTML  = '';
    }

    private build(e: string, o: string){
      var __e = document.createElement(e);
      if(o) __e.innerHTML = o;
      return __e;
    }

    public handle(message: any) {
      // report.content
      if(message.type === 'report.content'){
        this._container.appendChild(this.build('div', message.content)
                                        .firstChild); 
        return;  
      }
      // report.log.message
      if(message.type === 'report.log.message'){
        this._progressBarMessage.innerHTML = message.text || '';
        return;  
      }
      // report.begin
      if(message.type === 'report.begin'){
        this._container.innerHTML = '';
        this._progressBarContainer.style.display = 'block'
        this._progressBarMessage.innerHTML = '';
        this._progressBar.style.width = '0%';
        return;  
      }     
      // report.render.rows
      if(message.type === 'report.render.rows'){
        this._progressBar.style.width = '0%';
      }
      // report.render.row
      if(message.type === 'report.render.row'){
        this._progressBar.style.width = '{0}%'.format(message.value.toFixed(1));
        this._progressBar.innerHTML = message.text || '';
      }
      // report.sections.group.header
      // report.sections.group.footer
      // report.sections.detail
      // report.sections.total
      // report.sections.header
      // report.sections.group.change
      // report.render.end
      // report.end
      if(message.type === 'report.end'){
        setTimeout( () => { 
          this._progressBar.style.width = '100%';
          this._progressBarMessage.innerHTML = '';
          this._progressBarContainer.style.display = 'none'
        }, 250);
        return;  
      }
    } 
  }

</script>

<style>

</style>