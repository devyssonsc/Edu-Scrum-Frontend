import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-show-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.scss']
})
export class ShowTableComponent {
  @Input() data: any[] = [];
  @Input() showDelete: boolean = true

  @Output() editRow = new EventEmitter<any>();

  // Getter para pegar as colunas baseado no primeiro objeto
  get columns(): string[] {
    if (!this.data || this.data.length === 0) return [];
    return Object.keys(this.data[0]);
  }
  onEditClick(row: any) {
    this.editRow.emit(row);
  }
}
