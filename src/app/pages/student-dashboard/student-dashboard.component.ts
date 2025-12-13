import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SectionSelectorComponent } from '../../components/section-selector/section-selector.component';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { HttpClient } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';

import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [StatsCardComponent, SectionSelectorComponent, ShowTableComponent, BaseChartDirective],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {


  userRankingData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Maria', 'Carlos', 'João', 'Ana', 'Pedro', 'Sofia', 'Lucas', 'Beatriz'],
    datasets: [
      {
        label: 'Score',
        data: [520, 480, 410, 380, 360, 330, 310, 290]
      }
    ]
  };

  userRankingOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y' // 👈 ISSO deixa horizontal
  };

  teamRankingData: ChartConfiguration<'bar'>['data'] = {
    labels: ['ScrumMasters', 'CodeHeroes', 'DevDynamos', 'AgileWolves'],
    datasets: [
      {
        label: 'Total Score',
        data: [850, 720, 680, 610]
      }
    ]
  };

  teamRankingOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };

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
    rankings: [{
      studentInfo: {
        id: "12345",
        name: "João Silva",
        totalScore: 365
      },
      individualRankings: [
        { rank: 1, studentId: "001", studentName: "Maria Santos", totalScore: 450 },
        { rank: 2, studentId: "002", studentName: "Carlos Oliveira", totalScore: 420 },
        { rank: 3, studentId: "12345", studentName: "João Silva", totalScore: 365 },
        { rank: 4, studentId: "003", studentName: "Ana Costa", totalScore: 340 },
        { rank: 5, studentId: "004", studentName: "Pedro Lima", totalScore: 320 },
        { rank: 6, studentId: "005", studentName: "Sofia Mendes", totalScore: 300 },
        { rank: 7, studentId: "006", studentName: "Lucas Ferreira", totalScore: 280 },
        { rank: 8, studentId: "007", studentName: "Beatriz Alves", totalScore: 260 },
      ],
      teamRankingsByCourse: [
        {
          courseId: "c1",
          courseName: "Software Quality",
          rankings: [
            {
              rank: 1, teamId: "t1", teamName: "ScrumMasters", totalScore: 850, memberCount: 4, members: [
                { studentId: "12345", studentName: "João Silva", score: 250 },
                { studentId: "m2", studentName: "Maria Santos", score: 220 },
                { studentId: "m3", studentName: "Carlos Oliveira", score: 200 },
                { studentId: "m4", studentName: "Ana Costa", score: 180 }
              ]
            },
            {
              rank: 2, teamId: "t2", teamName: "CodeHeroes", totalScore: 720, memberCount: 4, members: [
                { studentId: "m5", studentName: "Pedro Lima", score: 200 },
                { studentId: "m6", studentName: "Sofia Mendes", score: 190 },
                { studentId: "m7", studentName: "Lucas Ferreira", score: 170 },
                { studentId: "m8", studentName: "Beatriz Alves", score: 160 }
              ]
            },
            {
              rank: 3, teamId: "t3", teamName: "DevDynamos", totalScore: 680, memberCount: 3, members: [
                { studentId: "m9", studentName: "Rafael Santos", score: 250 },
                { studentId: "m10", studentName: "Juliana Costa", score: 230 },
                { studentId: "m11", studentName: "Bruno Almeida", score: 200 }
              ]
            },
            {
              rank: 4, teamId: "t4", teamName: "AgileWolves", totalScore: 620, memberCount: 4, members: [
                { studentId: "m12", studentName: "Mariana Silva", score: 180 },
                { studentId: "m13", studentName: "Gabriel Rocha", score: 160 },
                { studentId: "m14", studentName: "Fernanda Lima", score: 150 },
                { studentId: "m15", studentName: "Thiago Souza", score: 130 }
              ]
            }
          ]
        },
        {
          courseId: "c2",
          courseName: "Mobile Development",
          rankings: [
            {
              rank: 1, teamId: "t5", teamName: "AppBuilders", totalScore: 780, memberCount: 3, members: [
                { studentId: "m16", studentName: "Diego Martins", score: 280 },
                { studentId: "m17", studentName: "Camila Pereira", score: 260 },
                { studentId: "m18", studentName: "André Gomes", score: 240 }
              ]
            },
            {
              rank: 2, teamId: "t6", teamName: "MobileFirst", totalScore: 650, memberCount: 4, members: [
                { studentId: "12345", studentName: "João Silva", score: 180 },
                { studentId: "m20", studentName: "Patricia Oliveira", score: 170 },
                { studentId: "m21", studentName: "Ricardo Dias", score: 160 },
                { studentId: "m22", studentName: "Amanda Ribeiro", score: 140 }
              ]
            },
            {
              rank: 3, teamId: "t7", teamName: "SwiftTeam", totalScore: 580, memberCount: 4, members: [
                { studentId: "m23", studentName: "Leonardo Cruz", score: 160 },
                { studentId: "m24", studentName: "Isabela Nunes", score: 150 },
                { studentId: "m25", studentName: "Matheus Cardoso", score: 140 },
                { studentId: "m26", studentName: "Larissa Moreira", score: 130 }
              ]
            }
          ]
        }
      ]
    }]
  };


  data: any[] = [];

  sections: string[] = ['Awards', 'Dashboard', 'Rankings', 'Specific functions'];

  openSprints: Record<string, boolean> = {};

  selectedOption: string = this.sections[2];

  constructor(private router: Router, private httpClient: HttpClient) { }

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
      console.log(response);
      this.data = response;
    });
  }


  get columns(): string[] {
    if (!this.allData.degrees || this.allData.degrees.length === 0) return [];
    return Object.keys(this.allData.degrees[0]);
  }

  onSelectOption(event: any) {
    console.log(event);
    this.selectedOption = event;
    if(this.selectedOption == 'Rankings'){
      this.data = this.allData.rankings;
      const userLabels = this.data[0].individualRankings.map((item: any) => item.studentName);
      const userScores = this.data[0].individualRankings.map((item: any) => item.totalScore);
      this.userRankingData = {
        labels: userLabels,
        datasets: [
          {
            label: 'Score',
            data: userScores
          }
        ]
      };

      const teamLabels = this.data[0].teamRankingsByCourse[0].rankings.map((item: any) => item.teamName);
      const teamScores = this.data[0].teamRankingsByCourse[0].rankings.map((item: any) => item.totalScore);
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
      this.fetchData();
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
    if(this.data[0].studentInfo.id === student.studentId) {
      return true;
    }
    return false;
  }

  isCurrentUserTeam(team: any): boolean {
    if(team.members.some((member: any) => this.data[0].studentInfo.id === member.studentId)) {
      return true;
    }
    return false;
  }
}
