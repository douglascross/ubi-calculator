import { Component, OnInit } from '@angular/core';
import { UbiService } from '../../services/ubi.service';

@Component({
  selector: 'wealth-graphic',
  templateUrl: './wealth-graphic.component.html',
  styleUrls: ['./wealth-graphic.component.scss']
})
export class WealthGraphicComponent implements OnInit {

  household1 = 0;
  wealth1 = 0;
  taxed1 = 'zero';
  household2 = 0;
  wealth2 = 0;
  taxed2 = 'zero';
  household3 = 0;
  wealth3 = 0;
  taxed3 = 'zero';

  constructor(public ubi: UbiService) {
    const radiusWeight = 18;
    this.ubi.segments.subscribe(segments => {
      const sets = {};
      segments.forEach(seg => {
        const set = sets[seg.chunk] = sets[seg.chunk] || {households: 0, totalWealth: 0, taxed: 0};
        set.households += seg.qty;
        set.totalWealth += seg.total;
        set.taxed += seg.taxed;
      });
      Object.keys(sets).forEach(chunk => {
        const set = sets[chunk];
        set.householdPercent = Math.round(set.households / ubi.households * 100);
        set.wealthPercent = Math.round(set.totalWealth / ubi.totalWealth * 100);
        set.householdRadius = Math.pow(set.householdPercent / Math.PI, 0.5) * radiusWeight;
        set.wealthRadius = Math.pow(set.wealthPercent / Math.PI, 0.5) * radiusWeight;
        set.taxedPercent = set.taxed / set.totalWealth * 100
      });
      this.household1 = sets["10"].householdRadius;
      this.wealth1 = sets["10"].wealthRadius;
      this.taxed1 = sets["10"].taxedPercent;
      this.household2 = sets["1"].householdRadius;
      this.wealth2 = sets["1"].wealthRadius;
      this.taxed2 = sets["1"].taxedPercent;
      this.household3 = sets["0.1"].householdRadius;
      this.wealth3 = sets["0.1"].wealthRadius;
      this.taxed3 = sets["0.1"].taxedPercent;
    });
  }

  ngOnInit() {
  }
}
