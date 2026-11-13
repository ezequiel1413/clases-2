import { Component, OnInit, inject } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

interface Categoria {
  id: number;
  nombre: string;
  detalle: string;
}

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {

  private categoriaService = inject(CategoriaService);

  categorias: Categoria[] = [];
  dialog_visible: boolean = false;
  categoria_id: number = -1;

  categoriaForm = new FormGroup({
    nombre: new FormControl(''),
    detalle: new FormControl('')
  });

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias() {
    this.categoriaService.funListar().subscribe(
      (res: any) => {
        this.categorias = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  mostarDialog() {
    this.categoria_id = -1;
    this.categoriaForm.reset();
    this.dialog_visible = true;
  }

  guardarCategoria() {

    if (this.categoria_id > 0) {

      // MODIFICAR CATEGORÍA
      this.categoriaService.funModificar(
        this.categoria_id,
        this.categoriaForm.value
      ).subscribe(
        (res: any) => {
          this.dialog_visible = false;
          this.getCategorias();
          this.categoria_id = -1;

          Swal.fire({
            title: 'MODIFICADO',
            text: 'La categoría se modificó con éxito!',
            icon: 'success'
          });
        },
        (error: any) => {
          console.log(error);
        }
      );

    } else {

      // REGISTRAR CATEGORÍA
      this.categoriaService.funGuardar(this.categoriaForm.value).subscribe(
        (res: any) => {
          this.dialog_visible = false;
          this.getCategorias();

          Swal.fire({
            title: 'REGISTRADO',
            text: 'La categoría se creó con éxito!',
            icon: 'success'
          });
        },
        (error: any) => {
          console.log(error);
        }
      );

    }

    this.categoriaForm.reset();
  }

  editarCategoria(cat: Categoria) {
    this.dialog_visible = true;
    this.categoria_id = cat.id;

    this.categoriaForm.setValue({
      nombre: cat.nombre,
      detalle: cat.detalle
    });
  }

  eliminarCategoria(cat: Categoria) {

    Swal.fire({
      title: '¿Estás seguro de eliminar la categoría?',
      text: 'Una vez eliminada no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {

      if (result.isConfirmed) {

        this.categoriaService.funEliminar(cat.id).subscribe(
          (res: any) => {

            Swal.fire({
              title: 'ELIMINADO!',
              text: 'Categoría eliminada',
              icon: 'success'
            });

            this.getCategorias();
            this.categoria_id = -1;

          },
          (error: any) => {

            Swal.fire({
              title: 'ERROR!',
              text: 'Error al intentar eliminar',
              icon: 'error'
            });

            console.log(error);
          }
        );

      }

    });

  }

}