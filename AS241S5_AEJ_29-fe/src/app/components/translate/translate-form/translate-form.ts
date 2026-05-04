import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '../../../services/translate.service';
import { Translate } from '../../../models/translate.model';

@Component({
  selector: 'app-translate-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translate-form.html',
  styleUrls: ['./translate-form.css']
})
export class TranslateForm {

  text: string = '';
  to: string = 'en';
  cargando: boolean = false;
  mensaje: string = '';
  resultado?: Translate;

  constructor(private service: TranslateService) {}

  traducir() {
    if (!this.text.trim()) {
      this.mensaje = 'Ingresa un texto para traducir';
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.resultado = undefined;

    this.service.traducir(this.text, this.to).subscribe({
      next: (res: Translate) => {
        this.resultado = res;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error(err);
        this.mensaje = 'Error al traducir';
        this.cargando = false;
      }
    });
  }
}
