import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreedetailComponent } from './treedetail.component';

describe('TreedetailComponent', () => {
  let component: TreedetailComponent;
  let fixture: ComponentFixture<TreedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreedetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
