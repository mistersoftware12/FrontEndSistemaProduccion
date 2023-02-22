import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Sucursal } from 'src/app/models/sucursal';
import { Observable, ReplaySubject } from 'rxjs';
import { Catalogo } from 'src/app/models/catalogo';
import { CatalogoService } from 'src/app/services/catalogo.service';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
    selector: 'app-crud-categoria.component',
    templateUrl: './crud-categoria.component.html',
    styleUrls: ['./crud-categoria.component.css'],
    
 
  })

  export class CrudCategoriaComponent implements OnInit{

   
  //Control de pantallas
  public sectionTablaLista: Boolean = true;
  public sectionCrudDatos: Boolean = false;


  public idCategoria: any;
  public botonParaGuardar: Boolean = true;
  public botonParaEditar: Boolean = false;

  public imagenFijo: Boolean = true;
  public imagenBase: Boolean = false;

  public numeroControl: number = 1;

  loaderActualizar: boolean;


  base64Output: string;


  public catalogoListaGuardar: Catalogo = new Catalogo();
  public catalogolLista: Catalogo[] = [];


  formGrupos = new FormGroup({
    nombres: new FormControl<String>('', [Validators.required]),
    inicial: new FormControl<String>('', [Validators.required]),


  })



  displayedColumns: string[] = ['id', 'nombre', 'logo', 'documento'];
  dataSource: MatTableDataSource<Sucursal>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _snackBar: MatSnackBar,
    private categoriaService: CategoriaService,
  ) {
  }

  ngOnInit(): void {
    this.listarInformacion();

  }



  public mostrarImagenBase() {
    this.imagenFijo = false;
    this.imagenBase = true;
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
      nombres: "",
      inicial: "",

    })

  }



  //LISTAR

  public listarInformacion() {


this.categoriaService.getCategoriaAll().subscribe(value => {

      this.catalogolLista = value;


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

    this.catalogoListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.catalogoListaGuardar.inicialCodigo = Object.values(this.formGrupos.getRawValue())[1];

   

        this.categoriaService.createCategoria(this.catalogoListaGuardar).subscribe(value => {
          this._snackBar.open('Categoria Creado', 'ACEPTAR');

          this.vaciarFormulario();
          this.mostrarLista();

        }, error => {
          this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');

        })
     



  }


  ////Editar

  editarInformacion(id: any, nombre: any, inicial: any) {

    this.idCategoria = id;
    this.botonParaGuardar = false;
    this.botonParaEditar = true;

    this.formGrupos.setValue({
      nombres: nombre,
      inicial: inicial,
    })

    this.mostrarNuevo();
    this.numeroControl = 3;


    this.catalogoListaGuardar.id = this.idCategoria;

    this.catalogoListaGuardar.inicialCodigo = inicial;




  }


  public guardarEditarInformacion() {

    this.catalogoListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.catalogoListaGuardar.inicialCodigo = Object.values(this.formGrupos.getRawValue())[1];
    console.info(this.catalogoListaGuardar);

    this.categoriaService.putCategoria(this.catalogoListaGuardar).subscribe(value => {
      this._snackBar.open('Categoria Actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonParaGuardar = true;
      this.botonParaEditar = false;

      this.vaciarFormulario();
      //this.listarEventoSinParticipantes();
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

    XLSX.writeFile(book, 'Lista de Catalogos.xlsx');
  }


  }