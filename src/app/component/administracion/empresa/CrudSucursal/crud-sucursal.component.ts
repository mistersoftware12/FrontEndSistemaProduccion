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


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from "@angular/common";
import { cedula } from 'src/environments/environment';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-crud-sucursal',
  templateUrl: './crud-sucursal.component.html',
  styleUrls: ['./crud-sucursal.component.css'],


})

export class CrudSucursalComponent implements OnInit {

  //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  public idSucursal: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;

  public imagenFijo: Boolean = true;
  public imagenBase: Boolean = false;

  public numeroControl: number = 1;

  loaderActualizar: boolean;


  base64Output: string;


  public sucursalListaGuardar: Sucursal = new Sucursal();
  public sucursalLista: Sucursal[] = [];


  formGrupos = new FormGroup({
    nombres: new FormControl<String>('', [Validators.required]),
    responsable: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),

  })



  displayedColumns: string[] = ['id', 'nombre', 'logo', 'documento'];
  dataSource: MatTableDataSource<Sucursal>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _snackBar: MatSnackBar,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
  ) {
  }

  ngOnInit(): void {
    this.listarInformacion();

  }

  public mostrarImagenFijo() {
    this.imagenFijo = true;
    this.imagenBase = false;
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

    this.mostrarImagenFijo();
    this.mostrarLista();
    this.vaciarFormulario();
    this.botonParaGuardar = true;
    this.botonParaEditar = false;
    this.numeroControl = 1;

  }

  vaciarFormulario() {
    this.formGrupos.setValue({
      nombres: "",
      responsable: "",

    })

  }



  //LISTAR

  public listarInformacion() {



    this.empresaService.getSucursalAll().subscribe(value => {

      this.sucursalLista = value;


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

    this.sucursalListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.sucursalListaGuardar.logo = Object.values(this.formGrupos.getRawValue())[1];

    this.empresaService.createSucursal(this.sucursalListaGuardar).subscribe(value => {
      this._snackBar.open('Sucursal Creado', 'ACEPTAR');

      this.vaciarFormulario();
      //this.listarEventoSinParticipantes();
      this.mostrarLista();
      this.mostrarImagenFijo();

    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

    })




  }


  ////Editar

  editarInformacion(id: any, nombre: any, responsable: any) {

    this.idSucursal = id;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;

    //this.base64Output = logo;
    //this.imagenFijo = false;
    //this.imagenBase = true;




    this.formGrupos.setValue({
      nombres: nombre,
      responsable: responsable
    })
    this.mostrarNuevo();
    this.numeroControl = 3;


    this.sucursalListaGuardar.id = this.idSucursal;

    //this.sucursalListaGuardar.logo = logo;




  }


  public guardarEditarInformacion() {

    this.sucursalListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.sucursalListaGuardar.logo = Object.values(this.formGrupos.getRawValue())[1];
    console.info(this.sucursalListaGuardar);

    this.empresaService.putSucursal(this.sucursalListaGuardar).subscribe(value => {
      this._snackBar.open('Sucursal Actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;

      this.vaciarFormulario();
      //this.listarEventoSinParticipantes();
      this.mostrarLista();
      this.mostrarImagenFijo();


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

    XLSX.writeFile(book, 'Lista de Sucursales.xlsx');
  }


  onFileSelected(event) {
    console.info(event);

    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
      this.sucursalListaGuardar.logo = base64;
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

  ///// Generar PDFs

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


    this.empresaService.getSucursalAll().subscribe(value => {
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
            { text: 'SUCURSALES REGISTRADAS', fontSize: 15, bold: true, alignment: 'center' },
            // { text: 'Bodegas registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['2%', '50%', '48%'],
                body: [
                  ['ID', 'NOMBRE', 'RESPONSABLE'],
                  [value.map(function (item) {
                    return { text: item.id + '', fontSize: 10 }
                  }),
                  value.map(function (item) {
                    return { text: item.nombre + '', fontSize: 10 }
                  }),

                  value.map(function (item) {
                    return { text: item.logo + '', fontSize: 10 }

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



