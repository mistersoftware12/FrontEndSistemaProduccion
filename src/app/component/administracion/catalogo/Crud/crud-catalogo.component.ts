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
import { EstadoFD } from 'src/app/models/estado';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from "@angular/common";
import { UsuarioService } from 'src/app/services/usuario.service';
import { cedula } from 'src/environments/environment';

@Component({
  selector: 'app-crud-catalogo.component',
  templateUrl: './crud-catalogo.component.html',
  styleUrls: ['./crud-catalogo.component.css'],


})

export class CrudCatalogoComponent implements OnInit {

  //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  public idCatalogo: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;

  public imagenFijo: Boolean = true;
  public imagenBase: Boolean = false;

  public numeroControl: number = 1;

  loaderActualizar: boolean;


  base64Output: string;


  public catalogoListaGuardar: Catalogo = new Catalogo();
  public catalogolLista: Catalogo[] = [];
  public estadoLista: EstadoFD[] = [{ id: 1, nombres: 'Activo', value: 'true' }, { id: 2, nombres: 'Inactivo', value: 'false' }];


  formGrupos = new FormGroup({
    nombres: new FormControl<String>('', [Validators.required]),
    inicial: new FormControl<String>('', [Validators.required]),


  })



  displayedColumns: string[] = ['id', 'nombre', 'logo', 'documento'];
  dataSource: MatTableDataSource<Sucursal>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _snackBar: MatSnackBar,
    private empresaService: EmpresaService,
    private catalogoService: CatalogoService,
    private usuarioService: UsuarioService,
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

    })

  }



  //LISTAR

  public listarInformacion() {



    this.catalogoService.getCatalogoAll().subscribe(value => {

      this.catalogolLista = value;


      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

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

    this.catalogoListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];

    var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[1]);  // [{"Spalte":3}] as String
    var d = parseInt(s); // typeof d = number, 

    if (d == 1) {
      this.catalogoListaGuardar.estado = true;
    } if (d == 2) {
      this.catalogoListaGuardar.estado = false;
    }


    this.catalogoService.createCatalogo(this.catalogoListaGuardar).subscribe(value => {
      this._snackBar.open('Catalogo Creado', 'ACEPTAR');

      this.vaciarFormulario();
      this.mostrarLista();

    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

    })




  }


  ////Editar

  editarInformacion(id: any, nombre: any, estado: any) {

    this.idCatalogo = id;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;

    if (estado == true) {
      this.catalogoListaGuardar.estado = 1;

    } if (estado == false) {
      this.catalogoListaGuardar.estado = 2;

    }


    this.formGrupos.setValue({
      nombres: nombre,
      inicial: this.catalogoListaGuardar.estado,
    })

    this.mostrarNuevo();
    this.numeroControl = 3;


    this.catalogoListaGuardar.id = this.idCatalogo;

    this.catalogoListaGuardar.estado = estado;




  }


  public guardarEditarInformacion() {

    this.catalogoListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];


    var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[1]);  // [{"Spalte":3}] as String
    var d = parseInt(s); // typeof d = number, 

    if (d == 1) {
      this.catalogoListaGuardar.estado = true;
    } if (d == 2) {
      this.catalogoListaGuardar.estado = false;
    }

    console.info(this.catalogoListaGuardar);

    this.catalogoService.putCatalogo(this.catalogoListaGuardar).subscribe(value => {
      this._snackBar.open('Catalogo Actualizado', 'ACEPTAR');
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

    XLSX.writeFile(book, 'Lista de Catálogos.xlsx');
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

    this.catalogoService.getCatalogoAll().subscribe(value => {
      console.info(value)
      this.catalogolLista = value;

      for (var k = 0; k < this.catalogolLista.length; k++) {

        if (this.catalogolLista[k].estado == true) {
          this.catalogolLista[k].inicialCodigo = "Activo";
        }

        if (this.catalogolLista[k].estado == false) {
          this.catalogolLista[k].inicialCodigo = "Inactivo";
        }
      }

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
            { text: 'CATÁLOGOS REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
            { text: 'Catálogos registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['5%', '75%', '20%'],
                body: [
                  ['ID', 'NOMBRE', 'ESTADO'],
                  [this.catalogolLista.map(function (item) {
                    return { text: item.id + '', fontSize: 12 }
                  }),
                  this.catalogolLista.map(function (item) {
                    return { text: item.nombre + '', fontSize: 12 }
                  }),
                  this.catalogolLista.map(function (item) {

                    return { text: item.inicialCodigo + '', fontSize: 12 }


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