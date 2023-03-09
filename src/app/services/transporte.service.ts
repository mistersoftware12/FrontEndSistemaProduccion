import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Transporte } from '../models/transporte';



@Injectable({
    providedIn: 'root'
})
export class TransporteService {

    private urlEndPoint = environment.URL_APP;

    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
    })

    constructor(private http: HttpClient) {
    }



    createTransporte(info: Transporte): Observable<Transporte> {
        return this.http.post(environment.URL_APP + "/trasporte/registrarTransporte", info, { headers: this.httpHeaders })
    }

    getTransporteAll(): Observable<Transporte[]> {
        return this.http.get(environment.URL_APP + "/trasporte/allTrasporte", { headers: this.httpHeaders }).pipe(map(Response => Response as Transporte[]))
    }



    getTransporteId(id: any): Observable<Transporte> {
        return this.http.get(environment.URL_APP + "/transporte/allBylistaTransporte/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Transporte))
    }


    putTransporte(info: Transporte): Observable<Transporte> {
        return this.http.put(environment.URL_APP + "/trasporte/updateTrasporte", info, { headers: this.httpHeaders })
    }



}
