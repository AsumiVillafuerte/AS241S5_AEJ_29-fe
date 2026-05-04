import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '../../../services/translate.service';
import { Translate } from '../../../models/translate.model';

@Component({
  selector: 'app-translate-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translate-list.html',
  styleUrls: ['./translate-list.css'],
})
export class TranslateList implements OnInit {

  historial: Translate[] = [];
  cargando: boolean = false;
  mensaje: string = '';

  // Modal Ver
  itemVer?: Translate;
  mostrarModalVer: boolean = false;

  // Modal Editar
  itemEditar?: Translate;
  editOriginal: string = '';
  editTo: string = '';
  editStatus: string = 'activo';
  guardando: boolean = false;
  mostrarModalEditar: boolean = false;

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

  // --- VER ---
  ver(item: Translate) {
    this.itemVer = item;
    this.mostrarModalVer = true;
  }

  cerrarVer() {
    this.mostrarModalVer = false;
    this.itemVer = undefined;
  }

  // --- EDITAR ---
  editar(item: Translate) {
    this.itemEditar = { ...item };
    this.editOriginal = item.original;
    this.editTo = item.to;
    this.editStatus = item.status || 'activo';
    this.mostrarModalEditar = true;
  }

  cerrarEditar() {
    this.mostrarModalEditar = false;
    this.itemEditar = undefined;
  }

  guardarEdicion() {
    if (!this.itemEditar?.id) return;
    this.guardando = true;

    setTimeout(() => {
      this.historial = this.historial.map(h =>
        h.id === this.itemEditar!.id
          ? { ...h, original: this.editOriginal, to: this.editTo, status: this.editStatus }
          : h
      );
      this.mensaje = '✅ Actualizado correctamente (simulado)';
      setTimeout(() => this.mensaje = '', 2000);
      this.guardando = false;
      this.cerrarEditar();
    }, 600);
  }

  // --- ELIMINAR (lógico) ---
  eliminar(id?: number) {
    if (!id) return;
    const item = this.historial.find(h => h.id === id);
    if (!item) return;

    const nuevoEstado = item.status === 'inactivo' ? 'activo' : 'inactivo';
    const accion = nuevoEstado === 'inactivo' ? 'desactivar' : 'activar';

    if (!confirm(`¿Deseas ${accion} este registro?`)) return;

    setTimeout(() => {
      this.historial = this.historial.map(h =>
        h.id === id ? { ...h, status: nuevoEstado } : h
      );
      this.mensaje = `✅ Registro ${nuevoEstado === 'inactivo' ? 'desactivado' : 'activado'} correctamente`;
      setTimeout(() => this.mensaje = '', 2000);
    }, 400);
  }
}
