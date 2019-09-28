import { Component, OnInit } from '@angular/core';
import { UbiService } from '../../services/ubi.service';

@Component({
  selector: 'app-segments-table',
  templateUrl: './segments-table.component.html',
  styleUrls: ['./segments-table.component.scss']
})
export class SegmentsTableComponent implements OnInit {

  segments = [];

  constructor(
    public ubi: UbiService) {
    this.ubi.segments.subscribe(segments => {
      this.segments = segments;
    });
  }

  ngOnInit() {
  }

}
