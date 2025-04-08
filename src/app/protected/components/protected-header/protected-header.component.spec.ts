import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedHeaderComponent } from './protected-header.component';

describe('ProtectedHeaderComponent', () => {
  let component: ProtectedHeaderComponent;
  let fixture: ComponentFixture<ProtectedHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtectedHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtectedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
