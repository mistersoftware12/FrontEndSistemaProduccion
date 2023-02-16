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
registerLocaleData(localeEs, 'es')


const routes: Routes = [



  {
    path: 'bienvenida',
    component: BienvenidaComponent
  },

  {
    path: 'crudusuario',
    component: CrudusuarioComponent
  },

  {
    path: 'administracionClientes',
    component: CrudClientesComponent
  },

  {
    path: 'administracionusuarios',
    component: CrudusuarioComponent
  },
  {
    path: 'editarusuarios/:id',
    component: EditarUsuariosComponent
  }


]

@NgModule({
  declarations: [
    BienvenidaComponent,
    CrudusuarioComponent,
    EditarUsuariosComponent,

    CrudClientesComponent
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



