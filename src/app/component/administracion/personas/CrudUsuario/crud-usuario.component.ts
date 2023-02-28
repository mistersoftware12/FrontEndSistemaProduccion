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
import { EmpresaService } from 'src/app/services/empresa.service';
import { Usuario } from 'src/app/models/persona';
import { Sucursal } from 'src/app/models/sucursal';
import { cedula } from 'src/environments/environment';


@Component({
  selector: 'app-crud-usurio',
  templateUrl: './crud-usuario.component.html',
  styleUrls: ['./crud-usuario.component.css'],


})

export class CrudUsuariosComponent implements OnInit {

  //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  public idPersona: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;



  public numeroControl: number = 1;

  loaderActualizar: boolean;


  public UsuarioListaGuardar: Usuario = new Usuario();
  public UsuarioLista: Usuario[] = [];

  public sucursalLista: Sucursal[] = [];



  formGrupos = new FormGroup({
    cedula: new FormControl<String>('', [Validators.required, Validators.maxLength(13), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    nombres: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    apellidos: new FormControl<String>(null, [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    telefono: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
    email: new FormControl<String>('', [Validators.required, Validators.email]),
    direccion: new FormControl<String>(null, [Validators.required]),
    fecha: new FormControl<String>('', [Validators.required]),
    clave: new FormControl<String>('', [Validators.required]),
    sucursal: new FormControl<String>('', [Validators.required]),
    idRol: new FormControl<Number>(null, [Validators.required]),

  })


  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellidos', 'sucursal', 'rol', 'telefono', 'nacimiento', 'correo', 'documento'];
  dataSource: MatTableDataSource<Cliente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;




  constructor(
    private _snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
  ) {

  }

  ngOnInit(): void {
    this.listarInformacion();
    this.listarSucursal();

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
      sucursal: "",
      idRol: null,
      clave: "",
    })

  }


  //LISTAR

  public listarInformacion() {
    this.usuarioService.getAllUsuarios().subscribe(value => {

      this.UsuarioLista = value;

      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })


  }

  public listarSucursal() {



    this.empresaService.getSucursalAll().subscribe(value => {

      this.sucursalLista = value;

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

    this.UsuarioListaGuardar.cedula = Object.values(this.formGrupos.getRawValue())[0];
    this.UsuarioListaGuardar.nombres = Object.values(this.formGrupos.getRawValue())[1];
    this.UsuarioListaGuardar.apellidos = Object.values(this.formGrupos.getRawValue())[2];
    this.UsuarioListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[3];
    this.UsuarioListaGuardar.email = Object.values(this.formGrupos.getRawValue())[4];
    this.UsuarioListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[5];
    this.UsuarioListaGuardar.fechaNacimiento = Object.values(this.formGrupos.getRawValue())[6];
    this.UsuarioListaGuardar.clave = Object.values(this.formGrupos.getRawValue())[7];
    this.UsuarioListaGuardar.idSucursal = Object.values(this.formGrupos.getRawValue())[8];
    this.UsuarioListaGuardar.idRol = Object.values(this.formGrupos.getRawValue())[9];

    this.usuarioService.createUsuario(this.UsuarioListaGuardar).subscribe(value => {
      this._snackBar.open('Usuario registrado', 'ACEPTAR');
      this.vaciarFormulario();

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



    for (var k = 0; k < this.UsuarioLista.length; k++) {
      if (this.UsuarioLista[k].id == id) {


        this.formGrupos.setValue({
          cedula: this.UsuarioLista[k].cedula,
          nombres: this.UsuarioLista[k].nombres,
          apellidos: this.UsuarioLista[k].apellidos,
          telefono: this.UsuarioLista[k].telefono,
          email: this.UsuarioLista[k].email,
          direccion: this.UsuarioLista[k].direccion,
          fecha: this.UsuarioLista[k].fechaNacimiento,
          sucursal: this.UsuarioLista[k].idSucursal,

          idRol: this.UsuarioLista[k].idRol,
          clave: "",


        })
        this.mostrarNuevo();
        this.numeroControl = 3;
      }

    }

  }


  public guardarEditarInformacion() {


    this.UsuarioListaGuardar.cedula = Object.values(this.formGrupos.getRawValue())[0];
    this.UsuarioListaGuardar.nombres = Object.values(this.formGrupos.getRawValue())[1];
    this.UsuarioListaGuardar.apellidos = Object.values(this.formGrupos.getRawValue())[2];
    this.UsuarioListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[3];
    this.UsuarioListaGuardar.email = Object.values(this.formGrupos.getRawValue())[4];
    this.UsuarioListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[5];
    this.UsuarioListaGuardar.fechaNacimiento = Object.values(this.formGrupos.getRawValue())[6];
    this.UsuarioListaGuardar.clave = Object.values(this.formGrupos.getRawValue())[7];
    this.UsuarioListaGuardar.idSucursal = Object.values(this.formGrupos.getRawValue())[8];
    this.UsuarioListaGuardar.idRol = Object.values(this.formGrupos.getRawValue())[9];
    this.UsuarioListaGuardar.id = this.idPersona;


    console.log("Datos Actualizar");
    console.log(this.UsuarioListaGuardar);


    this.usuarioService.putUsuario(this.UsuarioListaGuardar).subscribe(value => {
      this._snackBar.open('Usuario Actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;

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

    XLSX.writeFile(book, 'Lista de Usuarios.xlsx');
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
    
    this.usuarioService.getAllUsuarios().subscribe(value => {
      
      this.usuarioService.getAllUsuarios().subscribe(async valueb => {
        
        const pdfDefinition: any = {

          footer: function(currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
          header: function(currentPage, pageCount, pageSize) {
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
            { text: 'USUARIOS REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Usuarios registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['2%', '10%', '17%', '17%', '11%', '10,1%', '23%', '10%'],
                body: [
                  ['ID', 'CEDULA', 'NOMBRES', 'APELLIDOS', 'ROL', 'SUCURSAL', 'CORREO', 'TELEFONO'],
                  [value.map(function (item) {
                    return { text: item.id + '', fontSize: 11 } 
                  }),
                  value.map(function (item) {
                    return { text: item.cedula + '', fontSize: 11}
                  }),
                  value.map(function (item) {
                    return { text: item.nombres + '', fontSize: 11}
                  }),
                  value.map(function (item) {
                    return { text: item.apellidos + '', fontSize: 11}
                  }),
                  value.map(function (item) {
                    return { text: item.nombreRol + '', fontSize: 11}
                  }),
                  value.map(function (item) {
                    return { text: item.nombreSucursal + '', fontSize: 11}
                  }),
                  value.map(function (item) {
                    return { text: item.email + '', fontSize: 11}
                  }),
                  value.map(function (item) {
                    return { text: item.telefono + '', fontSize: 11}
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