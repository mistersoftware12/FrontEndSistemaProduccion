import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Catalogo } from '../models/catalogo';


@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  

  createCatalogo(catalogo: Catalogo): Observable<Catalogo> {
    return this.http.post(environment.URL_APP + "/catalogo/registrarCatalogo", catalogo, { headers: this.httpHeaders })
  }

  getCatalogoAll(): Observable<Catalogo[]> {
    return this.http.get(environment.URL_APP + "/catalogo/allCatalogo", {headers: this.httpHeaders}).pipe(map(Response => Response as Catalogo[]))
  }

  putCatalogo(catalogo: Catalogo): Observable<Catalogo> {
    return this.http.put(environment.URL_APP + "/catalogo/updateCatalogo", catalogo, {headers: this.httpHeaders})
  }
 

}
