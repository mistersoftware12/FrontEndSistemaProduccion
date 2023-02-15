import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormControl, ɵFormGroupRawValue, ɵTypedOrUntyped} from "@angular/forms";
import {map, Observable} from "rxjs";
import {PersonaCliente} from "../models/personaCliente";
import {PersonaUsuario} from "../models/personaUsuario";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }


  saveUsuario(personaRequest: ɵTypedOrUntyped<{ apellidos: FormControl<String | null>; clave: FormControl<String | null>; idRol: FormControl<String | null>; cedula: FormControl<String | null>; telefono: FormControl<String | null>; email: FormControl<String | null>; nombres: FormControl<String | null> }, ɵFormGroupRawValue<{ apellidos: FormControl<String | null>; clave: FormControl<String | null>; idRol: FormControl<Number | null>; cedula: FormControl<String | null>; telefono: FormControl<String | null>; email: FormControl<String | null>; nombres: FormControl<String | null> }>, any>): Observable<PersonaUsuario> {
    console.log(personaRequest)
    return this.http.post<PersonaUsuario>(this.urlEndPoint + "/persona/registroUsuario", personaRequest, { headers: this.httpHeaders })
  }

  updateUsuario(personaRequest: ɵTypedOrUntyped<{ apellidos: FormControl<String | null>; clave: FormControl<String | null>; idRol: FormControl<Number | null>; cedula: FormControl<String | null>; id: FormControl<Number | null>; telefono: FormControl<String | null>; email: FormControl<String | null>; nombres: FormControl<String | null> }, ɵFormGroupRawValue<{ apellidos: FormControl<String | null>; clave: FormControl<String | null>; idRol: FormControl<Number | null>; cedula: FormControl<String | null>; id: FormControl<Number | null>; telefono: FormControl<String | null>; email: FormControl<String | null>; nombres: FormControl<String | null> }>, any>): Observable<PersonaUsuario> {
    console.log(personaRequest)
    return this.http.put<PersonaUsuario>(this.urlEndPoint + "/persona/updateUsuario", personaRequest, { headers: this.httpHeaders })
  }

  getAllUsuarios(): Observable<PersonaUsuario[]> {
    return this.http.get(this.urlEndPoint + "/persona/allUsuarios", { headers: this.httpHeaders }).pipe(map(Response => Response as PersonaUsuario[]))
  }
}
