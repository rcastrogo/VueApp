
import axios from "axios"
import {Usuario} from "@/models/index";

export class UsuarioService {

  private _url = '{0}/api/v1/usuarios';

  public getAll() {
    return axios.get('assets/json/usuarios.json'); 
  }

  public delete(id: Number) {
    return axios.delete('{0}/{1}'.format(this._url, id))
  }

  public post(target: Usuario) {  
    return axios.post(
      this._url,
      {
        Id          : target._id,
        Nif         : target._nif,
        Nombre      : target._nombre,
        Descripcion : target._descripcion
      }); //, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public put(target: Usuario) {
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
