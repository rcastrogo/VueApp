<template>
  <div class="w3-container w3-margin-bottom w3-center">
    <h1>Contador</h1>
    <div class="w3-card-4 w3-center" style="width:45%; margin:0 auto;">
      <img src="https://www.w3schools.com/w3css/img_snowtops.jpg" alt="Alps" style="width:100%">
      <h1>{{currentCount}}</h1>
      <button class="w3-button w3-block w3-dark-grey" @click="incrementCounter()">Incrementar</button>
      <p class="w3-margin-bottom"></p>
    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class CounterPage extends Vue {

    currentCount: number = 0;
    db:indexedDBWrapper;
   
    async created() {

      this.db = new indexedDBWrapper();
      await this.db.openDb();
      let __data: any = await this.db.readAll('params');

      this.currentCount = __data.where( { key : 'counter' })[0].value;


    }

    public incrementCounter(){
      this.currentCount += 1; 

      var __transaction = this.db.db.transaction("params", "readwrite");
      var __store       = __transaction.objectStore("params");

      __store.put({ key : 'counter', value : this.currentCount } );

    }

  }

  
  class indexedDBWrapper{

    db:IDBDatabase;

    async openDb(): Promise<unknown> {

      return new Promise( (resolve, reject) => {

        let request = window.indexedDB.open('app.db', 1);

      	request.onerror = e => {  reject('Error');  };

	      request.onsuccess = (e: any) => {
          this.db = e.target.result;
		      resolve(this.db);
	      };
	
	      request.onupgradeneeded = (e: any) => {
		      this.db = e.target.result;
          try {
            if(this.db.objectStoreNames && this.db.objectStoreNames.contains("params")) {
              this.db.deleteObjectStore("params");
            }
          }
          catch (err) {
            console.log(err);
          }
          var store = this.db.createObjectStore("params", { keyPath : "key" });       
        };
      });
    }

    async readAll(name: string): Promise<unknown>{
      return new Promise((resolve, reject) => {
        var __items = [];
        var __trans = this.db.transaction(name, "readonly");  
        __trans.oncomplete = e => {
			    resolve(__items);
		    };
        var __cursorRequest = __trans.objectStore(name)
                                     .openCursor(IDBKeyRange.lowerBound(0));
        __cursorRequest.onsuccess = (e: any) => {
          var __cursor = e.target.result;
          if(__cursor) {
            __items.push(__cursor.value);
            __cursor.continue();
          }
        };
        __cursorRequest.onerror = function(e){
          reject(e);
        };
      });
    }

  }


</script>

<style>

</style>