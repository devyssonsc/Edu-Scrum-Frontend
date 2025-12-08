import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherCourseDetailComponent } from './teacher-course-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TeacherCourseDetailComponent', () => {
  let component: TeacherCourseDetailComponent;
  let fixture: ComponentFixture<TeacherCourseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCourseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'QS' 
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});