import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crud-clientes',
  templateUrl: './crud-clientes.component.html',
  styleUrls: ['./crud-clientes.component.css'],


})

export class CrudClientesComponent implements OnInit {


  //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  loaderActualizar: boolean;


  formGrupos = new FormGroup({
    cedula: new FormControl<String>('',  [Validators.required, Validators.maxLength(13), Validators.minLength(10), Validators.pattern("[0-9]+")]),
    nombres: new FormControl<String>('', [Validators.required , Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    apellidos: new FormControl<Date>(null, [Validators.required ,  Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    telefono: new FormControl<String>('', [Validators.required,  Validators.pattern("[0-9]+")]),
    email: new FormControl<String>('', [Validators.required , Validators.email] ),
    direccion: new FormControl<Date>(null, [Validators.required]),
    fecha: new FormControl<String>('', [Validators.required]),
  })


  constructor() {

  }

  ngOnInit(): void {

  }


  public mostrarNuevo() {
    this.sectionTablaLista = false;
    this.sectionCrudDatos = true;
  }

  public mostrarLista() {
    this.sectionTablaLista = true;
    this.sectionCrudDatos = false;
  }

}