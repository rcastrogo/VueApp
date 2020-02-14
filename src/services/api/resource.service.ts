
import axios from "axios"

export class ResourceService {

  private _url = '';

  constructor(baseUrl: string) {
    this._url = baseUrl;
  }
  
  public getResource(resource: string) {
    return axios.get(this._url + resource); 
  }

}
