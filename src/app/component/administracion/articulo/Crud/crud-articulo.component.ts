import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Sucursal } from 'src/app/models/sucursal';
import { Observable, ReplaySubject } from 'rxjs';
import { Catalogo } from 'src/app/models/catalogo';
import { CatalogoService } from 'src/app/services/catalogo.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { EstadoFD } from 'src/app/models/estado';
import { UsuarioService } from 'src/app/services/usuario.service';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from "@angular/common";
import { cedula } from 'src/environments/environment';
import { ArticuloService } from 'src/app/services/articulo.service';
import { Articulo } from 'src/app/models/articulo';
import { Categoria } from 'src/app/models/categoria';
import * as JsBarcode from 'jsbarcode';



@Component({
    selector: 'app-crud-articulo',
    templateUrl: './crud-articulo.component.html',
    styleUrls: ['./crud-articulo.component.css'],


})

export class CrudArticuloComponent implements OnInit {



    //Control de pantallas
    public sectionTablaLista: Boolean = true;
    public sectionCrudDatos: Boolean = false;


    public idArticulo: any;
    public idCategoria: any;
    public botonParaGuardar: Boolean = true;
    public botonParaEditar: Boolean = false;

    public imagenFijo: Boolean = true;
    public imagenBase: Boolean = false;

    public numeroControl: number = 1;

    loaderActualizar: boolean;


    base64Output: string;
    public codigoBarra: string = "sasa";


    public articuloListaGuardar: Articulo = new Articulo();
    public articuloLista: Articulo[] = [];
    public catalogoLista: Catalogo[] = [];
    public categoriaLista: Categoria[] = [];


    public estadoLista: EstadoFD[] = [{ id: 1, nombres: 'Activo', value: 'true' }, { id: 2, nombres: 'Inactivo', value: 'false' }];




    formGrupos = new FormGroup({
        nombres: new FormControl<String>('', [Validators.required]),

        descripcion: new FormControl<String>('', [Validators.required]),
        codigocompra: new FormControl<String>('', [Validators.required]),
        categoria: new FormControl<String>('', [Validators.required]),
        catalogo: new FormControl<String>('', [Validators.required]),
        estadoarticulo: new FormControl<String>('', [Validators.required]),
        estadoweb: new FormControl<String>('', [Validators.required]),
        stockminimo: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
        color: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
        marca: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
        vidautil: new FormControl<String>('', [Validators.required]),

        alto: new FormControl<String>('', [Validators.required]),
        ancho: new FormControl<String>('', [Validators.required]),
        profundidad: new FormControl<String>('', [Validators.required]),
        peso: new FormControl<String>('', [Validators.required]),

    })

    formGrupoPrecio = new FormGroup({
        preciocosto: new FormControl<String>('', [Validators.required]),
        iva: new FormControl<String>('', [Validators.required]),
        precioiva: new FormControl<String>('', [Validators.required]),
        preciofinal: new FormControl<String>('', [Validators.required]),
        precioestandar: new FormControl<String>('', [Validators.required]),
        margenproduccion: new FormControl<String>('', [Validators.required]),
        precioproduccion: new FormControl<String>('', [Validators.required]),
        margenventa: new FormControl<String>('', [Validators.required]),
        precioventa: new FormControl<String>('', [Validators.required]),
    })

    forGrupoCodigoBarra = new FormGroup({
        codigobarra: new FormControl<String>('', [Validators.required]),
    })



    displayedColumns: string[] = ['id', 'nombre', 'logo', 'precioproduccion', 'precioventa', 'stockminimo', 'documento'];
    dataSource: MatTableDataSource<Sucursal>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _snackBar: MatSnackBar,
        private categoriaService: CategoriaService,
        private usuarioService: UsuarioService,

        private articuloService: ArticuloService,
        private catalogoService: CatalogoService,

    ) {
    }

    ngOnInit(): void {
        this.listarInformacion();
        this.listarCategorias();
        this.listarCatalogos();
        // this.codigodeBarra();

    }



    public mostrarImagenBase() {
        this.imagenFijo = false;
        this.imagenBase = true;
    }

    public mostrarImagenFijo() {
        this.imagenFijo = true;
        this.imagenBase = false;
    }


    public mostrarNuevo() {

        this.mostrarImagenFijo();

        if (this.numeroControl == 3) {
            this.vaciarFormulario();
            this.botonParaGuardar = true;
            this.botonParaEditar = false;
            this.numeroControl = 1;
        }

        this.sectionTablaLista = false;
        this.sectionCrudDatos = true;

        this.vaciarFormualarioPrecio();
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

    vaciarFormulario() {

        this.formGrupos.setValue({

            nombres: "",
            descripcion: "",
            codigocompra: "",
            categoria: "",
            catalogo: "",
            estadoarticulo: "",
            estadoweb: "",
            stockminimo: "",
            color: "",
            marca: "",
            vidautil: "",

            alto: "",
            ancho: "",
            profundidad: "",
            peso: "",



        })

        this.formGrupoPrecio.setValue({
            preciocosto: "",
            iva: "",
            precioiva: "",
            preciofinal: "",
            precioestandar: "",
            margenproduccion: "",
            precioproduccion: "",
            margenventa: "",
            precioventa: "",
        })

        this.forGrupoCodigoBarra.setValue({
            codigobarra: "",

        })


    }



    //LISTAR

    public listarInformacion() {

        this.articuloService.getArticuloAll().subscribe(value => {

            this.articuloLista = value;

            this.dataSource = new MatTableDataSource(value);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

        })


    }

    public listarCategorias() {
        this.categoriaService.getCategoriaAll().subscribe(value => {
            this.categoriaLista = value;
        })


    }

    public listarCatalogos() {

        this.catalogoService.getCatalogoAll().subscribe(value => {
            this.catalogoLista = value;

        })


    }





    applyFilter(event: Event) {


        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }

    }

    public guardarInformacion() {

        this.articuloListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
        //this.articuloListaGuardar.codigoBarra = Object.values(this.formGrupos.getRawValue())[1];
        this.articuloListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[1];
        this.articuloListaGuardar.codigoCompra = Object.values(this.formGrupos.getRawValue())[2];
        this.articuloListaGuardar.idCategoria = Object.values(this.formGrupos.getRawValue())[3];
        this.articuloListaGuardar.idCatalogo = Object.values(this.formGrupos.getRawValue())[4];

        var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[5]);
        var d = parseInt(s);
        if (d == 1) {
            this.articuloListaGuardar.estadoArticulo = true;
        } if (d == 2) {
            this.articuloListaGuardar.estadoArticulo = false;
        }

        var sa = JSON.stringify(Object.values(this.formGrupos.getRawValue())[6]);
        var da = parseInt(sa);
        if (da == 1) {
            this.articuloListaGuardar.estadoWeb = true;
        } if (da == 2) {
            this.articuloListaGuardar.estadoWeb = false;
        }

        this.articuloListaGuardar.stockMinimo = Object.values(this.formGrupos.getRawValue())[7];
        this.articuloListaGuardar.color = Object.values(this.formGrupos.getRawValue())[8];
        this.articuloListaGuardar.marca = Object.values(this.formGrupos.getRawValue())[9];
        this.articuloListaGuardar.vidaUtil = Object.values(this.formGrupos.getRawValue())[10];

        this.articuloListaGuardar.alto = Object.values(this.formGrupos.getRawValue())[12];
        this.articuloListaGuardar.ancho = Object.values(this.formGrupos.getRawValue())[13];
        this.articuloListaGuardar.profundidad = Object.values(this.formGrupos.getRawValue())[13];
        this.articuloListaGuardar.peso = Object.values(this.formGrupos.getRawValue())[14];

        this.articuloListaGuardar.precioCosto = Object.values(this.formGrupoPrecio.getRawValue())[0];
        this.articuloListaGuardar.iva = Object.values(this.formGrupoPrecio.getRawValue())[1];
        this.articuloListaGuardar.precioIva = Object.values(this.formGrupoPrecio.getRawValue())[2];
        this.articuloListaGuardar.precioFinal = Object.values(this.formGrupoPrecio.getRawValue())[3];
        this.articuloListaGuardar.precioStandar = Object.values(this.formGrupoPrecio.getRawValue())[4];
        this.articuloListaGuardar.margenProduccion = Object.values(this.formGrupoPrecio.getRawValue())[5];
        this.articuloListaGuardar.precioProduccion = Object.values(this.formGrupoPrecio.getRawValue())[6];
        this.articuloListaGuardar.margenVenta = Object.values(this.formGrupoPrecio.getRawValue())[7];
        this.articuloListaGuardar.precioVenta = Object.values(this.formGrupoPrecio.getRawValue())[8];



        this.articuloListaGuardar.codigoBarra = Object.values(this.forGrupoCodigoBarra.getRawValue())[0];

        console.info(this.articuloListaGuardar);

        this.articuloService.createArticulo(this.articuloListaGuardar).subscribe(value => {
            this._snackBar.open('Articulo Creado', 'ACEPTAR');

            this.vaciarFormulario();
            this.mostrarLista();
            this.listarInformacion();

        }, error => {
            this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

        })




    }

    //Generar Código

    generaCodigo() {

        this.idCategoria

        this.articuloService.getMaximoRegistroCodigo(this.idCategoria).subscribe(value => {


            console.info(value.maximoDato);


            this.forGrupoCodigoBarra.setValue({
                codigobarra: value.maximoDato,

            })



        })

    }


    ////Editar

    editarInformacion(id: any) {

        this.idArticulo = id;
        this.botonParaGuardar = false;
        this.botonParaEditar = true;

        this.articuloService.getArticuloId(id).subscribe(value1 => {
            console.info(value1);




            if (value1.estadoArticulo == true) {
                this.articuloListaGuardar.estadoArticulo = 1;


            } if (value1.estadoArticulo == false) {
                this.articuloListaGuardar.estadoArticulo = 2;

            }

            this.base64Output = value1.foto;
            this.mostrarImagenBase();


            console.info(value1.estadoWeb);
            if (value1.estadoWeb == true) {
                this.articuloListaGuardar.estadoWeb = 1;


            } if (value1.estadoWeb == false) {
                this.articuloListaGuardar.estadoWeb = 2;

            }

            this.articuloListaGuardar.foto = value1.foto;





            this.formGrupos.setValue({
                nombres: value1.nombre,
                //codigobarra: value1.codigoBarra,
                descripcion: value1.descripcion,
                codigocompra: value1.codigoCompra,
                categoria: value1.idCategoria,
                catalogo: value1.idCatalogo,

                estadoarticulo: this.articuloListaGuardar.estadoArticulo,
                estadoweb: this.articuloListaGuardar.estadoWeb,
                stockminimo: value1.stockMinimo,
                color: value1.color,
                marca: value1.marca,
                vidautil: value1.vidaUtil,

                alto: value1.alto,
                ancho: value1.ancho,
                profundidad: value1.profundidad,
                peso: value1.peso,


            })

            this.formGrupoPrecio.setValue({
                preciocosto: value1.precioCosto.toFixed(2),
                iva: value1.iva,
                precioiva: value1.precioIva.toFixed(2),
                preciofinal: value1.precioFinal.toFixed(2),
                precioestandar: value1.precioStandar.toFixed(2),
                margenproduccion: value1.margenProduccion,
                precioproduccion: value1.precioProduccion.toFixed(2),
                margenventa: value1.margenVenta,
                precioventa: value1.precioVenta.toFixed(2),
            })

            this.forGrupoCodigoBarra.setValue({
                codigobarra: value1.codigoBarra,

            })


            this.numeroControl = 3;
            this.articuloListaGuardar.id = this.idArticulo;

        })

        this.mostrarNuevo();






    }


    public guardarEditarInformacion() {

        this.articuloListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
        //this.articuloListaGuardar.codigoBarra = Object.values(this.formGrupos.getRawValue())[1];
        this.articuloListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[1];
        this.articuloListaGuardar.codigoCompra = Object.values(this.formGrupos.getRawValue())[2];
        this.articuloListaGuardar.idCategoria = Object.values(this.formGrupos.getRawValue())[3];
        this.articuloListaGuardar.idCatalogo = Object.values(this.formGrupos.getRawValue())[4];

        console.info(this.articuloListaGuardar.codigoBarra);

        var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[5]);
        var d = parseInt(s);
        if (d == 1) {
            this.articuloListaGuardar.estadoArticulo = true;
        } if (d == 2) {
            this.articuloListaGuardar.estadoArticulo = false;
        }

        var sa = JSON.stringify(Object.values(this.formGrupos.getRawValue())[6]);
        var da = parseInt(sa);
        if (da == 1) {
            this.articuloListaGuardar.estadoWeb = true;
        } if (da == 2) {
            this.articuloListaGuardar.estadoWeb = false;
        }

        this.articuloListaGuardar.stockMinimo = Object.values(this.formGrupos.getRawValue())[7];
        this.articuloListaGuardar.color = Object.values(this.formGrupos.getRawValue())[8];
        this.articuloListaGuardar.marca = Object.values(this.formGrupos.getRawValue())[9];
        this.articuloListaGuardar.vidaUtil = Object.values(this.formGrupos.getRawValue())[10];

        this.articuloListaGuardar.alto = Object.values(this.formGrupos.getRawValue())[11];
        this.articuloListaGuardar.ancho = Object.values(this.formGrupos.getRawValue())[12];
        this.articuloListaGuardar.profundidad = Object.values(this.formGrupos.getRawValue())[13];
        this.articuloListaGuardar.peso = Object.values(this.formGrupos.getRawValue())[14];

        this.articuloListaGuardar.precioCosto = Object.values(this.formGrupoPrecio.getRawValue())[0];
        this.articuloListaGuardar.iva = Object.values(this.formGrupoPrecio.getRawValue())[1];
        this.articuloListaGuardar.precioIva = Object.values(this.formGrupoPrecio.getRawValue())[2];
        this.articuloListaGuardar.precioFinal = Object.values(this.formGrupoPrecio.getRawValue())[3];
        this.articuloListaGuardar.precioStandar = Object.values(this.formGrupoPrecio.getRawValue())[4];
        this.articuloListaGuardar.margenProduccion = Object.values(this.formGrupoPrecio.getRawValue())[5];
        this.articuloListaGuardar.precioProduccion = Object.values(this.formGrupoPrecio.getRawValue())[6];
        this.articuloListaGuardar.margenVenta = Object.values(this.formGrupoPrecio.getRawValue())[7];
        this.articuloListaGuardar.precioVenta = Object.values(this.formGrupoPrecio.getRawValue())[8];

        this.articuloListaGuardar.codigoBarra = Object.values(this.forGrupoCodigoBarra.getRawValue())[0];

        console.info(this.articuloListaGuardar);

        this.articuloService.putArticulo(this.articuloListaGuardar).subscribe(value => {
            this._snackBar.open('Artículo Actualizado', 'ACEPTAR');
            this.vaciarFormulario();
            this.botonParaGuardar = true;
            this.botonParaEditar = false;

            this.vaciarFormulario();
            this.mostrarLista();


        }, error => {
            this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

        })

    }

    //Convertir a base 64

    onFileSelected(event) {
        console.info(event);

        this.convertFile(event.target.files[0]).subscribe(base64 => {
            this.base64Output = base64;
            this.articuloListaGuardar.foto = base64;
            console.info("Convertido a base 64");
            console.info(base64);
            this.mostrarImagenBase();
        });

    }


    convertFile(file: File): Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (event) => result.next(btoa(event.target.result.toString()));
        return result;
    }







    //Exportaciones de documento

    exportToExcel(): void {
        let element = document.getElementById('table');
        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const book: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

        XLSX.writeFile(book, 'Lista de Articulos.xlsx');
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


        this.articuloService.getArticuloAll().subscribe(value => {
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
                        { text: 'ARTÍCULOS REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
                        { text: 'Artículos registrados ', fontSize: 15, margin: [0, 0, 20, 0] },
                        { text: '    ' },
                        {
                            table: {
                                headerRows: 1,
                                widths: ['5%', '20%', '10%', '18%', '15%', '15%', '9%', '8%'],
                                body: [
                                    ['ID', 'NOMBRE', 'CÓD. BARRA', 'CÓD. COMPRA', 'CATÉGORIA', 'CATÁLOGO', 'PRECIO VENTA', 'ESTADO'],
                                    [value.map(function (item) {
                                        return { text: item.id + '', fontSize: 10 }
                                    }),
                                    value.map(function (item) {
                                        return { text: item.nombre + '', fontSize: 10 }
                                    }),
                                    value.map(function (item) {
                                        return { text: item.codigoBarra + '', fontSize: 10 }

                                    }),
                                    value.map(function (item) {
                                        return { text: item.codigoCompra + '', fontSize: 10 }

                                    }),
                                    value.map(function (item) {
                                        return { text: item.nombreCategoria + '', fontSize: 10 }

                                    }),
                                    value.map(function (item) {
                                        return { text: item.nombreCatalogo + '', fontSize: 10 }

                                    }),
                                    value.map(function (item) {
                                        return { text: '$' + item.precioVenta.toFixed(2) + '', fontSize: 10 }

                                    }),
                                    value.map(function (item) {
                                        return { text: item.nombreEstadoArticulo + '', fontSize: 10 }

                                    }),

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

    generatePDFCodigoBarra(id: any) {
        this.loaderActualizar = true
        var pipe: DatePipe = new DatePipe('es')
        var dia: String = new Date().toISOString();





        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        this.articuloService.getArticuloId(id).subscribe(value => {

            console.info(value)

            var canvas = document.createElement('CANVAS') as HTMLCanvasElement;

            JsBarcode(canvas, value.codigoBarra);

            var img = canvas.toDataURL();

            this.usuarioService.getAllUsuarios().subscribe(async valueb => {
                //console.info(valueb)

                const pdfDefinition: any = {

                    footer: function (currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
                    header: function (currentPage, pageCount, pageSize) {

                    },

                    content: [


                        { text: '', fontSize: 15, bold: true, alignment: 'center' },
                        { text: '    ' },
                        { text: '    ' },
                        { text: value.nombre + ' $' + value.precioVenta.toFixed(2), alignment: 'center' },
                        { image: img, fontSize: 15, bold: true, alignment: 'center', width: 200 }



                    ],

                    pageOrientation: 'portrait',
                }


                this.loaderActualizar = false
                const pdf = pdfMake.createPdf(pdfDefinition);
                pdf.open();
            })
        })
    }



    generatePDFReporteArticulo(id: any) {
        this.loaderActualizar = true
        var pipe: DatePipe = new DatePipe('es')
        var dia: String = new Date().toISOString();



        this.articuloService.getArticuloId(id).subscribe(value => {




            this.usuarioService.getAllUsuarios().subscribe(async valueb => {
                console.info(valueb)

                var canvas = document.createElement('CANVAS') as HTMLCanvasElement;
                JsBarcode(canvas, value.codigoBarra);
                var img = canvas.toDataURL()

                const pdfDefinition: any = {

                    /*
                    footer: function (currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
                    header: function (currentPage, pageCount, pageSize) {

                    },*/

                    content: [
                        { image: await this.getBase64ImageFromURL('assets/images/kadapaLogo.png'), width: 100 },

                        // {
                        //    text: '_______________________________________________________________________________________________',
                        //   alignment: 'center'
                        // },
                        // @ts-ignore
                        { text: pipe.transform(dia, ' d  MMMM  y'), alignment: 'right' },
                        { text: '    ' },
                        { text: '' },


                        {
                            table: {
                                widths: ['40%', '60%'],
                                body: [
                                    [

                                        /*
                                        {

                                            image: 'data:image/jpeg;base64,' + value.foto + '',
                                            width: 198

                                        },*/

                                        {


                                            columns: [

                                                { width: '*', text: '' },
                                                {
                                                    width: '100%',
                                                    layout: 'noBorders',
                                                    table: {
                                                        body: [
                                                            [{
                                                                columns: [
                                                                    { text: '' },
                                                                ]
                                                            }],



                                                            [{
                                                                columns: [
                                                                    {
                                                                        layout: 'noBorders',
                                                                        table: {

                                                                            body: [
                                                                                [
                                                                                    {
                                                                                        columns: [
                                                                                            [


                                                                                                {

                                                                                                    image: 'data:image/jpeg;base64,' + value.foto + '',
                                                                                                    width: 180

                                                                                                },

                                                                                            ],

                                                                                        ]
                                                                                    },

                                                                                ]
                                                                            ],
                                                                        },
                                                                    },
                                                                ]
                                                            }],

                                                            [''],

                                                            [

                                                                { text: value.descripcion, alignment: 'justify ' }],


                                                            [{
                                                                columns: [
                                                                    {
                                                                        layout: 'noBorders',
                                                                        table: {

                                                                            body: [
                                                                                [
                                                                                    {
                                                                                        columns: [
                                                                                            [
                                                                                                { text: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 ', alignment: 'left', color: '#FFFFFF', fontSize: 2 },

                                                                                                { text: 'Medidas: ', alignment: 'center', bold: 'true' },
                                                                                                {
                                                                                                    layout: 'noBorders',

                                                                                                    table: {

                                                                                                        body: [
                                                                                                            /*
                                                                                                            [
                                                                                                                { text: 'Alto: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.alto, alignment: 'left' },
                                                                                                                { text: 'Ancho: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.ancho, alignment: 'left' },
                                                                                                            ],
                                                                                                            
                                                                                                            [
                                                                                                                { text: 'Prof: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.profundidad, alignment: 'left' },
                                                                                                                { text: 'Peso: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.peso, alignment: 'left' },

                                                                                                            ],*/

                                                                                                            [
                                                                                                                { text: 'Alto: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.alto, alignment: 'left' },

                                                                                                            ],

                                                                                                            [

                                                                                                                { text: 'Ancho: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.ancho, alignment: 'left' },
                                                                                                            ],

                                                                                                            [
                                                                                                                { text: 'Prof: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.profundidad, alignment: 'left' },


                                                                                                            ],


                                                                                                            [

                                                                                                                { text: 'Peso: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.peso, alignment: 'left' },

                                                                                                            ]


                                                                                                        ]
                                                                                                    }
                                                                                                }

                                                                                            ],

                                                                                        ]
                                                                                    },

                                                                                ]
                                                                            ],
                                                                        },
                                                                    },
                                                                ]
                                                            }],





                                                            [' '],
                                                            // ['Column 1'],

                                                        ]
                                                    },
                                                },

                                                { width: '*', text: '' },




                                            ]




                                        },

                                        {


                                            columns: [

                                                { width: '*', text: '' },
                                                {
                                                    width: '85%',
                                                    layout: 'noBorders',
                                                    table: {
                                                        body: [
                                                            [{
                                                                columns: [
                                                                    { text: value.nombre, alignment: 'center', bold: 'true', fontSize: 14 },
                                                                ]
                                                            }],



                                                            [{
                                                                columns: [
                                                                    {
                                                                        table: {

                                                                            body: [
                                                                                [
                                                                                    {
                                                                                        columns: [
                                                                                            [
                                                                                                { text: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 ', alignment: 'left', color: '#FFFFFF', fontSize: 2 },

                                                                                                { image: img, fontSize: 15, bold: true, alignment: 'center', width: 185 },
                                                                                            ],

                                                                                        ]
                                                                                    },

                                                                                ]
                                                                            ],
                                                                        },
                                                                    },
                                                                ]
                                                            }],

                                                            [''],

                                                            
                                                            [{
                                                                columns: [
                                                                    {
                                                                        table: {

                                                                            body: [
                                                                                [
                                                                                    {
                                                                                        columns: [
                                                                                            [
                                                                                                { text: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 ', alignment: 'left', color: '#FFFFFF', fontSize: 2 },

                                                                                                {
                                                                                                    layout: 'noBorders',
                                                                                                    table: {

                                                                                                        body: [
                                                                                                            [
                                                                                                                { text: 'Categoría: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.nombreCategoria, alignment: 'left' },
                                                                                                            ],
                                                                                                            [
                                                                                                                { text: 'Catálogo: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.nombreCatalogo, alignment: 'left' },
                                                                                                            ],


                                                                                                            [
                                                                                                                { text: 'Cod. Compra: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.codigoCompra, alignment: 'left' },

                                                                                                            ],
                                                                                                            [
                                                                                                                { text: 'Web: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: value.nombreEstadoWeb, alignment: 'left' },

                                                                                                            ],

                                                                                                        ]
                                                                                                    }
                                                                                                }

                                                                                            ],

                                                                                        ]
                                                                                    },

                                                                                ]
                                                                            ],
                                                                        },
                                                                    },
                                                                ]
                                                            }],

                                                            [{
                                                                columns: [
                                                                    {
                                                                        table: {

                                                                            body: [
                                                                                [
                                                                                    {
                                                                                        columns: [
                                                                                            [
                                                                                                { text: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 ', alignment: 'left', color: '#FFFFFF', fontSize: 2 },

                                                                                                {
                                                                                                    layout: 'noBorders',
                                                                                                    table: {

                                                                                                        body: [
                                                                                                            [
                                                                                                                { text: 'Pre. Costo: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: '$' + value.precioCosto.toFixed(2), alignment: 'left' },
                                                                                                            ],
                                                                                                            [
                                                                                                                { text: 'Pre. Producción: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: '$' + value.precioProduccion.toFixed(2), alignment: 'left' },

                                                                                                            ],
                                                                                                            [
                                                                                                                { text: 'Pre. Venta: ', alignment: 'left', bold: 'true' },
                                                                                                                { text: '$' + value.precioVenta.toFixed(2), alignment: 'left' },

                                                                                                            ],

                                                                                                        ]
                                                                                                    }
                                                                                                }

                                                                                            ],

                                                                                        ]
                                                                                    },

                                                                                ]
                                                                            ],
                                                                        },
                                                                    },
                                                                ]
                                                            }],



                                                            [{
                                                                columns: [
                                                                    {
                                                                        table: {

                                                                            body: [
                                                                                [
                                                                                    {
                                                                                        columns: [
                                                                                            [
                                                                                                { text: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 ', alignment: 'left', color: '#FFFFFF', fontSize: 2 },

                                                                                                { text: 'PROVEEDORES', bold: 'true', alignment: 'center' },
                                                                                                {
                                                                                                    layout: 'noBorders',
                                                                                                    table: {

                                                                                                        body: [
                                                                                                            [
                                                                                                                { text: 'NOMBRE', alignment: 'left', bold: 'true' },
                                                                                                                { text: 'TELEFONO', alignment: 'left', bold: 'true' },
                                                                                                            ],
                                                                                                            [
                                                                                                                { text: '------', alignment: 'left', },
                                                                                                                { text: '------', alignment: 'left' },

                                                                                                            ],

                                                                                                        ]
                                                                                                    }
                                                                                                }

                                                                                            ],

                                                                                        ]
                                                                                    },

                                                                                ]
                                                                            ],
                                                                        },
                                                                    },
                                                                ]
                                                            }],

                                                            [' '],
                                                            // ['Column 1'],

                                                        ]
                                                    },
                                                },

                                                { width: '*', text: '' },




                                            ]




                                        }



                                    ]
                                ]
                            }
                        },


                        { text: '    ' },
                        { text: '    ' },


                        /*
                        {
                            table: {
                                headerRows: 1,
                                widths: ['100%'],
                                heights: 20,
                                body: [
                                    ['USUARIO/A: ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().nombres + ' ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().apellidos],

                                ]
                            },
                        },*/



                    ],

                    pageOrientation: 'portrait',
                }


                this.loaderActualizar = false
                const pdf = pdfMake.createPdf(pdfDefinition);
                pdf.open();
            })
        })
    }


    /////CALCULAR

    public apreciocosto: any;
    public aiva: any;
    public aprecioiva: any;
    public apreciofinal: any;
    public aprecioestandar: any;
    public amargenproduccion: any;
    public aprecioproduccion: any;
    public amargenventa: any;
    public aprecioventa: any;

    public preiva: any;
    public prefiniva: any;
    public preprodu: any;
    public preventa: any;

    public calcularValorTabla(condicion: any) {
        this.apreciocosto = Number(Object.values(this.formGrupoPrecio.getRawValue())[0]);
        this.aiva = Number(Object.values(this.formGrupoPrecio.getRawValue())[1]);
        this.aprecioiva = Number(Object.values(this.formGrupoPrecio.getRawValue())[2]);
        this.apreciofinal = Number(Object.values(this.formGrupoPrecio.getRawValue())[3]);
        this.aprecioestandar = Number(Object.values(this.formGrupoPrecio.getRawValue())[4]);
        this.amargenproduccion = Number(Object.values(this.formGrupoPrecio.getRawValue())[5]);
        this.aprecioproduccion = Number(Object.values(this.formGrupoPrecio.getRawValue())[6]);
        this.amargenventa = Number(Object.values(this.formGrupoPrecio.getRawValue())[7]);
        this.aprecioventa = Number(Object.values(this.formGrupoPrecio.getRawValue())[8]);

        if (condicion == 1) {
            this.preiva = (this.apreciocosto * (this.aiva / 100));
            this.prefiniva = this.preiva + this.apreciocosto;
            this.preprodu = this.prefiniva / (this.amargenproduccion / 100);
            this.preventa = this.prefiniva / (this.amargenventa / 100);

            this.formGrupoPrecio.setValue({
                preciocosto: this.apreciocosto.toFixed(2),
                iva: this.aiva,
                precioiva: this.preiva.toFixed(2),
                preciofinal: this.prefiniva.toFixed(2),
                precioestandar: this.prefiniva.toFixed(2),
                margenproduccion: this.amargenproduccion,
                precioproduccion: this.preprodu.toFixed(2),
                margenventa: this.amargenventa.toFixed(2),
                precioventa: this.preventa.toFixed(2),

            })

        }

        if (condicion == 2) {
            this.preprodu = this.aprecioestandar / (this.amargenproduccion / 100);
            this.preventa = this.aprecioestandar / (this.amargenventa / 100);

            this.formGrupoPrecio.setValue({
                preciocosto: this.apreciocosto.toFixed(2),
                iva: this.aiva,
                precioiva: this.aprecioiva.toFixed(2),
                preciofinal: this.apreciofinal.toFixed(2),
                precioestandar: this.aprecioestandar.toFixed(2),
                margenproduccion: this.amargenproduccion.toFixed(2),
                precioproduccion: this.preprodu.toFixed(2),
                margenventa: this.amargenventa.toFixed(2),
                precioventa: this.preventa.toFixed(2),

            })
        }

        if (condicion == 3) {

            this.amargenproduccion = (this.aprecioestandar / this.aprecioproduccion) * 100;
            this.amargenventa = (this.aprecioestandar / this.aprecioventa) * 100;

            this.formGrupoPrecio.setValue({
                preciocosto: this.apreciocosto.toFixed(2),
                iva: this.aiva,
                precioiva: this.aprecioiva.toFixed(2),
                preciofinal: this.apreciofinal.toFixed(2),
                precioestandar: this.aprecioestandar.toFixed(2),
                margenproduccion: this.amargenproduccion.toFixed(2),
                precioproduccion: this.aprecioproduccion.toFixed(2),
                margenventa: this.amargenventa.toFixed(2),
                precioventa: this.aprecioventa.toFixed(2),

            })

        }

        if (condicion == 4) {


            this.preprodu = this.aprecioestandar / (this.amargenproduccion / 100);
            this.preventa = this.aprecioestandar / (this.amargenventa / 100);

            this.formGrupoPrecio.setValue({
                preciocosto: this.apreciocosto.toFixed(2),
                iva: this.aiva,
                precioiva: this.aprecioiva.toFixed(2),
                preciofinal: this.apreciofinal.toFixed(2),
                precioestandar: this.aprecioestandar.toFixed(2),
                margenproduccion: this.amargenproduccion.toFixed(2),
                precioproduccion: this.preprodu.toFixed(2),
                margenventa: this.amargenventa.toFixed(2),
                precioventa: this.preventa.toFixed(2),

            })

        }




    }




    vaciarFormualarioPrecio() {

        this.formGrupoPrecio.setValue({
            preciocosto: "0",
            iva: "12",
            precioiva: "0",
            preciofinal: "0",
            precioestandar: "0",
            margenproduccion: "100",
            precioproduccion: "0",
            margenventa: "100",
            precioventa: "0",
        })

    }


    codigodeBarra() {
        JsBarcode("#barcode", "ASDF00001");




        /*
        var canvas = document.createElement('CANVAS') as HTMLCanvasElement;
        JsBarcode(canvas, 'ASDF00001');
        var img = canvas.toDataURL();
    
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
    
        var dd = {
            content: [
                { image: img }
            ]
        };
    
        pdfMake.createPdf(dd).download();*/
    }




}