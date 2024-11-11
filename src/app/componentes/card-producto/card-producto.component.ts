import { Component, Input } from '@angular/core';
import { ProductoDTO } from '../../dto/producto-dto';
import { Router } from '@angular/router';
import { ProductoService } from '../../servicios/producto.service';

@Component({
  selector: 'app-card-producto',
  standalone: true,
  imports: [],
  templateUrl: './card-producto.component.html',
  styleUrl: './card-producto.component.css'
})
export class CardProductoComponent {

  @Input() producto!: ProductoDTO;

  constructor(private router: Router){

  }

  public agregarAlCarrito(id: string){
    this.router.navigate(['/gestion-carrito',id]);
  }
}
