import { Component, Input } from '@angular/core';
import { DetalleCarroComprasDTO } from '../../dto/detalle-carro-compras-dto';

@Component({
  selector: 'app-carrito-header',
  standalone: true,
  imports: [],
  templateUrl: './carrito-header.component.html',
  styleUrl: './carrito-header.component.css'
})
export class CarritoHeaderComponent {

  @Input("item") item?: DetalleCarroComprasDTO;
}
