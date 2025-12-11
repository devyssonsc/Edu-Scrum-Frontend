import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCreateAwardComponent } from './teacher-create-award.component';

describe('TeacherCreateAwardComponent', () => {
  let component: TeacherCreateAwardComponent;
  let fixture: ComponentFixture<TeacherCreateAwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCreateAwardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCreateAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
