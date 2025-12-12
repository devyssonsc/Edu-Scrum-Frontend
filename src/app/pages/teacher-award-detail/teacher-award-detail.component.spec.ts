import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAwardDetailComponent } from './teacher-award-detail.component';

describe('TeacherAwardDetailComponent', () => {
  let component: TeacherAwardDetailComponent;
  let fixture: ComponentFixture<TeacherAwardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAwardDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAwardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
