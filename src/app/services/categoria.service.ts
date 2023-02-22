import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Catalogo } from '../models/catalogo';
import { Categoria } from '../models/categoria';


@Injectable({
    providedIn: 'root'
})
export class CategoriaService {

    private urlEndPoint = environment.URL_APP;

    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
    })

    constructor(private http: HttpClient) {
    }



    createCategoria(categoria: Categoria): Observable<Categoria> {
        return this.http.post(environment.URL_APP + "/categoria/registrarCategoria", categoria, { headers: this.httpHeaders })
    }

    getCategoriaAll(): Observable<Categoria[]> {
        return this.http.get(environment.URL_APP + "/categoria/allCategoria", { headers: this.httpHeaders }).pipe(map(Response => Response as Categoria[]))
    }

    putCategoria(categoria: Categoria): Observable<Categoria> {
        return this.http.put(environment.URL_APP + "/categoria/updateCategoria", categoria, { headers: this.httpHeaders })
    }



}
