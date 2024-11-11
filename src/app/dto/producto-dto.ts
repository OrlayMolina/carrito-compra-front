import { CaracteristicaDTO } from "./caracteristica-dto"
import { Categoria } from "./categoria"
import { DetalleProductoDTO } from "./detalle-producto-dto"
import { Estado } from "./estado"

export interface ProductoDTO {

    id: string,
    codigo: string,
    nombre: string,
    categoriaPrincipal: Categoria,
    categoriaSecundaria: Categoria,
    foto: string,
    descripcion: string,
    precio: number,
    stock: number,
    detalle: DetalleProductoDTO[],
    caracteristic: CaracteristicaDTO[],
    garantia: boolean,
    estado: Estado
}
