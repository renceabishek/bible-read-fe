import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblereadersComponent } from './biblereaders.component';

describe('BiblereadersComponent', () => {
  let component: BiblereadersComponent;
  let fixture: ComponentFixture<BiblereadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiblereadersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiblereadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
