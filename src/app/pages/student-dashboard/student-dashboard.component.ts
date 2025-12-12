import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SectionSelectorComponent } from '../../components/section-selector/section-selector.component';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [StatsCardComponent, SectionSelectorComponent, ShowTableComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent {
  allData: any = {
    awards: [
      {
        badgeIcon: "Awards/Innovator.png",
        awardName: "Innovator",
        awardDescription: "Innovator Award for outstanding project",
        projectName: "Project X",
        assignedAt: "2024-05-01",
        points: 2
      },
      {
        badgeIcon: "Awards/MVT.png",
        awardName: "MVT",
        awardDescription: "Most Valuable Member in project",
        projectName: "Project J",
        assignedAt: "2024-07-12",
        points: 3
      },
      {
        badgeIcon: "Awards/MVT.png",
        awardName: "MVT",
        awardDescription: "Most Valuable Member in project",
        projectName: "Project J",
        assignedAt: "2024-07-12",
        points: 3
      },
      {
        badgeIcon: "Awards/MVT.png",
        awardName: "MVT",
        awardDescription: "Most Valuable Member in project",
        projectName: "Project J",
        assignedAt: "2024-07-12",
        points: 3
      },
    ],
    projects: [
      {
        "id": 1,
        "name": "Final Project",
        "description": "The main project for this course.",
        "startDate": "2025-11-10",
        "endDate": "2025-12-20",
        "sprints": [
          {
            "id": 1,
            "sprintNumber": 1,
            "goal": "Deliver the core login functionality.",
            "startDate": "2025-11-10",
            "endDate": "2025-11-17",
            "tasks": [
              {
                "id": 1,
                "description": "As a user, I want to log in, so that I can access my profile.",
                "status": "TODO",
                "teamMemberName": "Aluno Texugo"
              }
            ]
          },
          {
            "id": 2,
            "sprintNumber": 2,
            "goal": "Deliver the core login functionality.",
            "startDate": "2025-11-10",
            "endDate": "2025-11-17",
            "tasks": [
              {
                "id": 3,
                "description": "As a user, I want to log in, so that I can access my profile.",
                "status": "DONE",
                "teamMemberName": "Aluno Texugo"
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "Final Project",
        "description": "The main project for this course.",
        "startDate": "2025-11-10",
        "endDate": "2025-12-20",
        "sprints": [
          {
            "id": 1,
            "sprintNumber": 1,
            "goal": "Deliver the core login functionality.",
            "startDate": "2025-11-10",
            "endDate": "2025-11-17",
            "tasks": [
              {
                "id": 1,
                "description": "As a user, I want to log in, so that I can access my profile.",
                "status": "TODO",
                "teamMemberName": "Aluno Texugo"
              }
            ]
          }
        ]
      }
    ],
    students: [
      {
        num: 50440,
        name: "Tiago Silva",
        email: "50440@alunos.upt.pt",
        degree: "Engenharia Informática"
      },
      {
        num: 50441,
        name: "David Aroso",
        email: "50441@alunos.upt.pt",
        degree: "Engenharia Informática"
      }
    ],
    teachers: [
      {
        name: "Fátima Leal",
        email: "fatimal@upt.pt",
        courses: 3
      },
      {
        name: "Bruno Cunha",
        email: "Bruninho@upt.pt",
        courses: 4
      }
    ]
  };


  data: any[] = this.allData.projects;

  sections: string[] = ['Awards', 'Progression', 'Scores', 'Specific functions'];

  openSprints: Record<string, boolean> = {};

  constructor(private router: Router) { }

  selectedOption: string = this.sections[1];

  get columns(): string[] {
    if (!this.allData.degrees || this.allData.degrees.length === 0) return [];
    return Object.keys(this.allData.degrees[0]);
  }

  onSelectOption(event: any) {
    console.log(event);
    this.selectedOption = event;

    if (this.selectedOption === this.sections[0]) {
      this.data = this.allData.awards;
    } else if (this.selectedOption === this.sections[1]) {
      this.data = this.allData.projects;
    } else if (this.selectedOption === 'Estudantes') {
      this.data = this.allData.students;
    } else if (this.selectedOption === 'Professores') {
      this.data = this.allData.teachers;
    }
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
    } else if(allTasksDone) {
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
    const totalTasks = project.sprints.reduce((sum: number, sprint: any) => sum + sprint.tasks.length, 0);
    const completedTasks = project.sprints.reduce((sum: number, sprint: any) => 
      sum + sprint.tasks.filter((task: any) => task.status === 'DONE').length, 0);
    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  }
}
