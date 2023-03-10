import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Sucursal } from 'src/app/models/sucursal';
import { EstadoFD } from 'src/app/models/estado';
import { Taller } from 'src/app/models/empresa';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from "@angular/common";
import { cedula } from 'src/environments/environment';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
    selector: 'app-crud-taller',
    templateUrl: './crud-taller.component.html',
    styleUrls: ['./crud-taller.component.css'],


})

export class CrudTallerComponent implements OnInit {

   //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  public idTaller: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;

  public numeroControl: number = 1;

  loaderActualizar: boolean;


  public tallerListaGuardar: Taller = new Taller();
  public tallerLista: Taller[] = [];
  public sucursalLista: Sucursal[] = [];
  public estadoLista: EstadoFD[] = [{ id: 1, nombres: 'Activo', value: 'true' }, { id: 2, nombres: 'Inactivo', value: 'false' }];


  formGrupos = new FormGroup({
    nombres: new FormControl<String>('', [Validators.required]),
    direccion: new FormControl<String>(null, [Validators.required]),
    telefono: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
    email: new FormControl<String>('', [Validators.required, Validators.email]),
    responsable: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    sucursal: new FormControl<String>('', [Validators.required]),
    estado: new FormControl<String>('', [Validators.required]),

  })

  formList = new FormGroup({
    valorSelect: new FormControl<String>('', [Validators.required]),
  })



  displayedColumns: string[] = ['id', 'nombre', 'direccion', 'responsable','telefono', 'correo',  'estado', 'sucursal', 'documento'];
  dataSource: MatTableDataSource<Taller>;

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


  public mostrarNuevo() {

    this.listarSucursal();

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
      direccion: "",
      telefono: "",
      email: "",
      responsable: "",
      sucursal: "",
      estado: "",

    })

  }


  //LISTAR

  public listarInformacion() {
    this.loaderActualizar = true;


    this.empresaService.getTallerAll().subscribe(value => {


      this.tallerLista = value;
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loaderActualizar = false;
    })


  }

  public listarSucursal() {



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
    this.tallerListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.tallerListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[1];
    this.tallerListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[2];
    this.tallerListaGuardar.correo = Object.values(this.formGrupos.getRawValue())[3];
    this.tallerListaGuardar.responsable = Object.values(this.formGrupos.getRawValue())[4];
    this.tallerListaGuardar.idSucursal = Object.values(this.formGrupos.getRawValue())[5];


    var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[6]);  // [{"Spalte":3}] as String
    var d = parseInt(s); // typeof d = number, 

    if (d == 1) {
      this.tallerListaGuardar.estado = true;
    } if (d == 2) {
      this.tallerListaGuardar.estado = false;
    }




    console.info(this.tallerListaGuardar);

    this.empresaService.createTaller(this.tallerListaGuardar).subscribe(value => {
      this._snackBar.open('Taller registrado', 'ACEPTAR');
      this.vaciarFormulario();
      //this.listarEventoSinParticipantes();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

    })


  }


  ////Editar

  editarInformacion(idTaller: any) {

    this.idTaller = idTaller;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;

    for (var k = 0; k < this.tallerLista.length; k++) {
      if (this.tallerLista[k].idTaller == idTaller) {



        if (this.tallerLista[k].estado == true) {
          this.tallerListaGuardar.estado = 1;

        } if (this.tallerLista[k].estado == false) {
          this.tallerListaGuardar.estado = 2;

        }



        this.formGrupos.setValue({

          nombres: this.tallerLista[k].nombre,
          direccion: this.tallerLista[k].direccion,
          telefono: this.tallerLista[k].telefono,
          email: this.tallerLista[k].correo,
          responsable: this.tallerLista[k].responsable,
          sucursal: this.tallerLista[k].idSucursal,
          estado: this.tallerListaGuardar.estado,

        })
        this.mostrarNuevo();
        this.numeroControl = 3;
      }

    }

  }


  public guardarEditarInformacion() {


    this.tallerListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.tallerListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[1];
    this.tallerListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[2];
    this.tallerListaGuardar.correo = Object.values(this.formGrupos.getRawValue())[3];
    this.tallerListaGuardar.responsable = Object.values(this.formGrupos.getRawValue())[4];
    this.tallerListaGuardar.idSucursal = Object.values(this.formGrupos.getRawValue())[5];
    this.tallerListaGuardar.idTaller = this.idTaller;

    var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[6]);  // [{"Spalte":3}] as String
    var d = parseInt(s); // typeof d = number, 

    if (d == 1) {
      this.tallerListaGuardar.estado = true;
    } if (d == 2) {
      this.tallerListaGuardar.estado = false;
    }


    console.info(this.tallerListaGuardar);


    this.empresaService.putTaller(this.tallerListaGuardar).subscribe(value => {
      this._snackBar.open('Taller Actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;
      
      this.mostrarLista();
     

    }, error => {
      this._snackBar.open(error.error.message+' OCURRIO UN ERROR', 'ACEPTAR');
     
    })

   
  }




  //Exportaciones de documento

  exportToExcel(): void {
    let element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, 'Lista de Talleres.xlsx');
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
  
  
      this.empresaService.getTallerAll().subscribe(value => {
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
              { text: 'TALLERES REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
             // { text: 'Bodegas registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
              { text: '    ' },
              {
                table: {
                  headerRows: 1,
                  widths: ['2%', '10%', '28%', '15%', '10,1%', '20%', '9%', '6%'],
                  body: [
                    ['ID', 'NOMBRE', 'DIRECCI??N', 'RESPONSABLE', 'TEL??FONO', 'CORREO', 'SUCURSAL', 'EST.'],
                    [value.map(function (item) {
                      return { text: item.id + '', fontSize: 10 }
                    }),
                    value.map(function (item) {
                      return { text: item.nombre + '', fontSize: 10 }
                    }),
                    value.map(function (item) {
                      return { text: item.direccion + '', fontSize: 10 }
  
                    }),
                    value.map(function (item) {
                      return { text: item.responsable + '', fontSize: 10 }
  
                    }),
                    value.map(function (item) {
                      return { text: item.telefono + '', fontSize: 10 }
  
                    }),
                    value.map(function (item) {
                      return { text: item.correo + '', fontSize: 10 }
                    }),
                    value.map(function (item) {
                      return { text: item.nombreSucursal + '', fontSize: 10 }
  
                    }),
                    value.map(function (item) {
                      return { text: item.nombreEstado + '', fontSize: 10 }
  
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

}