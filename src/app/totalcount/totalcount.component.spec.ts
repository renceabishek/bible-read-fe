import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalcountComponent } from './totalcount.component';

describe('TotalcountComponent', () => {
  let component: TotalcountComponent;
  let fixture: ComponentFixture<TotalcountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalcountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
