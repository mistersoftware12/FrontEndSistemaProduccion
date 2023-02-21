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
import { Bodega } from 'src/app/models/empresa';

@Component({
    selector: 'app-crud-bodega',
    templateUrl: './crud-bodega.component.html',
    styleUrls: ['./crud-bodega.component.css'],


})

export class CrudBodegaComponent implements OnInit {

    //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  public idBodega: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;

  public numeroControl: number = 1;

  loaderActualizar: boolean;


  public bodegaListaGuardar: Bodega  = new Bodega();
  public bodegaLista: Bodega[] = [];
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



  displayedColumns: string[] = ['id', 'nombre', 'direccion', 'telefono', 'correo', 'responsable', 'estado', 'sucursal', 'documento'];
  dataSource: MatTableDataSource<Bodega>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _snackBar: MatSnackBar,
    private empresaService: EmpresaService,

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



    this.empresaService.getBodegaAll().subscribe(value => {


      this.bodegaLista = value;
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

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
    this.bodegaListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.bodegaListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[1];
    this.bodegaListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[2];
    this.bodegaListaGuardar.correo = Object.values(this.formGrupos.getRawValue())[3];
    this.bodegaListaGuardar.responsable = Object.values(this.formGrupos.getRawValue())[4];
    this.bodegaListaGuardar.idSucursal = Object.values(this.formGrupos.getRawValue())[5];


    var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[6]);  // [{"Spalte":3}] as String
    var d = parseInt(s); // typeof d = number, 

    if (d == 1) {
      this.bodegaListaGuardar.estado = true;
    } if (d == 2) {
      this.bodegaListaGuardar.estado = false;
    }




    console.info(this.bodegaListaGuardar);

    this.empresaService.createBodega(this.bodegaListaGuardar).subscribe(value => {
      this._snackBar.open('Bodega registrado', 'ACEPTAR');
      this.vaciarFormulario();
      //this.listarEventoSinParticipantes();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

    })


  }


  ////Editar

  editarInformacion(idBodega: any) {

    this.idBodega = idBodega;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;

    for (var k = 0; k < this.bodegaLista.length; k++) {
      if (this.bodegaLista[k].idBodega == idBodega) {



        if (this.bodegaLista[k].estado == true) {
          this.bodegaListaGuardar.estado = 1;

        } if (this.bodegaLista[k].estado == false) {
          this.bodegaListaGuardar.estado = 2;

        }



        this.formGrupos.setValue({

          nombres: this.bodegaLista[k].nombre,
          direccion: this.bodegaLista[k].direccion,
          telefono: this.bodegaLista[k].telefono,
          email: this.bodegaLista[k].correo,
          responsable: this.bodegaLista[k].responsable,
          sucursal: this.bodegaLista[k].idSucursal,
          estado: this.bodegaListaGuardar.estado,

        })
        this.mostrarNuevo();
        this.numeroControl = 3;
      }

    }

  }


  public guardarEditarInformacion() {


    this.bodegaListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.bodegaListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[1];
    this.bodegaListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[2];
    this.bodegaListaGuardar.correo = Object.values(this.formGrupos.getRawValue())[3];
    this.bodegaListaGuardar.responsable = Object.values(this.formGrupos.getRawValue())[4];
    this.bodegaListaGuardar.idSucursal = Object.values(this.formGrupos.getRawValue())[5];
    this.bodegaListaGuardar.idBodega = this.idBodega;

    var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[6]);  // [{"Spalte":3}] as String
    var d = parseInt(s); // typeof d = number, 

    if (d == 1) {
      this.bodegaListaGuardar.estado = true;
    } if (d == 2) {
      this.bodegaListaGuardar.estado = false;
    }


    console.info(this.bodegaListaGuardar);


    this.empresaService.putBodega(this.bodegaListaGuardar).subscribe(value => {
      this._snackBar.open('Bodega Actualizado', 'ACEPTAR');
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

    XLSX.writeFile(book, 'Lista de Almacenes.xlsx');
  }
}