import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SectionSelectorComponent } from '../../components/section-selector/section-selector.component';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { HttpClient } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';

import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [StatsCardComponent, SectionSelectorComponent, ShowTableComponent, BaseChartDirective, CommonModule,
    ReactiveFormsModule,],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {


  userRankingData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: '',
        data: []
      }
    ]
  };

  userRankingOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y' // 👈 ISSO deixa horizontal
  };

  teamRankingData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: '',
        data: []
      }
    ]
  };

  teamRankingOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };

  data: any | any[] = [];

  awards: any[] = [];
  projects: any[] = [];

  rankings: {
    studentInfo: any;
    individualRankings: any[];
    teamRankingsByCourse: any[];
  } | null = null;

  currentUserId: string = localStorage.getItem('id') || '';

  sections: string[] = ['Awards', 'Dashboard', 'Rankings'];

  selectedOption: string = this.sections[0];
  developers: any[] = [];

  constructor(private httpClient: HttpClient) {
    // this.taskForm = this.fb.group({
    //   task: this.fb.array([], Validators.minLength(0)) 
    // });
  }

  ngOnInit(): void {
    this.onSelectOption(this.selectedOption);
    // this.fetchData();
  }

  fetchData() {
    this.httpClient.get(`${enviroments.apiUrl}/students/${localStorage.getItem('id')}/${this.selectedOption.toLowerCase()}`).subscribe((response: any) => {
      if (this.selectedOption === 'Awards') {
        for (let award of response) {
          if (award.badgeIcon == null) {
            award.badgeIcon = 'generic-badge';
          }
        }
      }

      if (this.selectedOption === 'Rankings') {
        this.rankings = response;
        const userLabels = response.individualRankings.map((item: any) => item.studentName) || [];
        const userScores = response.individualRankings.map((item: any) => item.totalScore);
        this.userRankingData = {
          labels: userLabels,
          datasets: [
            {
              label: 'Score',
              data: userScores
            }
          ]
        };

        const teamLabels = response.teamRankingsByCourse[0].rankings.map((item: any) => item.teamName);
        const teamScores = response.teamRankingsByCourse[0].rankings.map((item: any) => item.totalScore);
        this.teamRankingData = {
          labels: teamLabels,
          datasets: [
            {
              label: 'Total Score',
              data: teamScores
            }
          ]
        };
      } else {
        this.data = response;
      }
      console.log(this.rankings);
    });
  }


  // get columns(): string[] {
  //   if (!this.allData.degrees || this.allData.degrees.length === 0) return [];
  //   return Object.keys(this.allData.degrees[0]);
  // }

  onSelectOption(event: any) {
    console.log(event);
    this.selectedOption = event;
    if (this.selectedOption == 'Rankings') {

    }
    this.fetchData();
  }

  getSprintStatus(sprint: any): string {
    const currentDate = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const allTasksDone = sprint.tasks.every((task: any) => task.status === 'DONE');

    if (currentDate < startDate) {
      return 'Not Started';
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return 'In Progress';
    } else if (allTasksDone) {
      return 'Completed';
    } else {
      return 'Overdue';
    }
  }

  getSprintStatusClass(sprint: any): string {
    const status = this.getSprintStatus(sprint);
    if (status === 'Not Started') {
      return ' text-bg-secondary';
    } else if (status === 'In Progress') {
      return ' text-bg-primary';
    } else if (status === 'Overdue') {
      return ' text-bg-danger';
    } else {
      return ' text-bg-success';
    }
  }

  getProjectProgress(project: any): number {

    if (!project?.sprints || project.sprints.length === 0) {
      return 0;
    }

    const totalTasks = project.sprints.reduce(
      (sum: number, sprint: any) => sum + (sprint.tasks?.length ?? 0),
      0
    );

    const completedTasks = project.sprints.reduce(
      (sum: number, sprint: any) =>
        sum + (sprint.tasks?.filter((task: any) => task.status === 'DONE').length ?? 0),
      0
    );

    return totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);
  }

  isCurrentUser(student: any): boolean {
    if (localStorage.getItem('id') == student.studentId) {
      return true;
    }
    return false;
  }

  isCurrentUserTeam(team: any): boolean {
    if (team.members.some((member: any) => localStorage.getItem('id') == member.studentId)) {
      return true;
    }
    return false;
  }

  changeTaskStatus(taskId: number, newStatus: string) {
    this.httpClient.patch(`${enviroments.apiUrl}/tasks/${taskId}/status`, { status: newStatus }).subscribe(response => {
      console.log('Task status changed successfully', response);
      this.fetchData();
    }, error => {
      console.error('Error changing task status', error);
    });
  }

  getProjectDevelopers(sprintId: number): void {
    this.httpClient.get(`${enviroments.apiUrl}/teams/developers?sprintId=${sprintId}`).subscribe((response: any) => {
      this.developers = response;
    });
  }

  assignTaskToDeveloper(taskId: number, developerId: EventTarget | null): void {
    console.log((developerId as HTMLSelectElement).value);
    this.httpClient.patch(`${enviroments.apiUrl}/tasks/${taskId}/assign`, { teamMemberId: (developerId as HTMLSelectElement).value }).subscribe(response => {
      console.log('Task assigned successfully', response);
    }, error => {
      console.error('Error assigning task', error);
    });
  }
  

  // private fb = inject(FormBuilder);
  // taskForm: FormGroup;
  // newCourseName = this.fb.control('', Validators.required);
  // showAddInput = false;
  // isSubmitted = false;
}
