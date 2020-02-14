
import axios from "axios"

export class UsuarioService {

  private _url = '{0}/api/v1/usuarios';

  public getAll() {
    return axios.get('assets/json/usuarios.json'); 
  }

}
