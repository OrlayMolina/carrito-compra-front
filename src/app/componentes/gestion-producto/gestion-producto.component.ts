import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardProductoComponent } from '../card-producto/card-producto.component';
import { ProductoDTO } from '../../dto/producto-dto';
import { InformacionProductoDTO } from '../../dto/informacion-producto-dto';
import { ProductoService } from '../../servicios/producto.service';

@Component({
  selector: 'app-gestion-producto',
  standalone: true,
  imports: [
    RouterModule,CardProductoComponent
  ],
  templateUrl: './gestion-producto.component.html',
  styleUrl: './gestion-producto.component.css'
})
export class GestionProductoComponent {

  listaProductos: InformacionProductoDTO[] = [];
  productos: ProductoDTO[];
  seleccionados: InformacionProductoDTO[];
  textoBtnEliminar: string;

  constructor(public productoService: ProductoService) {
    this.productos = [];
    this.seleccionados = [];
    this.textoBtnEliminar = "";
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.productoService.listarProductos().subscribe({
      next: (data) => {
        this.listaProductos = data.respuesta;
        console.log(data.respuesta);
      },
      error: (error) => {
        console.error('Error al cargar los eventos:', error);
      }
    });
  }


  public seleccionar(evento: InformacionProductoDTO, estado: boolean) {


    if (estado) {
      this.seleccionados.push(evento);
    } else {
      this.seleccionados.splice(this.seleccionados.indexOf(evento), 1);
    }
    this.actualizarMensaje();
   }


   private actualizarMensaje() {
    const tam = this.seleccionados.length;


    if (tam != 0) {
      if (tam == 1) {
        this.textoBtnEliminar = "1 elemento";
      } else {
        this.textoBtnEliminar = tam + " elementos";
      }
    } else {
      this.textoBtnEliminar = "";
    }
   }
}
