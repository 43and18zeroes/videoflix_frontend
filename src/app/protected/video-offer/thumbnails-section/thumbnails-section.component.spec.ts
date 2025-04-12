import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailsSectionComponent } from './thumbnails-section.component';

describe('ThumbnailsSectionComponent', () => {
  let component: ThumbnailsSectionComponent;
  let fixture: ComponentFixture<ThumbnailsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
