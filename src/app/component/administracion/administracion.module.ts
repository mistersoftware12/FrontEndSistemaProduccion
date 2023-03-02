import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { MaterialModule } from "../../../material/material.module";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CrudusuarioComponent } from './crudusuario/crudusuario.component';
import { EditarUsuariosComponent } from './crudusuario/editarUsuarios/editar-usuarios.component';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from "@angular/common";
import { CrudClientesComponent } from './personas/CrudClientes/crud-clientes.component';
import { CrudAlmacenComponent } from './empresa/CrudAlmacen/crud-almacen.component';
import { CrudBodegaComponent } from './empresa/CrudBodega/crud-bodega.component';
import { CrudSucursalComponent } from './empresa/CrudSucursal/crud-sucursal.component';
import { CrudTallerComponent } from './empresa/CrudTaller/crud-taller.component';
import { CrudUsuariosComponent } from './personas/CrudUsuario/crud-usuario.component';
import { CrudCatalogoComponent } from './catalogo/Crud/crud-catalogo.component';
import { CrudCategoriaComponent } from './categoria/Crud/crud-categoria.component';
import { CrudArticuloComponent } from './articulo/Crud/crud-articulo.component';
import { CrudProveedorComponent } from './personas/CrudProveedor/crud-proveedor.component';
registerLocaleData(localeEs, 'es')


const routes: Routes = [



  {
    path: 'bienvenida',
    component: BienvenidaComponent
  },




  {
    path: 'administracionusuarios',
    component: CrudUsuariosComponent
  },
  {
    path: 'editarusuarios/:id',
    component: EditarUsuariosComponent
  },

  {
    path: 'administracionClientes',
    component: CrudClientesComponent
  },

  {
    path: 'administracionProveedores',
    component: CrudProveedorComponent
  },

  {
    path: 'administracionAlmacen',
    component: CrudAlmacenComponent
  },

  {
    path: 'administracionBodega',
    component: CrudBodegaComponent
  },

  {
    path: 'administracionSucursal',
    component: CrudSucursalComponent
  },

  {
    path: 'administracionTaller',
    component: CrudTallerComponent
  },

  {
    path: 'administracionCategoria',
    component: CrudCategoriaComponent
  },

  {
    path: 'administracionCatalogo',
    component: CrudCatalogoComponent
  },

  {
    path: 'administracionArticulo',
    component: CrudArticuloComponent
  },


]

@NgModule({
  declarations: [
    BienvenidaComponent,
    CrudusuarioComponent,
    EditarUsuariosComponent,


    CrudClientesComponent,
    CrudUsuariosComponent,
    CrudProveedorComponent,
    CrudAlmacenComponent,
    CrudBodegaComponent,
    CrudSucursalComponent,
    CrudTallerComponent,

    CrudCatalogoComponent,
    CrudCategoriaComponent,
    CrudArticuloComponent

  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class AdministracionModule {
}



