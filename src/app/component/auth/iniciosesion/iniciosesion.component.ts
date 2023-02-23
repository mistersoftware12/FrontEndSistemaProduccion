import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {InicioSesionService} from "../../../services/inicioSesion.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-iniciosesion',
  templateUrl: './iniciosesion.component.html',
  styleUrls: ['./iniciosesion.component.css']
})
export class IniciosesionComponent implements OnInit,AfterViewInit {

  hide = true;
  iniciobar:boolean;
  issloading=true;

  constructor(private inicioSesionService:InicioSesionService,
              private _snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.issloading=false;
    },50)
  }

  formGroup = new FormGroup({
    clave: new FormControl<String>('', [Validators.required]),
    cedula: new FormControl<String>('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("[0-9]+")])
  })


  iniciarsesion(){
    this.iniciobar=true
    this.inicioSesionService.loginUsuario(this.formGroup.getRawValue()).subscribe(value => {
      console.log(value.token)
      this._snackBar.open('SESION INICIADA', 'ACEPTAR');
      sessionStorage.clear()
      sessionStorage.setItem('personausuario', JSON.stringify(value));
      console.info(value);
      this.router.navigate(['/panel/biblioteca/bienvenida']);
      this.iniciobar=false

    },error => {
      this._snackBar.open(error.error.message+' USUARIO O CLAVE INVALIDAD', 'ACEPTAR');
      this.iniciobar=false
    })

  }

}
