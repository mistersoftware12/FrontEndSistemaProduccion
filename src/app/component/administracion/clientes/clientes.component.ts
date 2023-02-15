import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import {ClienteService} from "../../../services/cliente.service";
import {UbicacionService} from "../../../services/ubicacion.service";
import {PersonaUsuario} from "../../../models/personaUsuario";
import {PersonaCliente} from "../../../models/personaCliente";
import {DatePipe} from "@angular/common";
import {UsuarioService} from "../../../services/usuario.service";
import {Router} from "@angular/router";
import {Barrio, Canton, Parroquia, Provincia} from "../../../models/ubicacion";
import {MatSelectChange} from "@angular/material/select";
import Swal from "sweetalert2";
import {MatSnackBar} from "@angular/material/snack-bar";



export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  loaderCargar:boolean;
  loaderGuardar:boolean;
  fecha:Date;

  provicias: Provincia[] = [];
  cantones: Canton[] = [];
  parroquias: Parroquia[] = [];
  barrios: Barrio[] = [];

  cantonFiltrado: Canton[] = [];
  parroquiaFiltrado: Parroquia[] = [];

  public divNuevo: Boolean = true;
  loaderActualizar:boolean;
  selected = new FormControl(0);

  displayedColumns: string[] = ['id', 'cedula', 'nombres', 'apellidos','edad','genero','email','telefono','discapacidad','editar'];
  dataSource: MatTableDataSource<PersonaCliente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private ubicacionService: UbicacionService,
              private clienteService: ClienteService,
              private usuarioService:UsuarioService,
              private router:Router,
              private _snackBar: MatSnackBar,
            ) {
  }

  ngOnInit(): void {
    this.listarClientes()
    this.loaderCargar=true;
    this.ubicacionService.getAllProvincias().subscribe(value => {
      this.provicias = value;
      this.ubicacionService.getAllCantones().subscribe(value => {
        this.cantones = value;
        this.ubicacionService.getAllParroquias().subscribe(value => {
          this.fecha=new Date();
          this.parroquias = value;
          this.listarBarrios();
          this.loaderCargar=false;
        })
      })
    })
  }

  formGrupos = new FormGroup({
    id: new FormControl<Number>(null),
    cedula: new FormControl<String>('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    apellidos: new FormControl<String>('', [Validators.required]),
    nombres: new FormControl<String>('', [Validators.required]),
    fechaNacimiento: new FormControl<Date>(null, [Validators.required]),
    genero: new FormControl<String>('', [Validators.required]),
    telefono: new FormControl<String>('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    email: new FormControl<String>('', [Validators.required, Validators.email]),
    estadoCivil: new FormControl<String>('', [Validators.required]),
    discapacidad: new FormControl<boolean>(null, [Validators.required]),
    idBarrio: new FormControl<Number>(null, [Validators.required]),
    idCanton: new FormControl<Number>(null, [Validators.required]),
    idProvincia: new FormControl<Number>(null, [Validators.required]),
    idParroquia: new FormControl<Number>(null, [Validators.required]),
    telefonoResponsbale: new FormControl<String>('', [ Validators.maxLength(10), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    nombreResponsable: new FormControl<String>('', ),
  })


  selectProvincia(id?: Number) {
    this.cantonFiltrado.length = 0;
    this.parroquiaFiltrado.length = 0;
    this.cantonFiltrado = this.cantones.filter(value => value.idProvincia == id);
  }

  selectCanton(id?: Number) {
    this.parroquiaFiltrado.length = 0;
    this.parroquiaFiltrado = this.parroquias.filter(value => value.idCanton == id);
  }

  listarBarrios(){
    this.ubicacionService.getAllBarrios().subscribe(value => {
      this.barrios=value;
    })
  }


  async agregarBarrios() {
    Swal.fire({
      title: "Ingrese el nombre del Ubicacion",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      background: '#f7f2dc',
      confirmButtonColor:'#a01b20',
      backdrop: false
    })
      .then(resultado => {
        if (resultado.value) {
          let barrio:Barrio = new Barrio()
          barrio.barrio=resultado.value
          this.ubicacionService.saveBarrio(barrio).subscribe(value => {
            this.listarBarrios();
            this._snackBar.open('Barrio registrado', 'ACEPTAR');
          },error => {
            this._snackBar.open(error.error.message+' OCURRIO UN ERROR', 'ACEPTAR');
          })
        }
      });
  }


  guardarCliente() {
    this.loaderGuardar=true
    if(this.formGrupos.getRawValue().id==null){
      this.clienteService.saveCliente(this.formGrupos.getRawValue()).subscribe(value => {
        this._snackBar.open('Cliente registrado', 'ACEPTAR');
        this.vaciarFormulario()
        this.listarClientes()
        this.selected.setValue(2)
        this.loaderGuardar=false
      },error => {
        this._snackBar.open(error.error.message+' OCURRIO UN ERROR', 'ACEPTAR');
        this.loaderGuardar=false
      })
    }else {
      this.clienteService.updateCliente(this.formGrupos.getRawValue()).subscribe(value => {
        this._snackBar.open('Cliente actualizado', 'ACEPTAR');
        this.vaciarFormulario()
        this.listarClientes()
        this.selected.setValue(2)
        this.loaderGuardar=false
      }, error => {
        this._snackBar.open(error.error.message+' OCURRIO UN ERROR', 'ACEPTAR');
        this.loaderGuardar = false
      })
    }

  }


  actualizarCliente(id:Number){
    this.vaciarFormulario()
    this.loaderGuardar=true
    this.selected.setValue(0)
    this.clienteService.getAllClientes().subscribe(value => {
      var cliente: PersonaCliente = value.filter(value1 => value1.id == id)[0]
      this.selectProvincia(cliente.idProvincia);
      this.selectCanton(cliente.idCanton);
      this.formGrupos.setValue({
        id: cliente.id,
        nombreResponsable: cliente.nombreResponsable,
        telefonoResponsbale: cliente.telefonoResponsbale,
        apellidos: cliente.apellidos,
        cedula: cliente.cedula,
        discapacidad: cliente.discapacidad,
        email: cliente.email,
        estadoCivil: cliente.estadoCivil,
        fechaNacimiento: sumarDias(new Date(cliente.fechaNacimiento),1),
        genero: cliente.genero,
        idBarrio: cliente.idBarrio,
        idCanton: cliente.idCanton,
        idParroquia: cliente.idParroquia,
        idProvincia: cliente.idProvincia,
        nombres: cliente.nombres,
        telefono: cliente.telefono
      })
      this.loaderGuardar=false
    })
  }

  vaciarFormulario(){
    this.formGrupos.setValue({
      id: null,
      apellidos: "",
      cedula: "",
      discapacidad: false,
      email: "",
      estadoCivil: "",
      fechaNacimiento: null,
      idBarrio: 0,
      idCanton: 0,
      idParroquia: 0,
      idProvincia: 0,
      nombres: "",
      telefono: "",
      genero: null,
      telefonoResponsbale: "",
      nombreResponsable: ""
    })
  }

  listarClientes(){
    this.loaderActualizar=true
    this.clienteService.getAllClientes().subscribe(value => {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loaderActualizar=false
    })
  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  generatePDF() {
    this.loaderActualizar=true
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();
    this.clienteService.getAllClientes().subscribe( value => {
      this.usuarioService.getAllUsuarios().subscribe(async valueb => {
        const pdfDefinition: any = {
          content: [
            {image: await this.getBase64ImageFromURL('assets/images/logovallenegro.png'), width: 100},
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            {text: pipe.transform(dia, 'MMMM d, y'), alignment: 'right'},
            {text: 'CLIENTES REGISTRADOS', fontSize: 15, bold: true, alignment: 'center'},
            {text: 'Clientes registrados en la Biblioteca  ', fontSize: 15, margin: [0, 0, 20, 0]},
            {text: '    '},
            {
              table: {
                headerRows: 1,
                widths: ['2%', '11,1%', '20,1%', '20,1%', '10,1%', '10,1%', '17,2%', '10,1%', '5,2%'],
                body: [
                  ['ID', 'CEDULA', 'NOMBRES', 'APELLIDOS', 'F.NACIMIENTO', 'GENERO', 'CORREO', 'TELEFONO', 'DISC'],
                  [value.map(function (item) {
                    return item.id + ''
                  }),
                    value.map(function (item) {
                      return item.cedula + ''
                    }),
                    value.map(function (item) {
                      return item.nombres + ''
                    }),
                    value.map(function (item) {
                      return item.apellidos + ''
                    }),
                    value.map(function (item) {
                      return item.fechaNacimiento + ''
                    }),
                    value.map(function (item) {
                      return item.genero + ''
                    }),
                    value.map(function (item) {
                      return item.email + ''
                    }),
                    value.map(function (item) {
                      return item.telefono + ''
                    }),
                    value.map(function (item) {
                      return (item.discapacidad == true) ? 'SI' : 'NO'
                    })
                  ],

                ]
              }

            },
            {text: '    '},
            {text: '    '},
            {
              table: {
                headerRows: 1,
                widths: ['100%'],
                heights: 40,
                body: [
                  ['BIBLIOTECARIO/A: ' + valueb.filter(value1 => value1.idRol == 1).pop().apellidos + ' ' + valueb.filter(value1 => value1.idRol == 1).pop().nombres],
                  ['Firma:']
                ]
              },
            }
          ],
          pageOrientation: 'landscape',
        }
        this.loaderActualizar = false
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      })
    })
  }


  getBase64ImageFromURL(url:any) {
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

  exportToExcel(): void {
    let element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, 'Lista de Clientes.xlsx');
  }

}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}

function sumarDias(fecha, dias){
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}
