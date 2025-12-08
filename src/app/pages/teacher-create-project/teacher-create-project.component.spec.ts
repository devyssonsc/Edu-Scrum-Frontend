import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCreateProjectComponent } from './teacher-create-project.component';

describe('TeacherCreateProjectComponent', () => {
  let component: TeacherCreateProjectComponent;
  let fixture: ComponentFixture<TeacherCreateProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCreateProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCreateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
