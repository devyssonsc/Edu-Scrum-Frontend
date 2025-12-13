import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { DataService, Award, Course } from '../../services/dataService';

@Component({
  selector: 'app-teacher-award-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatsCardComponent],
  templateUrl: './teacher-award-detail.component.html',
  styleUrl: './teacher-award-detail.component.scss'
})
export class TeacherAwardDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private fb = inject(FormBuilder);
  
  award: Award | undefined;
  awardId: number | null = null;

  assignmentsCount: number = 0;
  editForm: FormGroup;
  myCourses: Course[] = [];

  constructor() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      courseId: [null]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.awardId = Number(id);
      this.loadAwardData();
    }
    
    this.dataService.getCourses().subscribe(data => this.myCourses = data);
  }

  loadAwardData() {
    if (this.awardId) {
      this.dataService.getAwards().subscribe(allAwards => {
        this.award = allAwards.find(a => a.id === this.awardId);
        
        if (this.award) {
          this.editForm.patchValue({
            name: this.award.name,
            description: this.award.description,
            points: this.award.points,
            courseId: this.award.courseId 
          });

          this.dataService.getAssignmentsByAward(this.award.id).subscribe(data => {
               this.assignmentsCount = data.length;
          });
        }
      });
    }
  }

  onSaveEdit() {
    if (this.editForm.valid && this.awardId) {
      
      this.dataService.updateAward(this.awardId, this.editForm.value).subscribe({
        next: (success) => {
          if (success) {
            alert('Changes saved successfully!');
            this.loadAwardData();
            this.editForm.markAsPristine(); 
          } else {
            alert('Error saving changes.');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error saving changes.');
        }
      });
    }
  }
}