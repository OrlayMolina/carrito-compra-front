import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';

@Injectable({
  providedIn: 'root'
})
export class CarroComprasService {

  private carroURL = "http://localhost:8080/api/carrito";

  constructor(private http: HttpClient) { }

  public obtenerCarroComprasCiudadano(idCuenta: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.carroURL}/usuario/${idCuenta}`);
  }

  public eliminarItemCarrito(idCarrito: string, idDetalleCarrito: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.carroURL}/${idCarrito}/items/${idDetalleCarrito}`);
  }

  public tramiteReserva(email: string): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.carroURL}/tramite-reserva/${email}`, {});
  }
}
