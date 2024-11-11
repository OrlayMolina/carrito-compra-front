import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { GestionProductoComponent } from './componentes/gestion-producto/gestion-producto.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: "gestion-carrito", component: CarritoComponent },
  { path: "gestion-productos", component: GestionProductoComponent},
  { path: "**", pathMatch: "full", redirectTo: "" }
];
