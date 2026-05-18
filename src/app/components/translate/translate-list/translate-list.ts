import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../services/translate.service';
import { Translate } from '../../../models/translate.model';

@Component({
  selector: 'app-translate-list',
  templateUrl: './translate-list.html',
  styleUrl: './translate-list.css',
})
export class TranslateList implements OnInit {

  historial: Translate[] = [];
  cargando: boolean = false;
  mensaje: string = '';

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