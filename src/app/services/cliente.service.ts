import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormControl, ɵFormGroupRawValue, ɵTypedOrUntyped } from "@angular/forms";
import { environment } from 'src/environments/environment';
import { Reporte } from '../models/reporte';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }


  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post(environment.URL_APP + "/persona/registroCliente", cliente, { headers: this.httpHeaders })
  }


  getClientesAll(): Observable<Cliente[]> {
    return this.http.get(environment.URL_APP + "/persona/allClientes", {headers: this.httpHeaders}).pipe(map(Response => Response as Cliente[]))
  }

  putCliente(evento: Cliente): Observable<Cliente> {
    return this.http.put(environment.URL_APP + "/persona/updateCliente", evento, {headers: this.httpHeaders})
  }

 

}
