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


@Component({
  selector: 'app-crud-clientes',
  templateUrl: './crud-clientes.component.html',
  styleUrls: ['./crud-clientes.component.css'],


})

export class CrudClientesComponent implements OnInit {


  //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  public idPersona: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;



  public numeroControl: number = 1;

  loaderActualizar: boolean;


  public clienteListaGuardar: Cliente = new Cliente();
  public clienteLista: Cliente[] = [];


  formGrupos = new FormGroup({
    cedula: new FormControl<String>('', [Validators.required, Validators.maxLength(13), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    nombres: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    apellidos: new FormControl<String>(null, [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    telefono: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
    email: new FormControl<String>('', [Validators.required, Validators.email]),
    direccion: new FormControl<String>(null, [Validators.required]),
    fecha: new FormControl<String>('', [Validators.required]),
  })


  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellidos', 'telefono', 'nacimiento', 'correo', 'documento'];
  dataSource: MatTableDataSource<Cliente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;




  constructor(
    private _snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
  ) {

  }

  ngOnInit(): void {
    this.listarInformacion();

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
      cedula: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      email: "",
      direccion: "",
      fecha: null,

    })

  }


  //LISTAR

  public listarInformacion() {
    this.clienteService.getClientesAll().subscribe(value => {


      this.clienteLista = value;


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
    this.clienteListaGuardar.cedula = Object.values(this.formGrupos.getRawValue())[0];
    this.clienteListaGuardar.nombres = Object.values(this.formGrupos.getRawValue())[1];
    this.clienteListaGuardar.apellidos = Object.values(this.formGrupos.getRawValue())[2];
    this.clienteListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[3];
    this.clienteListaGuardar.email = Object.values(this.formGrupos.getRawValue())[4];
    this.clienteListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[5];
    this.clienteListaGuardar.fechaNacimiento = Object.values(this.formGrupos.getRawValue())[6];

    this.clienteService.createCliente(this.clienteListaGuardar).subscribe(value => {
      this._snackBar.open('Cliente registrado', 'ACEPTAR');
      this.vaciarFormulario();
      //this.listarEventoSinParticipantes();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

    })


  }


  ////Editar

  editarInformacion(id: any) {
    this.idPersona = id;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;



    for (var k = 0; k < this.clienteLista.length; k++) {
      if (this.clienteLista[k].id == id) {


        this.formGrupos.setValue({
          cedula: this.clienteLista[k].cedula,
          nombres: this.clienteLista[k].nombres,
          apellidos: this.clienteLista[k].apellidos,
          telefono: this.clienteLista[k].telefono,
          email: this.clienteLista[k].email,
          direccion: this.clienteLista[k].direccion,
          fecha: this.clienteLista[k].fechaNacimiento,

        })
        this.mostrarNuevo();
        this.numeroControl = 3;
      }

    }

  }


  public guardarEditarInformacion() {



    this.clienteListaGuardar.cedula = Object.values(this.formGrupos.getRawValue())[0];
    this.clienteListaGuardar.nombres = Object.values(this.formGrupos.getRawValue())[1];
    this.clienteListaGuardar.apellidos = Object.values(this.formGrupos.getRawValue())[2];
    this.clienteListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[3];
    this.clienteListaGuardar.email = Object.values(this.formGrupos.getRawValue())[4];
    this.clienteListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[5];
    this.clienteListaGuardar.fechaNacimiento = Object.values(this.formGrupos.getRawValue())[6];
    this.clienteListaGuardar.id = this.idPersona;


    console.log("Datos Actualizar");
    console.log(this.clienteListaGuardar);


    this.clienteService.putCliente(this.clienteListaGuardar).subscribe(value => {
      this._snackBar.open('Cliente Actualizado', 'ACEPTAR');
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




  //Exportaciones de documento

  exportToExcel(): void {
    let element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, 'Lista de Clientes.xlsx');
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


    this.clienteService.getClientesAll().subscribe(value => {
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
            { text: 'CLIENTES REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
            { text: 'Clientes registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['2%', '10%', '17%', '17%', '10,1%', '10,1%', '27%', '10%'],
                body: [
                  ['ID', 'CEDULA', 'NOMBRES', 'APELLIDOS', 'F.NACIMIENTO', 'DIRECCIÓN', 'CORREO', 'TELEFONO'],
                  [value.map(function (item) {
                    return { text: item.id + '', fontSize: 12 }
                  }),
                  value.map(function (item) {
                    return { text: item.cedula + '', fontSize: 12 }
                  }),
                  value.map(function (item) {
                    return { text: item.nombres + '', fontSize: 12 }

                  }),
                  value.map(function (item) {
                    return { text: item.apellidos + '', fontSize: 12 }

                  }),
                  value.map(function (item) {
                    return { text: item.fechaNacimiento + '', fontSize: 12 }

                  }),
                  value.map(function (item) {
                    return { text: item.direccion + '', fontSize: 12 }
                  }),
                  value.map(function (item) {
                    return { text: item.email + '', fontSize: 12 }

                  }),
                  value.map(function (item) {
                    return { text: item.telefono + '', fontSize: 12 }

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