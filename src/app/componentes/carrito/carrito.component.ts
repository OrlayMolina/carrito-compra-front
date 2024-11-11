import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarroComprasDTO } from '../../dto/carro-compras-dto';
import { DetalleCarroComprasDTO } from '../../dto/detalle-carro-compras-dto';
import { TokenService } from '../../servicios/token.service';
import { CarroComprasService } from '../../servicios/carro-compras.service';
import Swal from 'sweetalert2';
import { ProductoDTO } from '../../dto/producto-dto';
import { ProductoService } from '../../servicios/producto.service';
import { Router } from '@angular/router';
import { Estado } from '../../dto/estado';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  carrito: CarroComprasDTO;
  carritoItems: DetalleCarroComprasDTO[] = [];
  listaProductos: ProductoDTO[] = [];
  cargando: boolean = true;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private productoService: ProductoService,
    private carroService: CarroComprasService
  ) {
    this.carrito = {
      id: '',
      codigo: '',
      fecha: '',
      hora: '',
      estado: Estado.INACTIVO,
      observaciones: '',
      detalle: [] as DetalleCarroComprasDTO[],
      total: 0
    };

    this.inicializarDatos();
  }

  async inicializarDatos() {
    try {
      await Promise.all([this.cargarEventos(), this.cargarCarrito()]);
      this.asociarImagenes();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      this.cargando = false;
    }
  }

  cargarCarrito(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = this.tokenService.getToken();
      if (token) {
        const payload = this.tokenService.decodePayload(token);
        const userId = payload.id;

        this.carroService.obtenerCarroComprasCiudadano(userId).subscribe({
          next: (data) => {
            this.carritoItems = data.respuesta.detalle.map((item: CarroComprasDTO) => ({
              id: item.id,
              codigo: item.codigo,
              fecha: item.fecha,
              hora: item.hora,
              estado: item.estado,
              observaciones: item.observaciones,
              detalle: item.detalle,
              total: item.total

            }));

            this.carrito = data.respuesta;
            resolve();
          },
          error: (error) => {
            console.error(error.error.respuesta);
            reject(error);
          }
        });
      } else {
        reject('Token no encontrado');
      }
    });
  }

  cargarEventos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productoService.listarProductos().subscribe({
        next: (data) => {
          this.listaProductos = data.respuesta;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar los eventos:', error);
          reject(error);
        }
      });
    });
  }

  private asociarImagenes(): void {
    this.carritoItems.forEach((item) => {
      const producto = this.listaProductos.find((producto) => producto.id === item.codigoProducto);
      if (producto) {
        item.foto = producto.foto;
      }
    });
  }

  eliminarItemCarrito(idCarrito: string, idEvento: string) {
    this.carroService.eliminarItemCarrito(idCarrito, idEvento).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Eliminar Item Carrito',
          text: data.respuesta,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4C3181',
        });

        this.inicializarDatos();
      },
      error: (error) => {
        Swal.fire({
          title: 'Eliminar Item Carrito',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#8b0000',
        });
      }
    });
  }

  tramitarReserva(){
    this.carroService.tramiteReserva(this.tokenService.getEmail()).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Tramitar Reserva',
          text: data.respuesta,
          icon: 'success',
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#4C3181'
        })
      },
      error:(error) => {
        Swal.fire({
          title: 'Tramitar Reserva',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#8b0000'
        })
      }
    })
  }

  calcularTotalProductos() {
    return this.carritoItems.reduce((total, item) => total + item.cantidad, 0);
  }

  calcularTotal() {
    const precioUnitario = 17.99; // Cambia este valor si tienes precios diferentes
    return this.carritoItems.reduce((total, item) => total + item.cantidad * precioUnitario, 0);
  }

  actualizarCantidad(item: DetalleCarroComprasDTO) {
    // Aquí puedes agregar la lógica para actualizar la cantidad en el backend si es necesario
  }
}
