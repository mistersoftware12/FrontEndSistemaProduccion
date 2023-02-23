import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormControl, ɵFormGroupRawValue, ɵTypedOrUntyped} from "@angular/forms";
import {map, Observable} from "rxjs";;
import {PersonaUsuario} from "../models/personaUsuario";
import { Usuario } from '../models/persona';

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


  /////////////////////////////////

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post(environment.URL_APP + "/persona/registroUsuario", usuario, { headers: this.httpHeaders })
  }

  putUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put(environment.URL_APP + "/persona/updateUsuario", usuario, {headers: this.httpHeaders})
  }
 
  
}
