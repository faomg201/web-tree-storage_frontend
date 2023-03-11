import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreetypeComponent } from './treetype.component';

describe('TreetypeComponent', () => {
  let component: TreetypeComponent;
  let fixture: ComponentFixture<TreetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreetypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
