import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-selector.component.html',
  styleUrl: './section-selector.component.scss'
})
export class SectionSelectorComponent {
  
  @Input() options: string[] = [];
  @Input() activeOption: string = ''; 

  @Output() selectedOption = new EventEmitter<string>();

  selectOption(option: string) {
    this.activeOption = option;
    this.selectedOption.emit(option);
  }

  // Calcula a posição percentual da barra deslizante (left)
  getLeftPosition(): string {
    if (!this.options || this.options.length === 0) return '0%';
    
    const index = this.options.indexOf(this.activeOption);
    if (index === -1) return '0%';

    // Ex: Se houver 4 opções, cada uma ocupa 25%.
    // Index 0 -> 0%
    // Index 1 -> 25%
    // Index 2 -> 50%
    const percentage = (index * 100) / this.options.length;
    return `${percentage}%`;
  }
}