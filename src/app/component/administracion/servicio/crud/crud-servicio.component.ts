import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sucursal } from 'src/app/models/sucursal';
import { EstadoFD } from 'src/app/models/estado';
import { UsuarioService } from 'src/app/services/usuario.service';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from "@angular/common";
import { cedula } from 'src/environments/environment';
import { ArticuloService } from 'src/app/services/articulo.service';
import { Articulo } from 'src/app/models/articulo';
import { ServicioService } from 'src/app/services/servicio.service';
import { Servicio } from 'src/app/models/servicio';


@Component({
    selector: 'app-crud-servicio',
    templateUrl: './crud-servicio.component.html',
    styleUrls: ['./crud-servicio.component.css'],


})

export class CrudServicioComponent implements OnInit {

    panelOpenState = false;

    //Control de pantallas
    public sectionTablaLista: Boolean = true;
    public sectionCrudDatos: Boolean = false;


    public idServicio: any;
    public botonParaGuardar: Boolean = true;
    public botonParaEditar: Boolean = false;


    public numeroControl: number = 1;

    loaderActualizar: boolean;


    public codigoBarra: string = "sasa";

    public servicioListaGuardar: Servicio = new Servicio();


    public servicioLista: Servicio[] = [];


    public estadoLista: EstadoFD[] = [{ id: 1, nombres: 'Activo', value: 'true' }, { id: 2, nombres: 'Inactivo', value: 'false' }];




    formGrupos = new FormGroup({
        nombres: new FormControl<String>('', [Validators.required]),
        estadoarticulo: new FormControl<String>('', [Validators.required]),



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
        private usuarioService: UsuarioService,
        private articuloService: ArticuloService,
        private servicioService: ServicioService,

    ) {
    }

    ngOnInit(): void {
        this.listarInformacion();

    }







    public mostrarNuevo() {

        if (this.botonParaGuardar == true) {
            this.generaCodigo();
        }



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
            estadoarticulo: "",


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
        this.loaderActualizar = true;

        this.servicioService.getServicioAll().subscribe(value => {

            this.servicioLista = value;

            this.dataSource = new MatTableDataSource(value);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loaderActualizar = false;
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


        this.servicioListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];

        var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[1]);
        var d = parseInt(s);
        if (d == 1) {
            this.servicioListaGuardar.estado = true;
        } if (d == 2) {
            this.servicioListaGuardar.estado = false;
        }



        this.servicioListaGuardar.precioCosto = Object.values(this.formGrupoPrecio.getRawValue())[0];
        this.servicioListaGuardar.iva = Object.values(this.formGrupoPrecio.getRawValue())[1];
        this.servicioListaGuardar.precioIva = Object.values(this.formGrupoPrecio.getRawValue())[2];
        this.servicioListaGuardar.precioFinal = Object.values(this.formGrupoPrecio.getRawValue())[3];
        this.servicioListaGuardar.precioStandar = Object.values(this.formGrupoPrecio.getRawValue())[4];
        this.servicioListaGuardar.margenProduccion = Object.values(this.formGrupoPrecio.getRawValue())[5];
        this.servicioListaGuardar.precioProduccion = Object.values(this.formGrupoPrecio.getRawValue())[6];
        this.servicioListaGuardar.margenVenta = Object.values(this.formGrupoPrecio.getRawValue())[7];
        this.servicioListaGuardar.precioVenta = Object.values(this.formGrupoPrecio.getRawValue())[8];



        this.servicioListaGuardar.codigo_barra = Object.values(this.forGrupoCodigoBarra.getRawValue())[0];



        this.servicioService.createServicio(this.servicioListaGuardar).subscribe(value => {
            this._snackBar.open('Servicio Creado', 'ACEPTAR');

            this.vaciarFormulario();
            this.mostrarLista();
            this.listarInformacion();



        }, error => {
            this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

        })



    }




    //Generar Código

    generaCodigo() {


        this.servicioService.getMaximoRegistroCodigo().subscribe(value => {

            this.forGrupoCodigoBarra.setValue({
                codigobarra: value.maximoDato,

            })



        })

    }


    ////Editar

    editarInformacion(id: any) {

        this.idServicio = id;
        this.botonParaGuardar = false;
        this.botonParaEditar = true;





        this.servicioService.getServicioId(id).subscribe(value1 => {

            console.info(value1);

            if (value1.estado == true) {
                this.servicioListaGuardar.estado = 1;


            } if (value1.estado == false) {
                this.servicioListaGuardar.estado = 2;

            }



            this.formGrupos.setValue({
                nombres: value1.nombre,
                estadoarticulo: this.servicioListaGuardar.estado,



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
                codigobarra: value1.codigo_barra,

            })


            this.numeroControl = 3;
            this.servicioListaGuardar.id = this.idServicio;





        })

        this.mostrarNuevo();





    }


    public guardarEditarInformacion() {


        this.servicioListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];



        var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[1]);
        var d = parseInt(s);
        if (d == 1) {
            this.servicioListaGuardar.estado = true;
        } if (d == 2) {
            this.servicioListaGuardar.estado = false;
        }


        this.servicioListaGuardar.precioCosto = Object.values(this.formGrupoPrecio.getRawValue())[0];
        this.servicioListaGuardar.iva = Object.values(this.formGrupoPrecio.getRawValue())[1];
        this.servicioListaGuardar.precioIva = Object.values(this.formGrupoPrecio.getRawValue())[2];
        this.servicioListaGuardar.precioFinal = Object.values(this.formGrupoPrecio.getRawValue())[3];
        this.servicioListaGuardar.precioStandar = Object.values(this.formGrupoPrecio.getRawValue())[4];
        this.servicioListaGuardar.margenProduccion = Object.values(this.formGrupoPrecio.getRawValue())[5];
        this.servicioListaGuardar.precioProduccion = Object.values(this.formGrupoPrecio.getRawValue())[6];
        this.servicioListaGuardar.margenVenta = Object.values(this.formGrupoPrecio.getRawValue())[7];
        this.servicioListaGuardar.precioVenta = Object.values(this.formGrupoPrecio.getRawValue())[8];

        this.servicioListaGuardar.codigo_barra = Object.values(this.forGrupoCodigoBarra.getRawValue())[0];


        this.servicioService.putServicio(this.servicioListaGuardar).subscribe(value => {
            this._snackBar.open('Servicio Actualizado', 'ACEPTAR');


            this.vaciarFormulario();
            this.botonParaGuardar = true;
            this.botonParaEditar = false;

            this.vaciarFormulario();
            this.mostrarLista();


        }, error => {
            this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

        })

    }




    //Exportaciones de documento

    exportToExcel(): void {
        let element = document.getElementById('table');
        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const book: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

        XLSX.writeFile(book, 'Lista de Servicios.xlsx');
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


        this.servicioService.getServicioAll().subscribe(value => {
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
                        { text: 'SERVICIOS REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
                        { text: 'Servicios registrados ', fontSize: 15, margin: [0, 0, 20, 0] },
                        { text: '    ' },
                        {
                            table: {
                                headerRows: 1,
                                widths: ['5%', '20%', '47%', '14%', '14%'],
                                body: [
                                    ['ID', 'CÓD. BARRA','NOMBRE',  'PRECIO VENTA', 'ESTADO'],
                                    [value.map(function (item) {
                                        return { text: item.id + '', fontSize: 10 }
                                    }),
                                    value.map(function (item) {
                                        return { text: item.codigo_barra + '', fontSize: 10 }

                                    }),
                                    value.map(function (item) {
                                        return { text: item.nombre + '', fontSize: 10 }
                                    }),
                                   

                                    value.map(function (item) {
                                        return { text: '$' + item.precioVenta.toFixed(2) + '', fontSize: 10 }

                                    }),
                                    value.map(function (item) {
                                        return { text: item.nombreEstado + '', fontSize: 10 }

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










}