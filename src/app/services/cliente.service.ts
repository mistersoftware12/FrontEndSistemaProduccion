import {Injectable} from '@angular/core';
import {PersonaCliente} from "../models/personaCliente";
import {map, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormControl, ɵFormGroupRawValue, ɵTypedOrUntyped} from "@angular/forms";
import {environment} from 'src/environments/environment';
import { Reporte } from '../models/reporte';

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

  saveCliente(personaRequest: ɵTypedOrUntyped<{ apellidos: FormControl<String | null>; idProvincia: FormControl<Number | null>; telefonoResponsbale: FormControl<String | null>; fechaNacimiento: FormControl<Date | null>; cedula: FormControl<String | null>; estadoCivil: FormControl<String | null>; idParroquia: FormControl<Number | null>; nombres: FormControl<String | null>; nombreResponsable: FormControl<String | null>; idBarrio: FormControl<Number | null>; genero: FormControl<String | null>; idCanton: FormControl<Number | null>; discapacidad: FormControl<boolean | null>; telefono: FormControl<String | null>; email: FormControl<String | null> }, ɵFormGroupRawValue<{ apellidos: FormControl<String | null>; idProvincia: FormControl<Number | null>; telefonoResponsbale: FormControl<String | null>; fechaNacimiento: FormControl<Date | null>; cedula: FormControl<String | null>; estadoCivil: FormControl<String | null>; idParroquia: FormControl<Number | null>; nombres: FormControl<String | null>; nombreResponsable: FormControl<String | null>; idBarrio: FormControl<Number | null>; genero: FormControl<String | null>; idCanton: FormControl<Number | null>; discapacidad: FormControl<boolean | null>; telefono: FormControl<String | null>; email: FormControl<String | null> }>, any>): Observable<PersonaCliente> {
    console.log(personaRequest)
    return this.http.post<PersonaCliente>(this.urlEndPoint + "/persona/registroCliente", personaRequest, {headers: this.httpHeaders})
  }

  updateCliente(personaRequest: ɵTypedOrUntyped<{ apellidos: FormControl<String | null>; idProvincia: FormControl<Number | null>; telefonoResponsbale: FormControl<String | null>; fechaNacimiento: FormControl<Date | null>; cedula: FormControl<String | null>; estadoCivil: FormControl<String | null>; idParroquia: FormControl<Number | null>; nombres: FormControl<String | null>; nombreResponsable: FormControl<String | null>; idBarrio: FormControl<Number | null>; genero: FormControl<String | null>; idCanton: FormControl<Number | null>; discapacidad: FormControl<boolean | null>; id: FormControl<Number | null>; telefono: FormControl<String | null>; email: FormControl<String | null> }, ɵFormGroupRawValue<{ apellidos: FormControl<String | null>; idProvincia: FormControl<Number | null>; telefonoResponsbale: FormControl<String | null>; fechaNacimiento: FormControl<Date | null>; cedula: FormControl<String | null>; estadoCivil: FormControl<String | null>; idParroquia: FormControl<Number | null>; nombres: FormControl<String | null>; nombreResponsable: FormControl<String | null>; idBarrio: FormControl<Number | null>; genero: FormControl<String | null>; idCanton: FormControl<Number | null>; discapacidad: FormControl<boolean | null>; id: FormControl<Number | null>; telefono: FormControl<String | null>; email: FormControl<String | null> }>, any>): Observable<PersonaCliente> {
    console.log(personaRequest)
    return this.http.put<PersonaCliente>(this.urlEndPoint + "/persona/updateCliente", personaRequest, {headers: this.httpHeaders})
  }

  getAllClientes(): Observable<PersonaCliente[]> {
    return this.http.get(this.urlEndPoint + "/persona/allClientes", {headers: this.httpHeaders}).pipe(map(Response => Response as PersonaCliente[]))
  }

  getReporteMensual(mes: any, anio: any): Observable<Reporte[]> {
    return this.http.get(environment.URL_APP + "/reporte/todoslosdatos/" + mes + "/" + anio, {headers: this.httpHeaders}).pipe(map(Response => Response as Reporte[]))
  }

}
