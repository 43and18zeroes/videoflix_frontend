import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedFooterComponent } from './protected-footer.component';

describe('ProtectedFooterComponent', () => {
  let component: ProtectedFooterComponent;
  let fixture: ComponentFixture<ProtectedFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtectedFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtectedFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
