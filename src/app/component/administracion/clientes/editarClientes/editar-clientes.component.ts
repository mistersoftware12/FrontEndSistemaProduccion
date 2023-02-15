import {Component, OnInit} from '@angular/core';
import {Barrio, Canton, Parroquia, Provincia} from "../../../../models/ubicacion";
import {UbicacionService} from "../../../../services/ubicacion.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClienteService} from "../../../../services/cliente.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectChange} from "@angular/material/select";
import Swal from "sweetalert2";
import {ActivatedRoute} from "@angular/router";
import {PersonaUsuario} from "../../../../models/personaUsuario";
import {PersonaCliente} from "../../../../models/personaCliente";

@Component({
  selector: 'app-editarClientes',
  templateUrl: './editar-clientes.component.html',
  styleUrls: ['./editar-clientes.component.css']
})
export class EditarClientesComponent implements OnInit {

  loaderCargar:boolean;
  loaderGuardar: boolean;

  provicias: Provincia[] = [];
  cantones: Canton[] = [];
  parroquias: Parroquia[] = [];
  barrios: Barrio[] = [];

  cantonFiltrado: Canton[] = [];
  parroquiaFiltrado: Parroquia[] = [];


  constructor(private ubicacionService: UbicacionService,
              private _snackBar: MatSnackBar,
              private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.loaderCargar=true;
    this.listarBarrios();
    this.cargardatos()
  }

  cargardatos() {

    this.ubicacionService.getAllProvincias().subscribe(value => {
      this.provicias = value;
      this.ubicacionService.getAllCantones().subscribe(value => {
        this.cantones = value;
        this.ubicacionService.getAllParroquias().subscribe(value => {
          this.parroquias = value;
          this.activatedRoute.params.subscribe(params => {
            this.clienteService.getAllClientes().subscribe(value => {
              var cliente: PersonaCliente = value.filter(value1 => value1.id == params['id'])[0]
              console.log(value.filter(value1 => value1.id == params['id'])[0])
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
                fechaNacimiento: cliente.fechaNacimiento,
                genero: cliente.genero,
                idBarrio: cliente.idBarrio,
                idCanton: cliente.idCanton,
                idParroquia: cliente.idParroquia,
                idProvincia: cliente.idProvincia,
                nombres: cliente.nombres,
                telefono: cliente.telefono
              })
              this.loaderCargar=false;
            })
          })
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
    telefonoResponsbale: new FormControl<String>('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    nombreResponsable: new FormControl<String>('', [Validators.required]),
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

  listarBarrios() {
    this.ubicacionService.getAllBarrios().subscribe(value => {
      this.barrios = value;
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
      confirmButtonColor: '#a01b20',
      backdrop: false
    })
      .then(resultado => {
        if (resultado.value) {
          let barrio: Barrio = new Barrio()
          barrio.barrio = resultado.value
          this.ubicacionService.saveBarrio(barrio).subscribe(value => {
            this.listarBarrios();
            this._snackBar.open('Barrio registrado', 'ACEPTAR');
          }, error => {
            this._snackBar.open(error.error.message, 'ACEPTAR');
          })
        }
      });
  }


  guardarCliente() {
    this.loaderGuardar = true
    console.log(this.formGrupos.getRawValue())
    this.clienteService.updateCliente(this.formGrupos.getRawValue()).subscribe(value => {
      this._snackBar.open('Cliente actualizado', 'ACEPTAR');
      this.vaciarFormulario()
      this.loaderGuardar = false
    }, error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      this.loaderGuardar = false
    })
  }

  vaciarFormulario() {
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

}
