import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Articulo, ArticuloProveedor } from '../models/articulo';
import { ContadorDatos, MaximoDadoCaptura } from '../models/extras';
import { Bodega, Taller } from '../models/empresa';


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

    createArticuloProveedor(articuloproveedor: ArticuloProveedor): Observable<ArticuloProveedor> {
        return this.http.post(environment.URL_APP + "/articulo/registrarArticuloProveedor", articuloproveedor, { headers: this.httpHeaders })
    }

    getArticuloAll(): Observable<Articulo[]> {
        return this.http.get(environment.URL_APP + "/articulo/allArticulo", { headers: this.httpHeaders }).pipe(map(Response => Response as Articulo[]))
    }


    getArticuloId(id: any): Observable<Articulo> {
        return this.http.get(environment.URL_APP + "/articulo/allBylistaArticulo/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Articulo))
    }

    getArticuloProveedorByArticuloId(id: any): Observable<ArticuloProveedor[]> {
        return this.http.get(environment.URL_APP + "/articulo/allArticuloProveedorByArticuloid/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as ArticuloProveedor[]))
    }

    getArticuloProveedorByProveedorId(id: any): Observable<ArticuloProveedor[]> {
        return this.http.get(environment.URL_APP + "/articulo/allArticuloProveedorByProveedorid/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as ArticuloProveedor[]))
    }


    getMaximoRegistroCodigo(id: any): Observable<MaximoDadoCaptura> {
        return this.http.get(environment.URL_APP + "/articulo/allByMaximoCodigoBarra/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as MaximoDadoCaptura))
    }

    putArticulo(articulo: Articulo): Observable<Articulo> {
        return this.http.put(environment.URL_APP + "/articulo/updateArticulo", articulo, { headers: this.httpHeaders })
    }

    putPrecioProveedor(articuloprove: ArticuloProveedor): Observable<ArticuloProveedor> {
        return this.http.put(environment.URL_APP + "/articulo/updatePrecioArticuloProveedor", articuloprove, { headers: this.httpHeaders })
    }


    deleteProveedorDeArticulo(idproar: any) {
        return this.http.delete(environment.URL_APP + "/articulo/deleteProveedorArticulo/" + idproar, { headers: this.httpHeaders });
    }


}
