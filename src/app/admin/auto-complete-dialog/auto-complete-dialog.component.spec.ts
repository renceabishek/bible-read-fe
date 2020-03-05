import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteDialogComponent } from './auto-complete-dialog.component';

describe('AutoCompleteDialogComponent', () => {
  let component: AutoCompleteDialogComponent;
  let fixture: ComponentFixture<AutoCompleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
