import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { YoutubeService } from '../../../services/youtube.service';
import { Youtube } from '../../../models/youtube.model';

@Component({
  selector: 'app-youtube-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './youtube-list.html',
  styleUrls: ['./youtube-list.css']
})
export class YoutubeList implements OnInit {

  url: string = '';
  cargando: boolean = false;
  mensaje: string = '';
  resultado?: Youtube;
  historial: Youtube[] = [];

  // Modal Ver
  itemVer?: Youtube;
  mostrarModalVer: boolean = false;

  // Modal Editar
  itemEditar?: Youtube;
  editStatus: string = 'activo';
  guardando: boolean = false;
  mostrarModalEditar: boolean = false;

  constructor(private service: YoutubeService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.service.historial().subscribe({
      next: (data: Youtube[]) => {
        this.historial = data;
      },
      error: (err: any) => {
        console.error('Error historial youtube:', err);
      }
    });
  }

  descargar() {
    if (!this.url.trim()) {
      this.mensaje = 'Ingresa una URL de YouTube';
      return;
    }
    this.cargando = true;
    this.mensaje = '';
    this.resultado = undefined;

    this.service.descargar(this.url).subscribe({
      next: (res: Youtube) => {
        this.resultado = res;
        this.mensaje = 'Descarga en proceso... actualizando historial';
        this.url = '';
        this.cargando = false;
        // Recarga inmediata y luego a los 3s para capturar downloadUrl
        this.cargarHistorial();
        setTimeout(() => {
          this.cargarHistorial();
          this.mensaje = 'Descarga completada';
        }, 3000);
      },
      error: (err: any) => {
        console.error(err);
        if (err.status === 0) {
          this.mensaje = '⚠️ No se puede conectar al servidor. Verifica que el puerto del Codespace sea público.';
        } else if (err.status === 403) {
          this.mensaje = '⚠️ Error de permisos (403): La API key de YouTube puede estar vencida o sin créditos.';
        } else if (err.status === 404) {
          this.mensaje = '⚠️ Endpoint no encontrado (404). Verifica la URL del backend.';
        } else {
          this.mensaje = `⚠️ Error ${err.status}: ${err?.error?.msg || err?.message || 'intenta de nuevo'}`;
        }
        this.cargando = false;
      }
    });
  }

  getUrl(item: Youtube): string {
    return item.url || item.videoUrl || item.video_url || '';
  }

  // --- VER ---
  ver(item: Youtube) {
    this.itemVer = item;
    this.mostrarModalVer = true;
  }

  cerrarVer() {
    this.mostrarModalVer = false;
    this.itemVer = undefined;
  }

  // --- EDITAR ---
  editar(item: Youtube) {
    this.itemEditar = { ...item };
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
          ? { ...h, status: this.editStatus }
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

    const esActivo = item.status !== 'inactivo';
    const nuevoEstado = esActivo ? 'inactivo' : 'completed';
    const accion = esActivo ? 'desactivar' : 'restaurar';

    if (!confirm(`¿Deseas ${accion} este registro?`)) return;

    setTimeout(() => {
      this.historial = this.historial.map(h =>
        h.id === id ? { ...h, status: nuevoEstado } : h
      );
      this.mensaje = `✅ Registro ${esActivo ? 'desactivado' : 'restaurado'} correctamente`;
      setTimeout(() => this.mensaje = '', 2000);
    }, 400);
  }
}
