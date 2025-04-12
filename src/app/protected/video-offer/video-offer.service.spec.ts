import { TestBed } from '@angular/core/testing';

import { VideoOfferService } from './video-offer.service';

describe('VideoOfferService', () => {
  let service: VideoOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
