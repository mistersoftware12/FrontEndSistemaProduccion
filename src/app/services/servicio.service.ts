import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Servicio } from '../models/servicio';
import { MaximoDadoCaptura } from '../models/extras';



@Injectable({
    providedIn: 'root'
})
export class ServicioService {

    private urlEndPoint = environment.URL_APP;

    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
    })

    constructor(private http: HttpClient) {
    }



    createServicio(servicio: Servicio): Observable<Servicio> {
        return this.http.post(environment.URL_APP + "/servicio/registrarServicio", servicio, { headers: this.httpHeaders })
    }

    getServicioAll(): Observable<Servicio[]> {
        return this.http.get(environment.URL_APP + "/servicio/allServicio", { headers: this.httpHeaders }).pipe(map(Response => Response as Servicio[]))
    }

    getMaximoRegistroCodigo(): Observable<MaximoDadoCaptura> {
        return this.http.get(environment.URL_APP + "/servicio/allByMaximoCodigoBarra", { headers: this.httpHeaders }).pipe(map(Response => Response as MaximoDadoCaptura))
    }

    getServicioId(id: any): Observable<Servicio> {
        return this.http.get(environment.URL_APP + "/servicio/allBylistaServicio/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Servicio))
    }

    /*
    getCategoriaAllEstado(estado : boolean): Observable<Categoria[]> {
        return this.http.get(environment.URL_APP + "/servicio/allCategoriaEstado/"+estado, { headers: this.httpHeaders }).pipe(map(Response => Response as Categoria[]))
    }*/

    putServicio(servicio: Servicio): Observable<Servicio> {
        return this.http.put(environment.URL_APP + "/servicio/updateServicio", servicio, { headers: this.httpHeaders })
    }



}
