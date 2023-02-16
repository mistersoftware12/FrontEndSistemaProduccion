import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {UsuarioService} from "../../../../services/usuario.service";
import {PersonaUsuario} from "../../../../models/personaUsuario";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-editarUsuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {


  loaderCargar:boolean;
  loaderGuardar:boolean;

  constructor(private _snackBar: MatSnackBar,
              private usuarioService: UsuarioService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loaderCargar=true
    this.activatedRoute.params.subscribe(params => {
      this.usuarioService.getAllUsuarios().subscribe(value => {
        var usuario: PersonaUsuario = value.filter(value1 => value1.id == params['id'])[0]
        console.log(value.filter(value1 => value1.id == params['id'])[0])
        this.formGrupos.setValue({
          id: usuario.id,
          apellidos: usuario.apellidos,
          cedula: usuario.cedula,
          clave: usuario.clave,
          email: usuario.email,
          idRol: usuario.idRol,
          nombres: usuario.nombres,
          telefono: usuario.telefono

        })
        this.loaderCargar=false
      })
    })
  }

  formGrupos = new FormGroup({
    id: new FormControl<Number>(null),
    cedula: new FormControl<String>('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    apellidos: new FormControl<String>('', [Validators.required]),
    nombres: new FormControl<String>('', [Validators.required]),
    email: new FormControl<String>('', [Validators.required, Validators.email]),
    telefono: new FormControl<String>('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    clave: new FormControl<String>('', [Validators.required, Validators.minLength(5)]),
    idRol: new FormControl<Number>(null, [Validators.required]),
  })

  guardarUsuarios() {
    console.log(this.formGrupos.getRawValue())
    this.usuarioService.updateUsuario(this.formGrupos.getRawValue()).subscribe(value => {
      this._snackBar.open('Usuario actualizado', 'ACEPTAR');
      this.vaciarFormulario()
      this.loaderGuardar=false
    },error => {
      this._snackBar.open(error.error.message, 'ACEPTAR');
      this.loaderGuardar=false
    })
  }


  vaciarFormulario(){
    this.formGrupos.setValue({
      apellidos: "", id: null,
      cedula: "",
      clave: "", email: "",
      idRol: null, nombres: "",
      telefono: ""
    })
  }

}
