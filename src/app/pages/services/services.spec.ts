import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesComponent } from './services';  // ✅ FIXED import name

describe('ServicesComponent', () => {           // ✅ FIXED describe name
  let component: ServicesComponent;             // ✅ FIXED variable type
  let fixture: ComponentFixture<ServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesComponent]              // ✅ FIXED here
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesComponent);  // ✅ FIXED
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
