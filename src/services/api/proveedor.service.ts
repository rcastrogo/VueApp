
import axios from "axios";

export class ProveedorService {

  private _url = '{0}/api/v1/proveedores';

  public getAll() {
    return axios.get('assets/json/proveedores.json'); 
  }
  
}
