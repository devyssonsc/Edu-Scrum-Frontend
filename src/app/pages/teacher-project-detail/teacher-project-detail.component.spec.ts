import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherProjectDetailComponent } from './teacher-project-detail.component';

describe('TeacherProjectDetailComponent', () => {
  let component: TeacherProjectDetailComponent;
  let fixture: ComponentFixture<TeacherProjectDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherProjectDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
