import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DegreeDetailComponent } from './degree-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; 

describe('DegreeDetailComponent', () => {
  let component: DegreeDetailComponent;
  let fixture: ComponentFixture<DegreeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DegreeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'EI' 
              }
            },
            params: of({ id: 'EI' })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DegreeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});