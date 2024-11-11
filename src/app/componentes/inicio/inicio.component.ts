import { Component } from '@angular/core';
import { FiltroInicioComponent } from '../filtro-inicio/filtro-inicio.component';
import { CardProductoComponent } from '../card-producto/card-producto.component';
import { CommonModule } from '@angular/common';
import { ProductoDTO } from '../../dto/producto-dto';
import { ProductoService } from '../../servicios/producto.service';
import { FiltroProductoDTO } from '../../dto/filtro-producto-dto';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    FiltroInicioComponent,
    CardProductoComponent,
    CommonModule
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  listaProductos: ProductoDTO[] = [];

  constructor(
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.productoService.listarProductos().subscribe({
      next: (data) => {
        this.listaProductos = data.respuesta;
      },
      error: (error) => {
        console.error('Error al cargar los eventos:', error);
      }
    });
  }

  public filtrarProductos(filtro: FiltroProductoDTO): void {

    if (!filtro.categoria && !filtro.precio && !filtro.nombre) {
      this.cargarProductos();
      return;
    }

    console.log("Filtro enviado al backend:", filtro);
    this.productoService.filtroEvento(filtro).subscribe({
      next: (data) => {
        this.listaProductos = data.respuesta;
      },
      error: (error) => {
        console.error("Error al filtrar los eventos: ", error);
      }
    });
  }
}
