
import axios from "axios";
import {Proveedor} from "@/models/index";

export class ProveedorService {

  private _url = '{0}/api/v1/proveedores';

  public getAll() {
    return axios.get('assets/json/proveedores.json'); 
  }
  
  public delete(id: Number) {
    return axios.delete('{0}/{1}'.format(this._url, id))
  }

  public post(target: Proveedor) {  
    return axios.post(
      this._url,
      {
        Id          : target._id,
        Nif         : target._nif,
        Nombre      : target._nombre,
        Descripcion : target._descripcion
      }); //, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public put(target: Proveedor) {
    return axios.put(
      this._url,
      {
        Id          : target._id,
        Nif         : target._nif,
        Nombre      : target._nombre,
        Descripcion : target._descripcion
      }); //, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
}
