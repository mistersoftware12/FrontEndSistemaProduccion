import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente';
import { Almacen } from '../models/almacen';
import { Sucursal } from '../models/sucursal';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  

  createAlmacen(almacen: Almacen): Observable<Almacen> {
    return this.http.post(environment.URL_APP + "/empresa/registrarAlmacen", almacen, { headers: this.httpHeaders })
  }

  createSucursal(sucursal: Sucursal): Observable<Sucursal> {
    return this.http.post(environment.URL_APP + "/empresa/registrarSucursal", sucursal, { headers: this.httpHeaders })
  }


  getSucursalAll(): Observable<Sucursal[]> {
    return this.http.get(environment.URL_APP + "/empresa/allSucursal", {headers: this.httpHeaders}).pipe(map(Response => Response as Sucursal[]))
  }

  getAlmacenAll(): Observable<Almacen[]> {
    return this.http.get(environment.URL_APP + "/empresa/allAlmacen", {headers: this.httpHeaders}).pipe(map(Response => Response as Almacen[]))
  }

  

  putSucursal(sucursal: Sucursal): Observable<Sucursal> {
    return this.http.put(environment.URL_APP + "/empresa/updateSucursal", sucursal, {headers: this.httpHeaders})
  }

  putAlmacen(almacen: Almacen): Observable<Almacen> {
    return this.http.put(environment.URL_APP + "/empresa/updateAlmacen", almacen, {headers: this.httpHeaders})
  }
 

}
