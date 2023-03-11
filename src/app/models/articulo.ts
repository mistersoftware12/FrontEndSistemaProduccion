export class Articulo {

  id?: any;
  nombre?: any;
  descripcion?: any;
  stockMinimo?: any;
  color?: any;
  foto?: any;
  codigoBarra?: any;
  estadoArticulo?: any;
  estadoWeb?: any;
  codigoCompra?: any;
  marca?: any;
  vidaUtil?: any;

  //medida
  alto?: any;
  ancho?: any;
  profundidad?: any;
  peso?: any;


  //precioproducccion

  precioCosto?: any;
  iva?: any;
  precioIva?: any;
  precioStandar?: any;
  margenProduccion?: any;
  precioProduccion?: any;
  margenVenta?: any;
  precioVenta?: any;
  precioFinal?: any;


  //herencia

  idCategoria?: any;
  idCatalogo?: any;

  nombreCategoria?: any;
  nombreCatalogo?: any;
  nombreEstadoArticulo?: any;
  nombreEstadoWeb?: any;

}

export class ArticuloProveedor {

  id?: any;
  idArticulo?: any;
  idProveedor?: any;
  precioCompra?: any;
  nombreProveedor?: any;
}


export class ArticuloControl {
  id?: any;
  idProveedor?: any;
}