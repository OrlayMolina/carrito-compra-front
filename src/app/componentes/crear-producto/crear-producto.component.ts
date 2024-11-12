import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControlOptions } from '@angular/forms';
  import Swal from 'sweetalert2';
import { ProductoDTO } from '../../dto/producto-dto';
import { ProductoService } from '../../servicios/producto.service';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,CommonModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent {

  tiposDeEvento: string[];
  crearEventoForm!: FormGroup;

  constructor(private productoService: ProductoService, private formBuilder: FormBuilder)
  {
    this.crearFormulario();
    this.tiposDeEvento = ['Concierto', 'Fiesta', 'Teatro', 'Deportes'];
  }

  private crearFormulario() {
    this.crearEventoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      localidades: this.formBuilder.array([]),
      imagenPortada: ['', [Validators.required]],
      imagenLocalidades: ['', [Validators.required]],
    });
  }

  public onFileChange(event:any, tipo:string){
    if (event.target.files.length > 0) {

      const files = event.target.files;

      switch(tipo){
        case 'localidades':
          this.crearEventoForm.get('imagenLocalidades')?.setValue(files[0]);
          break;
        case 'portada':
          this.crearEventoForm.get('imagenPortada')?.setValue(files[0]);
          break;
      }
    }
  }

  public crearProducto(){
    this.productoService.crearProducto(this.crearEventoForm.value as ProductoDTO);
    Swal.fire("Exito!", "Se ha creado un nuevo evento.", "success");
  }
}
