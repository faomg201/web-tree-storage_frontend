import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarhomepageComponent } from './navbarhomepage.component';

describe('NavbarhomepageComponent', () => {
  let component: NavbarhomepageComponent;
  let fixture: ComponentFixture<NavbarhomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarhomepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarhomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
