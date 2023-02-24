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
    public botonParaGuardar: Boolean = true;
    public botonParaEditar: Boolean = false;

    public imagenFijo: Boolean = true;
    public imagenBase: Boolean = false;

    public numeroControl: number = 1;

    loaderActualizar: boolean;


    base64Output: string;


    public articuloListaGuardar: Articulo = new Articulo();
    public articuloLista: Articulo[] = [];
    public catalogoLista: Catalogo[] = [];
    public categoriaLista: Categoria[] = [];


    public estadoLista: EstadoFD[] = [{ id: 1, nombres: 'Activo', value: 'true' }, { id: 2, nombres: 'Inactivo', value: 'false' }];




    formGrupos = new FormGroup({
        nombres: new FormControl<String>('', [Validators.required]),
        codigobarra: new FormControl<String>('', [Validators.required]),
        descripcion: new FormControl<String>('', [Validators.required]),
        codigocompra: new FormControl<String>('', [Validators.required]),
        categoria: new FormControl<String>('', [Validators.required]),
        catalogo: new FormControl<String>('', [Validators.required]),
        estadoarticulo: new FormControl<String>('', [Validators.required]),
        estadoweb: new FormControl<String>('', [Validators.required]),
        stockminimo: new FormControl<String>('', [Validators.required]),
        color: new FormControl<String>('', [Validators.required]),
        marca: new FormControl<String>('', [Validators.required]),
        vidautil: new FormControl<String>('', [Validators.required]),

        alto: new FormControl<String>('', [Validators.required]),
        ancho: new FormControl<String>('', [Validators.required]),
        profundidad: new FormControl<String>('', [Validators.required]),
        peso: new FormControl<String>('', [Validators.required]),

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



    displayedColumns: string[] = ['id', 'nombre', 'logo', 'estado', 'stockminimo', 'documento'];
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
            codigobarra: "",
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
        this.articuloListaGuardar.codigoBarra = Object.values(this.formGrupos.getRawValue())[1];
        this.articuloListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[2];
        this.articuloListaGuardar.codigoCompra = Object.values(this.formGrupos.getRawValue())[3];
        this.articuloListaGuardar.idCategoria = Object.values(this.formGrupos.getRawValue())[4];
        this.articuloListaGuardar.idCatalogo = Object.values(this.formGrupos.getRawValue())[5];

        var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[6]);
        var d = parseInt(s);
        if (d == 1) {
            this.articuloListaGuardar.estadoArticulo = true;
        } if (d == 2) {
            this.articuloListaGuardar.estadoArticulo = false;
        }

        var sa = JSON.stringify(Object.values(this.formGrupos.getRawValue())[7]);
        var da = parseInt(sa);
        if (da == 1) {
            this.articuloListaGuardar.estadoWeb = true;
        } if (da == 2) {
            this.articuloListaGuardar.estadoWeb = false;
        }

        this.articuloListaGuardar.stockMinimo = Object.values(this.formGrupos.getRawValue())[8];
        this.articuloListaGuardar.color = Object.values(this.formGrupos.getRawValue())[9];
        this.articuloListaGuardar.marca = Object.values(this.formGrupos.getRawValue())[10];
        this.articuloListaGuardar.vidaUtil = Object.values(this.formGrupos.getRawValue())[11];

        this.articuloListaGuardar.alto = Object.values(this.formGrupos.getRawValue())[12];
        this.articuloListaGuardar.ancho = Object.values(this.formGrupos.getRawValue())[13];
        this.articuloListaGuardar.profundidad = Object.values(this.formGrupos.getRawValue())[14];
        this.articuloListaGuardar.peso = Object.values(this.formGrupos.getRawValue())[15];

        this.articuloListaGuardar.precioCosto = Object.values(this.formGrupos.getRawValue())[16];
        this.articuloListaGuardar.iva = Object.values(this.formGrupos.getRawValue())[17];
        this.articuloListaGuardar.precioIva = Object.values(this.formGrupos.getRawValue())[18];
        this.articuloListaGuardar.precioFinal = Object.values(this.formGrupos.getRawValue())[19];
        this.articuloListaGuardar.precioStandar = Object.values(this.formGrupos.getRawValue())[20];
        this.articuloListaGuardar.margenProduccion = Object.values(this.formGrupos.getRawValue())[21];
        this.articuloListaGuardar.precioProduccion = Object.values(this.formGrupos.getRawValue())[22];
        this.articuloListaGuardar.margenVenta = Object.values(this.formGrupos.getRawValue())[23];
        this.articuloListaGuardar.precioVenta = Object.values(this.formGrupos.getRawValue())[24];


        console.info(this.articuloListaGuardar);

        this.articuloService.createArticulo(this.articuloListaGuardar).subscribe(value => {
            this._snackBar.open('Articulo Creado', 'ACEPTAR');

            this.vaciarFormulario();
            this.mostrarLista();

        }, error => {
            this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

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

           




            this.formGrupos.setValue({
                nombres: value1.nombre,
                codigobarra: value1.codigoBarra,
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

                alto: value1.ancho,
                ancho: value1.ancho,
                profundidad: value1.profundidad,
                peso: value1.peso,

                preciocosto: value1.precioCosto,
                iva: value1.iva,
                precioiva: value1.precioIva,
                preciofinal: value1.precioFinal,
                precioestandar: value1.precioStandar,
                margenproduccion: value1.margenProduccion,
                precioproduccion: value1.precioProduccion,
                margenventa: value1.margenVenta,
                precioventa: value1.precioVenta,
            })


        })


       

        this.mostrarNuevo();
        this.numeroControl = 3;
        this.articuloListaGuardar.id = this.idArticulo;


    }


    public guardarEditarInformacion() {
        /*
    
        this.articuloListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
        this.articuloListaGuardar.inicialCodigo = Object.values(this.formGrupos.getRawValue())[1];
    
    
        var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[2]);  // [{"Spalte":3}] as String
        var d = parseInt(s); // typeof d = number, 
    
        if (d == 1) {
          this.articuloListaGuardar.estado = true;
        } if (d == 2) {
          this.articuloListaGuardar.estado = false;
        }
    
        console.info(this.articuloListaGuardar);
    
        this.categoriaService.putCategoria(this.articuloListaGuardar).subscribe(value => {
          this._snackBar.open('Categoria Actualizado', 'ACEPTAR');
          this.vaciarFormulario();
          this.botonParaGuardar = true;
          this.botonParaEditar = false;
    
          this.vaciarFormulario();
          //this.listarEventoSinParticipantes();
          this.mostrarLista();
    
    
        }, error => {
          this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    
        })*/
    }

    //Convertir a base 64

    onFileSelected(event) {
        console.info(event);

        this.convertFile(event.target.files[0]).subscribe(base64 => {
            this.base64Output = base64;
            this.articuloListaGuardar.foto = base64;
            console.info("Convertido a base 64");
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


        this.categoriaService.getCategoriaAll().subscribe(value => {
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
                        { text: 'CATEGORIAS REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
                        { text: 'Categorias registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
                        { text: '    ' },
                        {
                            table: {
                                headerRows: 1,
                                widths: ['4%', '52%', '27%', '17%'],
                                body: [
                                    ['ID', 'NOMBRE', 'INICIAL CÓDIGO', 'ESTADO'],
                                    [value.map(function (item) {
                                        return { text: item.id + '', fontSize: 12 }
                                    }),
                                    value.map(function (item) {
                                        return { text: item.nombre + '', fontSize: 12 }
                                    }),
                                    value.map(function (item) {
                                        return { text: item.inicialCodigo + '', fontSize: 12 }

                                    }),
                                    value.map(function (item) {
                                        return { text: item.nombreEstado + '', fontSize: 12 }

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

}