import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente';
import { Almacen } from '../models/almacen';
import { Sucursal } from '../models/sucursal';
import { Bodega, Taller } from '../models/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }



  createSucursal(sucursal: Sucursal): Observable<Sucursal> {
    return this.http.post(environment.URL_APP + "/empresa/registrarSucursal", sucursal, { headers: this.httpHeaders })
  }

  createAlmacen(almacen: Almacen): Observable<Almacen> {
    return this.http.post(environment.URL_APP + "/empresa/registrarAlmacen", almacen, { headers: this.httpHeaders })
  }

  createBodega(bodega: Bodega): Observable<Bodega> {
    return this.http.post(environment.URL_APP + "/empresa/registrarBodega", bodega, { headers: this.httpHeaders })
  }

  createTaller(taller: Taller): Observable<Taller> {
    return this.http.post(environment.URL_APP + "/empresa/registrarTaller", taller, { headers: this.httpHeaders })
  }



  getSucursalAll(): Observable<Sucursal[]> {
    return this.http.get(environment.URL_APP + "/empresa/allSucursal", { headers: this.httpHeaders }).pipe(map(Response => Response as Sucursal[]))
  }

  getAlmacenAll(): Observable<Almacen[]> {
    return this.http.get(environment.URL_APP + "/empresa/allAlmacen", { headers: this.httpHeaders }).pipe(map(Response => Response as Almacen[]))
  }

  getBodegaAll(): Observable<Bodega[]> {
    return this.http.get(environment.URL_APP + "/empresa/allBodega", { headers: this.httpHeaders }).pipe(map(Response => Response as Bodega[]))
  }

  getTallerAll(): Observable<Taller[]> {
    return this.http.get(environment.URL_APP + "/empresa/allTaller", { headers: this.httpHeaders }).pipe(map(Response => Response as Taller[]))
  }

  //Listar por id Sucurssal

  getAlmacenAllByIdSucursal(idSucursal: any): Observable<Almacen[]> {
    return this.http.get(environment.URL_APP + "/empresa/allAlmacenByIdSucursal/" + idSucursal, { headers: this.httpHeaders }).pipe(map(Response => Response as Almacen[]))
  }




  getBodegaId(id: any): Observable<Bodega[]> {
    return this.http.get(environment.URL_APP + "/empresa/allBodegaBySucursal/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Bodega[]))
  }

  getTallerId(id: any): Observable<Taller[]> {
    return this.http.get(environment.URL_APP + "/empresa/allTalleByIdSucursal/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Taller[]))
  }


  putSucursal(sucursal: Sucursal): Observable<Sucursal> {
    return this.http.put(environment.URL_APP + "/empresa/updateSucursal", sucursal, { headers: this.httpHeaders })
  }

  putAlmacen(almacen: Almacen): Observable<Almacen> {
    return this.http.put(environment.URL_APP + "/empresa/updateAlmacen", almacen, { headers: this.httpHeaders })
  }

  putBodega(bodega: Bodega): Observable<Bodega> {
    return this.http.put(environment.URL_APP + "/empresa/updateBodega", bodega, { headers: this.httpHeaders })
  }

  putTaller(taller: Taller): Observable<Taller> {
    return this.http.put(environment.URL_APP + "/empresa/updateTaller", taller, { headers: this.httpHeaders })
  }


}
