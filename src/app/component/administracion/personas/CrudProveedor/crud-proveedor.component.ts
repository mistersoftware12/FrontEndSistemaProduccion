import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { DatePipe } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClienteService } from 'src/app/services/cliente.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Cliente } from 'src/app/models/cliente';
import { cedula } from 'src/environments/environment';
import { CuidadService } from 'src/app/services/cuidad.service';
import { Cuidad } from 'src/app/models/cuidad';
import Swal from 'sweetalert2';
import { ProveedorService } from 'src/app/services/proveedorService';
import { Proveedor } from 'src/app/models/persona';
import { ArticuloService } from 'src/app/services/articulo.service';
import { Articulo, ArticuloProveedor } from 'src/app/models/articulo';

@Component({
  selector: 'app-crud-proveedor',
  templateUrl: './crud-proveedor.component.html',
  styleUrls: ['./crud-proveedor.component.css'],


})

export class CrudProveedorComponent implements OnInit {

  //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;
  public sectionCrudDatosArticulo: Boolean = false;
  public sectionTablaArticulos: Boolean = false;


  public idPersona: any;
  public idProveedor: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;

  public nombreProveedor: String = "";
  public apellidoProveedor: String = "";


  public dialogoEditarPrecioProveedor: boolean;

  public numeroControl: number = 1;

  loaderActualizar: boolean;


  public proveedorListaGuardar: Proveedor = new Proveedor();
  public articuloProveedorListaGuardar: ArticuloProveedor = new ArticuloProveedor();
  public proveedorLista: Proveedor[] = [];
  public articuloLista: Articulo[] = [];
  public paisLista: Cuidad[] = [];


  formGrupos = new FormGroup({
    cedula: new FormControl<String>('', [Validators.required, Validators.maxLength(13), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    fecha: new FormControl<String>('', [Validators.required]),
    nombres: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    apellidos: new FormControl<String>(null, [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    telefono: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
    email: new FormControl<String>('', [Validators.required, Validators.email]),
    nombrebanco: new FormControl<String>(null, [Validators.required]),
    numerocuenta: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
    pais: new FormControl<String>('', [Validators.required]),
    cuidad: new FormControl<String>('', [Validators.required]),
    direccion: new FormControl<String>(null, [Validators.required]),
  })


  formGrupoArticulo = new FormGroup({
    idArticulo: new FormControl<String>('', [Validators.required]),
    precio: new FormControl<String>('', [Validators.required]),
  })


  formGroupPrecioProveedor = new FormGroup({
    proveedor: new FormControl<any>('', [Validators.required]),
    precio: new FormControl<any>('', [Validators.required, Validators.max(500)]),
  })


  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellidos', 'telefono', 'nacimiento', 'correo', 'documento'];
  dataSource: MatTableDataSource<Cliente>;

  displayedColumns2: string[] = ['id', 'cedula', 'apellidos', 'nombre', 'descripcion', 'preciocosto', 'documento'];
  dataSource2: MatTableDataSource<ArticuloProveedor>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;




  constructor(
    private _snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private cuidadService: CuidadService,
    private proveedorService: ProveedorService,
    private articuloService: ArticuloService,
  ) {

  }

  ngOnInit(): void {
    this.listarInformacion();
    this.listarPais();

  }


  public mostrarNuevo() {


    if (this.numeroControl == 3) {
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;
      this.numeroControl = 1;
    }

    this.sectionTablaLista = false;
    this.sectionCrudDatos = true;

  }


  public mostrarNuevoArticulo() {

    this.listarArticulos();
    this.sectionTablaLista = false;
    this.sectionTablaArticulos = false;
    this.sectionCrudDatosArticulo = true;

  }


  public mostrarLista() {
    this.numeroControl = 1;
    this.listarInformacion();
    this.sectionTablaLista = true;
    this.sectionCrudDatos = false;
  }

  public botonCancelarRegistro() {

    this.mostrarLista();
    this.vaciarFormulario();
    this.botonParaGuardar = true;
    this.botonParaEditar = false;
    this.numeroControl = 1;

  }

  public botonCancelarRegistroArticulo() {

    this.sectionTablaArticulos = true;
    this.sectionCrudDatosArticulo = false;
    this.mostrarTablaProducto(this.idProveedor, this.nombreProveedor, this.apellidoProveedor);

  }



  public botonCancelarArticulos() {
    this.sectionTablaArticulos = false;
    this.sectionTablaLista = true;

  }




  vaciarFormulario() {
    this.formGrupos.setValue({
      cedula: "",
      fecha: null,
      nombres: "",
      apellidos: "",
      telefono: "",
      email: "",
      nombrebanco: "",
      numerocuenta: "",
      pais: "",
      cuidad: "",
      direccion: "",
    })

  }


  //LISTAR

  public listarInformacion() {
    this.loaderActualizar = true;

    this.proveedorService.getProveedoresAll().subscribe(value => {

      this.proveedorLista = value;

      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loaderActualizar = false;
    })


  }


  public listarPais() {


    this.cuidadService.getPaisall().subscribe(value => {

      this.paisLista = value;
    })
  }


  public listarProductos() {
    this.loaderActualizar = true;
    this.articuloService.getArticuloProveedorByProveedorId(this.idProveedor).subscribe(value2 => {
      console.info(value2);

      this.dataSource2 = new MatTableDataSource(value2);
      this.dataSource2.paginator = this.paginator;
      this.dataSource2.sort = this.sort;
      this.loaderActualizar = false;

    })


  }


  public listarArticulos() {

    this.articuloService.getArticuloAll().subscribe(value3 => {
      this.articuloLista = value3;

    })


  }


  public mostrarTablaProducto(idProve: any, nombres: any, apellidos: any) {

    this.idProveedor = idProve;
    this.listarProductos();
    this.nombreProveedor = nombres;
    this.apellidoProveedor = apellidos;

    this.sectionTablaLista = false;
    this.sectionTablaArticulos = true;


  }



  applyFilter(event: Event) {


    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  applyFilter1(event: Event) {


    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }

  }


  public guardarInformacion() {

    this.proveedorListaGuardar.cedula = Object.values(this.formGrupos.getRawValue())[0];
    this.proveedorListaGuardar.fechaNacimiento = Object.values(this.formGrupos.getRawValue())[1];
    this.proveedorListaGuardar.nombres = Object.values(this.formGrupos.getRawValue())[2];
    this.proveedorListaGuardar.apellidos = Object.values(this.formGrupos.getRawValue())[3];
    this.proveedorListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[4];
    this.proveedorListaGuardar.email = Object.values(this.formGrupos.getRawValue())[5];
    this.proveedorListaGuardar.nombreBanco = Object.values(this.formGrupos.getRawValue())[6];
    this.proveedorListaGuardar.numeroCuenta = Object.values(this.formGrupos.getRawValue())[7];
    this.proveedorListaGuardar.idPais = Object.values(this.formGrupos.getRawValue())[8];
    this.proveedorListaGuardar.nombreCuidad = Object.values(this.formGrupos.getRawValue())[9];
    this.proveedorListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[10];

    console.info(this.proveedorListaGuardar)

    this.proveedorService.createProveedor(this.proveedorListaGuardar).subscribe(value => {
      this._snackBar.open('Proveedor registrado', 'ACEPTAR');
      this.vaciarFormulario();
      //this.listarEventoSinParticipantes();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

    })


  }


  public guardarInformacionArticulo() {
    this.articuloProveedorListaGuardar.idProveedor = this.idProveedor;
    this.articuloProveedorListaGuardar.idArticulo = Object.values(this.formGrupoArticulo.getRawValue())[0];
    this.articuloProveedorListaGuardar.precioCompra = Object.values(this.formGrupoArticulo.getRawValue())[1];


    this.articuloService.createArticuloProveedor(this.articuloProveedorListaGuardar).subscribe(value => {
      this._snackBar.open('Articulo añadido al Proveedor', 'ACEPTAR');

    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR AL AGREGAR PROVEEDOR', 'ACEPTAR');

    })
    this.listarProductos();
    this.botonCancelarRegistroArticulo();
    this.mostrarTablaProducto(this.idProveedor, this.nombreProveedor, this.apellidoProveedor);


  }

  public agregarCuidad() {
    Swal.fire({
      title: "Ingrese el nombre del pais",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      background: '#f7f2dc',
      confirmButtonColor: '#a01b20',
      backdrop: false
    })
      .then(resultado => {
        if (resultado.value) {
          let cuidad: Cuidad = new Cuidad()
          cuidad.nombre = resultado.value

          this.cuidadService.createPais(cuidad).subscribe(value => {
            this.listarPais();
            this._snackBar.open('Pais registrado', 'ACEPTAR');
          }, error => {
            this._snackBar.open(error.error.message, 'ACEPTAR');
          })
        }
      });
  }


  abrirEditarPrecio(id: any, nombrePro: any) {
    this.dialogoEditarPrecioProveedor = true;
    this.articuloProveedorListaGuardar.id = id;
    this.formGroupPrecioProveedor.setValue({
      proveedor: nombrePro,
      precio: "",

    })

    this.listarProductos();
  }


  ////Editar

  editarInformacion(cedula: any) {


    this.proveedorService.getProveedorId(cedula).subscribe(value => {

      console.info("Dato cargado en consulta editar");

      this.formGrupos.setValue({
        cedula: value.cedula,
        fecha: value.fechaNacimiento,
        nombres: value.nombres,
        apellidos: value.apellidos,
        telefono: value.telefono,
        email: value.email,
        nombrebanco: value.nombreBanco,
        numerocuenta: value.numeroCuenta,
        pais: value.idPais,
        cuidad: value.nombreCuidad,
        direccion: value.direccion,
      })

      this.proveedorListaGuardar.id = value.id;
      this.proveedorListaGuardar.idProveedor = value.idProveedor;

      this.botonParaGuardar = false;
      this.botonParaEditar = true;

      this.mostrarNuevo();
      this.numeroControl = 3;

    })

  }


  public guardarEditarInformacion() {

    this.proveedorListaGuardar.cedula = Object.values(this.formGrupos.getRawValue())[0];
    this.proveedorListaGuardar.fechaNacimiento = Object.values(this.formGrupos.getRawValue())[1];
    this.proveedorListaGuardar.nombres = Object.values(this.formGrupos.getRawValue())[2];
    this.proveedorListaGuardar.apellidos = Object.values(this.formGrupos.getRawValue())[3];
    this.proveedorListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[4];
    this.proveedorListaGuardar.email = Object.values(this.formGrupos.getRawValue())[5];
    this.proveedorListaGuardar.nombreBanco = Object.values(this.formGrupos.getRawValue())[6];
    this.proveedorListaGuardar.numeroCuenta = Object.values(this.formGrupos.getRawValue())[7];
    this.proveedorListaGuardar.idPais = Object.values(this.formGrupos.getRawValue())[8];
    this.proveedorListaGuardar.nombreCuidad = Object.values(this.formGrupos.getRawValue())[9];
    this.proveedorListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[10];
    console.log("Datos Actualizar");

    this.proveedorService.putProveedor(this.proveedorListaGuardar).subscribe(value => {
      this._snackBar.open('Proveedor Actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;
      //this.listarEventoSinParticipantes();
      this.mostrarLista();


    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
      //this.loaderGuardar=false
    })


  }

  guardarEditar() {

    this.articuloProveedorListaGuardar.precioCompra = Number(Object.values(this.formGroupPrecioProveedor.getRawValue())[1]);

    console.info(this.articuloProveedorListaGuardar);


    this.articuloService.putPrecioProveedor(this.articuloProveedorListaGuardar).subscribe(value => {
      this._snackBar.open('Precio Modidicado', 'ACEPTAR');


      this.dialogoEditarPrecioProveedor = false;

      this.listarProductos();


    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
      //this.loaderGuardar=false
    })

  }



  //Exportaciones de documento

  exportToExcel(condicion: any): void {
    let element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');


    //XLSX.writeFile(book, 'Lista de ' + nombre + ' ' + this.nombreProveedor + '.xlsx');


    if (Number(condicion) == 1) {
      XLSX.writeFile(book, 'Lista de proveedores.xlsx');
    }

    if (Number(condicion) == 2) {
      XLSX.writeFile(book, 'Lista de artículos ' + this.nombreProveedor + '.xlsx');
    }
  }


  //Generar PDF


  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        // @ts-ignore
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }


  generatePDF() {
    this.loaderActualizar = true
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();


    this.proveedorService.getProveedoresAll().subscribe(value => {
      console.info(value)
      this.usuarioService.getAllUsuarios().subscribe(async valueb => {
        console.info(valueb)

        const pdfDefinition: any = {

          footer: function (currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
          header: function (currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element

            /*
            return [
              { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
              { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            ]*/
          },

          content: [
            { image: await this.getBase64ImageFromURL('assets/images/kadapaLogo.png'), width: 100 },
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            { text: pipe.transform(dia, ' d  MMMM  y'), alignment: 'right' },
            { text: 'PROVEEDORES REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Clientes registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['2%', '10%', '17%', '17%', '10,1%', '10,1%', '27%', '10%'],
                body: [
                  ['ID', 'CEDULA', 'NOMBRES', 'APELLIDOS', 'CUIDAD.', 'BANCO', 'CUENTA', 'TELEFONO'],
                  [value.map(function (item) {
                    return { text: item.id + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.cedula + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.nombres + '', fontSize: 11 }

                  }),
                  value.map(function (item) {
                    return { text: item.apellidos + '', fontSize: 11 }

                  }),
                  value.map(function (item) {
                    return { text: item.nombreCuidad + '', fontSize: 11 }

                  }),
                  value.map(function (item) {
                    return { text: item.nombreBanco + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.numeroCuenta + '', fontSize: 11 }

                  }),
                  value.map(function (item) {
                    return { text: item.telefono + '', fontSize: 11 }

                  })


                  ],

                ]
              }

            },
            { text: '    ' },
            { text: '    ' },


            {
              table: {
                headerRows: 1,
                widths: ['100%'],
                heights: 20,
                body: [
                  ['USUARIO/A: ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().nombres + ' ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().apellidos],

                ]
              },
            },

          ],

          pageOrientation: 'landscape',
        }


        this.loaderActualizar = false
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      })
    })
  }

  generatePDFArticulos() {
    this.loaderActualizar = true
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();

    this.articuloService.getArticuloProveedorByProveedorId(this.idProveedor).subscribe(value => {

      console.info(value)
      this.usuarioService.getAllUsuarios().subscribe(async valueb => {
        console.info(valueb)

        const pdfDefinition: any = {

          footer: function (currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
          header: function (currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element

            /*
            return [
              { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
              { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            ]*/
          },

          content: [
            { image: await this.getBase64ImageFromURL('assets/images/kadapaLogo.png'), width: 100 },
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            { text: pipe.transform(dia, ' d  MMMM  y'), alignment: 'right' },
            { text: 'PROVEEDOR: ' + this.nombreProveedor + ' ' + this.apellidoProveedor, fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Clientes registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['5%', '10%', '10%', '17%', '48%', '7%'],

                body: [
                  ['ID', 'FOTO', 'C. BARRA', 'NOMBRE', 'DESCRIPCIÓN', 'COSTO'],
                  [value.map(function (item) {
                    return { text: item.id + '', fontSize: 11, lineHeight: 2.9 }
                  }),
                  value.map(function (item) {
                    return {

                      image: 'data:image/jpeg;base64,' + item.foto + '',
                      width: 32, alignment: 'center',

                    }
                  }),
                  value.map(function (item) {
                    return { text: item.codigoBarra + '', fontSize: 11, lineHeight: 2.9 }

                  }),
                  value.map(function (item) {
                    return { text: item.nombreArticulo + '', fontSize: 11, lineHeight: 2.9 }

                  }),
                  value.map(function (item) {
                    return { text: item.descripcion + '', fontSize: 11, lineHeight: 2.9 }

                  }),
                  value.map(function (item) {
                    return { text: '$' + item.precioCompra.toFixed(2) + '', fontSize: 11, lineHeight: 2.9 }
                  }),


                  ],

                ]
              }

            },
            { text: '    ' },
            { text: '    ' },

            {



            },



            {
              table: {
                headerRows: 1,
                widths: ['100%'],
                heights: 20,
                body: [
                  ['USUARIO/A: ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().nombres + ' ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().apellidos],

                ]
              },
            },

          ],

          pageOrientation: 'landscape',
        }


        this.loaderActualizar = false
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      })
    })
  }
}