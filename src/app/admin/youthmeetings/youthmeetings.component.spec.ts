import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YouthmeetingsComponent } from './youthmeetings.component';

describe('YouthmeetingsComponent', () => {
  let component: YouthmeetingsComponent;
  let fixture: ComponentFixture<YouthmeetingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YouthmeetingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YouthmeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
