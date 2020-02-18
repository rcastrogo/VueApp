<template>
  <div class="w3-container w3-margin-bottom w3-center">
    <h1>Contador</h1>
    <div class="w3-card-4 w3-center" style="width:45%; margin:0 auto;">
      <img src="https://www.w3schools.com/w3css/img_snowtops.jpg" alt="Alps" style="width:100%">
      <h1>{{currentCount}}</h1>
      <button class="w3-button w3-dark-grey" style="width:50%" @click="subtract()">-</button>
      <button class="w3-button w3-dark-grey" style="width:50%" @click="add()">+</button>
      <p class="w3-margin-bottom"></p>
    </div>
  </div>
</template>

<script lang="ts">

  import { Component, Vue } from 'vue-property-decorator';
  import { DbWrapperService } from '@/services/dbWrapper.service';

  @Component
  export default class CounterPage extends Vue {

    currentCount: number = 0;
    db: DbWrapperService;
   
    created() {
      this.db = new DbWrapperService('app.db');
      this.db
          .openDb()
          .then(this.loadCounter);
    }

    public add(){
      this.currentCount++; 
      this.saveCounter();
    }

    public subtract(){
      if(this.currentCount < 1) return;
      this.currentCount--;
      this.saveCounter();
    }

    private saveCounter() {
      this.db.save("params", 
                   { key   : 'counter',
                     value : this.currentCount
                   });
    }

    private loadCounter() {
      this.db
          .readOne('params', 'counter')
          .then((result: any) => {
            this.currentCount = result.value || 0;;
          });
    }

  }

</script>

<style>

</style>