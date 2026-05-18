import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '../../../services/translate.service';
import { Translate } from '../../../models/translate.model';

@Component({
  selector: 'app-translate-list',
  templateUrl: './translate-list.html',
  styleUrl: './translate-list.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TranslateList implements OnInit {

  historial: Translate[] = [];
  cargando: boolean = false;
  mensaje: string = '';

  // Modal Ver
  mostrarModalVer: boolean = false;
  itemVer: Translate | null = null;

  // Modal Editar
  mostrarModalEditar: boolean = false;
  itemEditar: Translate | null = null;
  editOriginal: string = '';
  editTo: string = 'en';
  editStatus: string = 'activo';
  guardando: boolean = false;

  constructor(private service: TranslateService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.cargando = true;

    this.service.historial().subscribe({
      next: (data: Translate[]) => {
        this.historial = data;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error(err);
        this.mensaje = 'Error al cargar historial';
        this.cargando = false;
      }
    });
  }

  ver(item: Translate) {
    this.itemVer = item;
    this.mostrarModalVer = true;
  }

  cerrarVer() {
    this.mostrarModalVer = false;
    this.itemVer = null;
  }

  editar(item: Translate) {
    this.itemEditar = item;
    this.editOriginal = item.original || '';
    this.editTo = item.to || 'en';
    this.editStatus = item.status || 'activo';
    this.mostrarModalEditar = true;
  }

  cerrarEditar() {
    this.mostrarModalEditar = false;
    this.itemEditar = null;
    this.editOriginal = '';
    this.editTo = 'en';
    this.editStatus = 'activo';
  }

  guardarEdicion() {
    if (!this.itemEditar || !this.itemEditar.id) return;

    this.guardando = true;

    const actualizado = {
      original: this.editOriginal,
      to: this.editTo,
      status: this.editStatus
    };

    this.service.actualizar(this.itemEditar.id, actualizado).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente';
        this.guardando = false;
        this.cerrarEditar();
        this.cargarHistorial();
      },
      error: (err: any) => {
        console.error(err);
        this.mensaje = 'Error al actualizar';
        this.guardando = false;
      }
    });
  }

  eliminar(id?: number) {
    if (!id) return;

    if (!confirm('¿Eliminar este registro?')) return;

    this.service.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Eliminado correctamente';
        this.cargarHistorial();
      },
      error: (err: any) => {
        console.error(err);
        this.mensaje = 'Error al eliminar';
      }
    });
  }
}