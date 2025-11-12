import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-section-selector',
  standalone: true,
  imports: [],
  templateUrl: './section-selector.component.html',
  styleUrl: './section-selector.component.scss'
})
export class SectionSelectorComponent {
  @Input() options: string[] = [];
  @Output() selectedOption = new EventEmitter<string>();

  selectedIndex = 0;

  onSelectOption(index: number) {
    this.selectedIndex = index;
    this.selectedOption.emit(this.options[index]);
  }
}
