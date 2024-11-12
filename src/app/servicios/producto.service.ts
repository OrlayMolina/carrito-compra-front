import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { FiltroProductoDTO } from '../dto/filtro-producto-dto';
import { ProductoDTO } from '../dto/producto-dto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productoURL = "http://localhost:8080/api/productos";

  constructor(private http: HttpClient) { }

  public listarProductos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.productoURL}/todos`)
  }

  public listarCategorias(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.productoURL}/producto/obtener-categorias`);
  }

  public filtroProducto(filtro: FiltroProductoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.productoURL}/producto/filtrar`, filtro);
  }

  public crearProducto(producto: ProductoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.productoURL}/producto/crear`, producto);
  }
}
