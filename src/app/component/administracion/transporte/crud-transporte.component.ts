import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sucursal } from 'src/app/models/sucursal';
import { Catalogo } from 'src/app/models/catalogo';
import { CategoriaService } from 'src/app/services/categoria.service';
import { EstadoFD } from 'src/app/models/estado';
import { UsuarioService } from 'src/app/services/usuario.service';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from "@angular/common";
import { cedula } from 'src/environments/environment';
import { Transporte } from 'src/app/models/transporte';
import { TransporteService } from 'src/app/services/transporte.service';

@Component({
  selector: 'app-crud-transporte',
  templateUrl: './crud-transporte.component.html',
  styleUrls: ['./crud-transporte.component.css'],


})

export class CrudTransporteComponent implements OnInit {



  //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  public idTransporte: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;

  public imagenFijo: Boolean = true;
  public imagenBase: Boolean = false;

  public numeroControl: number = 1;

  loaderActualizar: boolean;


  base64Output: string;


  public transporteListaGuardar: Transporte = new Transporte();
  public transpoerteLista: Transporte[] = [];
  public estadoLista: EstadoFD[] = [{ id: 1, nombres: 'Activo', value: 'true' }, { id: 2, nombres: 'Inactivo', value: 'false' }];




  formGrupos = new FormGroup({
    nombres: new FormControl<String>('', [Validators.required]),
    inicial: new FormControl<String>('', [Validators.required]),
    estado: new FormControl<String>('', [Validators.required]),


  })



  displayedColumns: string[] = ['id', 'nombre', 'logo', 'estado', 'documento'];
  dataSource: MatTableDataSource<Transporte>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _snackBar: MatSnackBar,
    private transporteService: TransporteService,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
  ) {
  }

  ngOnInit(): void {
    this.listarInformacion();

  }



  public mostrarImagenBase() {
    this.imagenFijo = false;
    this.imagenBase = true;
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
      inicial: "",
      estado: '',

    })

  }



  //LISTAR

  public listarInformacion() {
    this.loaderActualizar = true;

    this.transporteService.getTransporteAll().subscribe(value => {

      this.transpoerteLista = value;


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

    this.transporteListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.transporteListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[1];
    this.transporteListaGuardar.estado = Object.values(this.formGrupos.getRawValue())[2];


    this.transporteService.createTransporte(this.transporteListaGuardar).subscribe(value => {
      this._snackBar.open('Transporte Creado', 'ACEPTAR');

      this.vaciarFormulario();
      this.mostrarLista();

    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

    })




  }


  ////Editar

  editarInformacion(id: any, nombre: any, descripcion: any, estado: any) {

    
    this.idTransporte = id;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;

    if (estado == true) {
      this.transporteListaGuardar.estado = 1;

    } if (estado == false) {
      this.transporteListaGuardar.estado = 2;

    }

    this.formGrupos.setValue({
      nombres: nombre,
      inicial: descripcion,
      estado: this.transporteListaGuardar.estado,
    })

    this.mostrarNuevo();
    this.numeroControl = 3;


    this.transporteListaGuardar.id = this.idTransporte;

    this.transporteListaGuardar.descripcion = descripcion;


  }


  public guardarEditarInformacion() {

    
    this.transporteListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.transporteListaGuardar.descripcion = Object.values(this.formGrupos.getRawValue())[1];


    var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[2]);  // [{"Spalte":3}] as String
    var d = parseInt(s); // typeof d = number, 

    if (d == 1) {
      this.transporteListaGuardar.estado = true;
    } if (d == 2) {
      this.transporteListaGuardar.estado = false;
    }

    console.info(this.transporteListaGuardar);

    this.transporteService.putTransporte(this.transporteListaGuardar).subscribe(value => {
      this._snackBar.open('Transporte Actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;

      this.vaciarFormulario();
      //this.listarEventoSinParticipantes();
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

    XLSX.writeFile(book, 'Lista de Transporte.xlsx');
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


    this.transporteService.getTransporteAll().subscribe(value => {
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
            { text: 'TRANSPORTES REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Categorias registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['4%', '27%', '52%', '17%'],
                body: [
                  ['ID', 'NOMBRE', 'DESCRIPCIÓN', 'ESTADO'],
                  [value.map(function (item) {
                    return { text: item.id + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.nombre + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.descripcion + '', fontSize: 11 }

                  }),
                  value.map(function (item) {
                    return { text: item.nombreEstado + '', fontSize: 11 }

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