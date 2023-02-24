import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Articulo } from '../models/articulo';


@Injectable({
    providedIn: 'root'
})
export class ArticuloService {

    private urlEndPoint = environment.URL_APP;

    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
    })

    constructor(private http: HttpClient) {
    }



    createArticulo(articulo: Articulo): Observable<Articulo> {
        return this.http.post(environment.URL_APP + "/articulo/registrarArticulo", articulo, { headers: this.httpHeaders })
    }

    getArticuloAll(): Observable<Articulo[]> {
        return this.http.get(environment.URL_APP + "/articulo/allArticulo", { headers: this.httpHeaders }).pipe(map(Response => Response as Articulo[]))
    }


    getArticuloId(id: any): Observable<Articulo> {
        return this.http.get(environment.URL_APP + "/articulo/allBylistaArticulo/" + id, {headers: this.httpHeaders}).pipe(map(Response => Response as Articulo))
      }

    putArticulo(articulo: Articulo): Observable<Articulo> {
        return this.http.put(environment.URL_APP + "/articulo/updateArticulo", articulo, { headers: this.httpHeaders })
    }



}
