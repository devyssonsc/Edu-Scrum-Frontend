import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss'
})
export class StatsCardComponent {
  @Input() title!: string;
  @Input() value!: number;
  @Input() description!: string;
  @Input() iconClass!: string;
}
