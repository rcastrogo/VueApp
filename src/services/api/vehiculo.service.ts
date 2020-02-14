
import axios from "axios";

export class VehiculoService {

  private _url = '{0}/api/v1/vehiculos';

  public getAll() {
    return axios.get('assets/json/vehiculos.json'); 
  }

}
