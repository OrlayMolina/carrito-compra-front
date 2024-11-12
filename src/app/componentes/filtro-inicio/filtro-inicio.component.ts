import { Component, EventEmitter, Output } from '@angular/core';
import { FiltroProductoDTO } from '../../dto/filtro-producto-dto';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../servicios/producto.service';
import { Categoria } from '../../dto/categoria';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriaDTO } from '../../dto/categoria-dto';

@Component({
  selector: 'app-filtro-inicio',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './filtro-inicio.component.html',
  styleUrl: './filtro-inicio.component.css'
})
export class FiltroInicioComponent {

  @Output() filtrosAplicados = new EventEmitter<FiltroProductoDTO>();

  categorias: Categoria[] = [];
  filtroForm: FormGroup;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {

    this.filtroForm = this.fb.group({
      nombre: [''],
      categoria: ['']
    });

    this.listarCategorias();
    this.listarPorPrecioMenor();
    this.listarPorNombre();
    this.listarPorCategorias();
  }

  public listarCategorias() {
    this.productoService.listarCategorias().subscribe({
      next: (data) => {
        this.categorias = data.respuesta.map((item: CategoriaDTO) => item.nombre);
      },
      error: (error) => {
        console.error('Error al cargar las ciudades:', error);
      }
    });
  }

  public listarPorPrecioMenor(){

  }

  public listarPorNombre(){

  }

  public listarPorCategorias(){

  }

  public aplicarFiltros() {
    const filtro: FiltroProductoDTO = this.filtroForm.value;
    this.filtrosAplicados.emit(filtro);
  }
}
