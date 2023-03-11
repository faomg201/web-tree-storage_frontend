import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtobuyproductComponent } from './howtobuyproduct.component';

describe('HowtobuyproductComponent', () => {
  let component: HowtobuyproductComponent;
  let fixture: ComponentFixture<HowtobuyproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowtobuyproductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowtobuyproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
