import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {UbicacionService} from "../../../../services/ubicacion.service";
import {Barrio, Canton, Parroquia, Provincia} from "../../../../models/ubicacion";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSelectChange} from "@angular/material/select";
import {ClientesComponent} from "../clientes.component";
import {ClienteService} from "../../../../services/cliente.service";

@Component({
  selector: 'app-nuevoCliente',
  templateUrl: './nuevoCliente.component.html',
  styleUrls: ['./nuevoCliente.component.css'],


})

export class nuevoClienteComponent implements OnInit {

  loaderCargar:boolean;
  loaderGuardar:boolean;

  provicias: Provincia[] = [];
  cantones: Canton[] = [];
  parroquias: Parroquia[] = [];
  barrios: Barrio[] = [];
  fecha:Date;

  cantonFiltrado: Canton[] = [];
  parroquiaFiltrado: Parroquia[] = [];


  constructor(private ubicacionService:UbicacionService,
              private _snackBar: MatSnackBar,
              private clienteService:ClienteService) {
  }

  ngOnInit(): void {

    this.loaderCargar=true;
    this.ubicacionService.getAllProvincias().subscribe(value => {
      this.provicias = value;
      this.ubicacionService.getAllCantones().subscribe(value => {
        this.cantones = value;
        this.ubicacionService.getAllParroquias().subscribe(value => {
          console.log(value)
          this.fecha=new Date();
          this.parroquias = value;
          this.listarBarrios();
          this.loaderCargar=false;
        })
      })
    })
  }

  formGrupos = new FormGroup({
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
    telefonoResponsbale: new FormControl<String>('', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    nombreResponsable: new FormControl<String>('', ),
  })


  selectProvincia(id?: MatSelectChange) {
    this.cantonFiltrado.length = 0;
    this.parroquiaFiltrado.length = 0;
    this.cantonFiltrado = this.cantones.filter(value => value.idProvincia == id.value);
  }

  selectCanton(id?: MatSelectChange) {
    this.parroquiaFiltrado.length = 0;
    this.parroquiaFiltrado = this.parroquias.filter(value => value.idCanton == id.value);
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
            this._snackBar.open(error.error.message, 'ACEPTAR');
          })
        }
      });
  }


  guardarCliente() {
    this.loaderGuardar=true
    console.log(this.formGrupos.getRawValue())
    this.clienteService.saveCliente(this.formGrupos.getRawValue()).subscribe(value => {
      this._snackBar.open('Cliente registrado', 'ACEPTAR');
      this.vaciarFormulario()
      this.loaderGuardar=false
    },error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      this.loaderGuardar=false
    })
  }



  vaciarFormulario(){
    this.formGrupos.setValue({
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
}
