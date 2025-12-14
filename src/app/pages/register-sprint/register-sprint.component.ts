import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { enviroments } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-register-sprint',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-sprint.component.html',
  styleUrl: './register-sprint.component.scss'
})
export class RegisterSprintComponent implements OnInit {

  private fb = inject(FormBuilder);
  sprintForm: FormGroup;
  newCourseName = this.fb.control('', Validators.required);
  showAddInput = false;
  isSubmitted = false;

  selectedCourseId = new FormControl<number | null>(null, Validators.required);

  projectId: number | null = null;

  today = new Date().toISOString().split('T')[0];

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.sprintForm = this.fb.group({
      sprintNumber: [0, Validators.required],
      finalGoal: ['', Validators.required],
      startDate: ['', Validators.required, this.startDateAfterTodayValidator],
      endDate: ['', Validators.required],
      tasks: this.fb.array([], Validators.minLength(0))
    },
    {
      validators: this.endDateAfterStartDateValidator
    });
  }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
  }

  get tasks() {
    return this.sprintForm.get('tasks') as FormArray;
  }

  newTaskGroup(description: string): FormGroup {
    return this.fb.group({
      description: [description],
    });
  }

  addTask() {
    const description = this.newCourseName.value?.trim();

    this.tasks.push(this.fb.control(description));

    this.newCourseName.reset();
    this.showAddInput = false;
  }

  removeTask(index: number) {
    this.tasks.removeAt(index);
  }

  onSubmit() {
    this.isSubmitted = true;
    this.sprintForm.markAllAsTouched();

    if (this.sprintForm.valid) {

      const newTasks = this.sprintForm.value.tasks

      delete this.sprintForm.value.tasks
      console.log('Formulário Válido:', this.sprintForm.value);
      this.httpClient.post(`${enviroments.apiUrl}/projects/${this.projectId}/sprints`, this.sprintForm.value).subscribe((response: any) => {
        console.log('Resposta do servidor:', response);
        alert('The Degree was successfully registered.');

        newTasks.forEach((taskDescription: String) => {
          this.httpClient.post(`${enviroments.apiUrl}/sprints/${response.id}/tasks`, {
            description: taskDescription
          }).subscribe(r => console.log("task criada:", r));
        });

        this.router.navigate([`/student-dashboard`]);
      },
        (err: HttpErrorResponse) => {
          console.log('Erro ao enviar o formulário:', err);
        });
    } else {
      console.log('Formulário Inválido');
    }
  }

  startDateAfterTodayValidator(control: FormControl) {
    if (!control.value) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(control.value);

    return startDate > today
      ? null
      : { startDateBeforeToday: true };
  }

  endDateAfterStartDateValidator(group: FormGroup) {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (!startDate || !endDate) return null;

    return new Date(endDate) > new Date(startDate)
      ? null
      : { endDateBeforeStartDate: true };
  }


}
