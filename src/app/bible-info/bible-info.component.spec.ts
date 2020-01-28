import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibleInfoComponent } from './bible-info.component';

describe('BibleInfoComponent', () => {
  let component: BibleInfoComponent;
  let fixture: ComponentFixture<BibleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibleInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
