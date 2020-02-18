

export class DbWrapperService{

  private _name: string;

  db: IDBDatabase;

  constructor(name: string) {
    this._name = name;
  }

  async openDb(): Promise<unknown> {
    return new Promise( (resolve, reject) => {

      let request = window.indexedDB.open(this._name, 1);

	    request.onsuccess = (e: any) => {
        this.db = e.target.result;
		    resolve(this.db);
	    };

      request.onerror = e => {  
        reject('Error');
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
    return new Promise( (resolve, reject) => {
      var __items = [];
      this.db
          .transaction(name, "readonly")
          .objectStore(name)
          .openCursor(IDBKeyRange.lowerBound(0))
          .onsuccess = (event: Event) => {
            var __cursor: IDBCursorWithValue = (<IDBRequest>event.target).result;
            if(__cursor) {
              __items.push(__cursor.value);
              __cursor.continue();
            } else {
              resolve(__items);
            }
          };
    });
  }

  async save(store: string, value: any) {
    return new Promise( (resolve) => {
      this.db
          .transaction(store, "readwrite")
          .objectStore(store)
          .put(value)
          .onsuccess = () => {
            resolve(value);
          };
    });
  }

  async delete(store: string, key: any) {
    return new Promise( (resolve) => {
      this.db
          .transaction(store, "readwrite")
          .objectStore(store)
          .delete(key)
          .onsuccess = () => {
            resolve();
          };
    });
  }

  async readOne(store: string, key: any) {
    return new Promise( (resolve) => {
      this.db
          .transaction(store, "readwrite")
          .objectStore(store)
          .get(key)
          .onsuccess = (event: Event) => {
            resolve((<IDBRequest>event.target).result);
          }         
    });
  }

}

