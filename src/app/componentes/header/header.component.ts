import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { CarritoHeaderComponent } from '../carrito-header/carrito-header.component';
import Swal from 'sweetalert2';
import { TokenService } from '../../servicios/token.service';
import { CarroComprasDTO } from '../../dto/carro-compras-dto';
import { DetalleCarroComprasDTO } from '../../dto/detalle-carro-compras-dto';
import { Estado } from '../../dto/estado';
import { ProductoDTO } from '../../dto/producto-dto';
import { ProductoService } from '../../servicios/producto.service';
import { CarroComprasService } from '../../servicios/carro-compras.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CarritoHeaderComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  mostrarElementos: boolean = true;
  isLoggedIn: boolean = false;
  email: string = '';
  nombreUsuario: string = '';
  userMenuOpen: boolean = false;
  cartMenuOpen: boolean = false;
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
      detalle: [],
      total: 0
    };
    this.isLoggedIn = this.tokenService.isLogged();
    if (this.isLoggedIn) {
      this.email = this.tokenService.getEmail();
    }
    this.router.events.subscribe(() => {
      this.verificarRuta();
    });

    this.inicializarDatos();
  }

  async inicializarDatos() {
    try {
      await Promise.all([this.cargarProductos(), this.cargarCarrito(), this.verificarToken()]);
      this.asociarImagenes();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      this.cargando = false;
    }
  }

  verificarRuta() {
    const rutaActual = this.router.url;
    this.mostrarElementos = ![
      '/login'
    ].includes(rutaActual);
  }

  verificarToken() {
    const token = this.tokenService.getToken();
    if (token) {
      const payload = this.tokenService.decodePayload(token);
      this.isLoggedIn = true;
      this.nombreUsuario = (payload.nombre || '') + ' ' + (payload.apellido || '');;
    } else {
      this.isLoggedIn = false;
      this.nombreUsuario = '';
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
            this.carritoItems = data.respuesta.detalle.map((item: DetalleCarroComprasDTO) => ({
              codigo: item.codigoProducto,
              foto: '',
              monto: item.monto,
              impuestos: item.impuestos,
              subtotal: item.subtotal,
              cantidad: item.cantidad

            }));

            this.carrito = data.respuesta;
            resolve();
          },
          error: (error) => {
            reject(error);
          }
        });
      } else {
        reject('Token no encontrado');
      }
    });
  }

  cargarProductos(): Promise<void> {
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

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    this.cartMenuOpen = false;
  }

  toggleCartMenu() {
    this.cartMenuOpen = !this.cartMenuOpen;
    this.userMenuOpen = false;
  }

  logout() {
    this.tokenService.logout();
  }

  irGestionCarrito(){
    this.cartMenuOpen = !this.cartMenuOpen;
    this.router.navigate(['/gestion-carrito']);
  }
}
