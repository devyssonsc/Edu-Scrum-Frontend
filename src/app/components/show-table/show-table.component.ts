import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-table.component.html',
  styleUrl: './show-table.component.scss'
})
export class ShowTableComponent {
  @Input() data: any[] = [];

  // Getter para pegar as colunas baseado no primeiro objeto
  get columns(): string[] {
    if (!this.data || this.data.length === 0) return [];
    return Object.keys(this.data[0]);
  }
}
