import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSubtitleComponent } from './card-subtitle.component';

describe('CardSubtitleComponent', () => {
  let component: CardSubtitleComponent;
  let fixture: ComponentFixture<CardSubtitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardSubtitleComponent]
    });
    fixture = TestBed.createComponent(CardSubtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
