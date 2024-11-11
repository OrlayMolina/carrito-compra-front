import { DetalleCarroComprasDTO } from "./detalle-carro-compras-dto";
import { Estado } from "./estado";

export interface CarroComprasDTO {

  id: string,
  codigo: string,
  fecha: string,
  hora: string,
  estado: Estado,
  observaciones: string,
  detalle: DetalleCarroComprasDTO[],
  total: number
}
