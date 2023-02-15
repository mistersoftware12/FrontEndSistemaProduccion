import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { MaterialModule } from "../../../material/material.module";
import { RouterModule, Routes } from "@angular/router";
import { ClientesComponent } from './clientes/clientes.component';
import { ReactiveFormsModule } from "@angular/forms";
import { CrudusuarioComponent } from './crudusuario/crudusuario.component';
import { nuevoClienteComponent } from './clientes/nuevoCliente/nuevoCliente.component';
import { EditarClientesComponent } from './clientes/editarClientes/editar-clientes.component';
import { EditarUsuariosComponent } from './crudusuario/editarUsuarios/editar-usuarios.component';
import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es')


const routes: Routes = [



  {
    path: 'bienvenida',
    component: BienvenidaComponent
  },
  {
    path: 'administracionclientes',
    component: ClientesComponent
  },
  
  {
    path: 'crudusuario',
    component: CrudusuarioComponent
  },
 

  {
    path: 'editarcliente/:id',
    component: EditarClientesComponent
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
    ClientesComponent,
    nuevoClienteComponent,
    CrudusuarioComponent,
    EditarClientesComponent,
    EditarUsuariosComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

  ],
  providers: [{provide: LOCALE_ID,useValue: 'es'}]
})
export class AdministracionModule {
}



