import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Almacen } from 'src/app/models/almacen';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Sucursal } from 'src/app/models/sucursal';
import { EstadoFD } from 'src/app/models/estado';

@Component({
  selector: 'app-crud-almacen',
  templateUrl: './crud-almacen.component.html',
  styleUrls: ['./crud-almacen.component.css'],


})

export class CrudAlmacenComponent implements OnInit {


  //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  public idAlmacen: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;

  public numeroControl: number = 1;

  loaderActualizar: boolean;


  public almacenListaGuardar: Almacen = new Almacen();
  public almacenLista: Almacen[] = [];
  public sucursalLista: Sucursal[] = [];
  public estadoLista: EstadoFD[] = [{ id: 1, nombres: 'Activo', value: 'true' }, { id: 2, nombres: 'Inactivo', value: 'false' }];


  formGrupos = new FormGroup({
    nombres: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
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
  dataSource: MatTableDataSource<Almacen>;

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



    this.empresaService.getAlmacenAll().subscribe(value => {


      this.almacenLista = value;
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
    this.almacenListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.almacenListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[1];
    this.almacenListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[2];
    this.almacenListaGuardar.correo = Object.values(this.formGrupos.getRawValue())[3];
    this.almacenListaGuardar.responsable = Object.values(this.formGrupos.getRawValue())[4];
    this.almacenListaGuardar.idSucursal = Object.values(this.formGrupos.getRawValue())[5];


    var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[6]);  // [{"Spalte":3}] as String
    var d = parseInt(s); // typeof d = number, 

    if (d == 1) {
      this.almacenListaGuardar.estado = true;
    } if (d == 2) {
      this.almacenListaGuardar.estado = false;
    }




    console.info(this.almacenListaGuardar);

    this.empresaService.createAlmacen(this.almacenListaGuardar).subscribe(value => {
      this._snackBar.open('Almacen registrado', 'ACEPTAR');
      this.vaciarFormulario();
      //this.listarEventoSinParticipantes();
      this.mostrarLista();
    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

    })


  }


  ////Editar

  editarInformacion(idAlmacen: any) {

    this.idAlmacen = idAlmacen;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;

    for (var k = 0; k < this.almacenLista.length; k++) {
      if (this.almacenLista[k].idAlmacen == idAlmacen) {



        if (this.almacenLista[k].estado == true) {
          this.almacenListaGuardar.estado = 1;

        } if (this.almacenLista[k].estado == false) {
          this.almacenListaGuardar.estado = 2;

        }



        this.formGrupos.setValue({

          nombres: this.almacenLista[k].nombre,
          direccion: this.almacenLista[k].direccion,
          telefono: this.almacenLista[k].telefono,
          email: this.almacenLista[k].correo,
          responsable: this.almacenLista[k].responsable,
          sucursal: this.almacenLista[k].idSucursal,
          estado: this.almacenListaGuardar.estado,

        })
        this.mostrarNuevo();
        this.numeroControl = 3;
      }

    }

  }


  public guardarEditarInformacion() {


    this.almacenListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.almacenListaGuardar.direccion = Object.values(this.formGrupos.getRawValue())[1];
    this.almacenListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[2];
    this.almacenListaGuardar.correo = Object.values(this.formGrupos.getRawValue())[3];
    this.almacenListaGuardar.responsable = Object.values(this.formGrupos.getRawValue())[4];
    this.almacenListaGuardar.idSucursal = Object.values(this.formGrupos.getRawValue())[5];
    this.almacenListaGuardar.idAlmacen = this.idAlmacen;

    var s = JSON.stringify(Object.values(this.formGrupos.getRawValue())[6]);  // [{"Spalte":3}] as String
    var d = parseInt(s); // typeof d = number, 

    if (d == 1) {
      this.almacenListaGuardar.estado = true;
    } if (d == 2) {
      this.almacenListaGuardar.estado = false;
    }


    console.info(this.almacenListaGuardar);


    this.empresaService.putAlmacen(this.almacenListaGuardar).subscribe(value => {
      this._snackBar.open('Almacen Actualizado', 'ACEPTAR');
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

    XLSX.writeFile(book, 'Lista de Clientes.xlsx');
  }




}