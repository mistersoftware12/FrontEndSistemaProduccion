import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente';
import { Proveedor } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }


  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post(environment.URL_APP + "/persona/registroProveedor", proveedor, { headers: this.httpHeaders })
  }


  getProveedoresAll(): Observable<Proveedor[]> {
    return this.http.get(environment.URL_APP + "/persona/allProveedores", { headers: this.httpHeaders }).pipe(map(Response => Response as Proveedor[]))
  }


  putProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put(environment.URL_APP + "/persona/updateProveedor", proveedor, { headers: this.httpHeaders })
  }


  getProveedorId(id: any): Observable<Proveedor> {
    return this.http.get(environment.URL_APP + "/persona/allproveedorcedula/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Proveedor))
}




}