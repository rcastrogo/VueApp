
import axios from "axios";
import {Vehiculo} from "@/models/index";

export class VehiculoService {

  private _url = '{0}/api/v1/vehiculos';

  public getAll() {
    return axios.get('assets/json/vehiculos.json'); 
  }

  public delete(id: Number) {
    return axios.delete('{0}/{1}'.format(this._url, id))
  }

  public post(target: Vehiculo) {  
    return axios.post(
      this._url,
      {
        Id: target._id,
        Matricula: target._matricula,
        Marca: target._marca,
        Modelo: target._modelo
      }); //, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public put(target: Vehiculo) {
    return axios.put(
      this._url,
      {
        Id: target._id,
        Matricula: target._matricula,
        Marca: target._marca,
        Modelo: target._modelo
      }); //, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

}
