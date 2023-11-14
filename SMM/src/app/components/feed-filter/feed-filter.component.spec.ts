import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedFilterComponent } from './feed-filter.component';

describe('FeedFilterComponent', () => {
  let component: FeedFilterComponent;
  let fixture: ComponentFixture<FeedFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedFilterComponent]
    });
    fixture = TestBed.createComponent(FeedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});