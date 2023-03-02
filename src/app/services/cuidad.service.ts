import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Cuidad } from '../models/cuidad';


@Injectable({
    providedIn: 'root'
})
export class CuidadService {

    private urlEndPoint = environment.URL_APP;

    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
    })

    constructor(private http: HttpClient) {
    }



    createCuidad(cuidad: Cuidad): Observable<Cuidad> {
        return this.http.post(environment.URL_APP + "/cuidad/registrarCuidad", cuidad, { headers: this.httpHeaders })
    }

    getCuidadall(): Observable<Cuidad[]> {
        return this.http.get(environment.URL_APP + "/cuidad/allCuidad", { headers: this.httpHeaders }).pipe(map(Response => Response as Cuidad[]))
    }


    getPaisall(): Observable<Cuidad[]> {
        return this.http.get(environment.URL_APP + "/ubicacion/allPais", { headers: this.httpHeaders }).pipe(map(Response => Response as Cuidad[]))
    }


    createPais(cuidad: Cuidad): Observable<Cuidad> {
        return this.http.post(environment.URL_APP + "/ubicacion/registrarPais", cuidad, { headers: this.httpHeaders })
    }

}
