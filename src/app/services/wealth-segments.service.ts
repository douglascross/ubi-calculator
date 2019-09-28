import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import wealthSegments from '../../assets/json/wealth-segments-2017-2018.json';
import wealthiest from '../../assets/json/wealthiest-50-2017-2018.json';

@Injectable({
  providedIn: 'root'
})
export class WealthSegmentsService {

  private segs: any[];
  public households: number;
  public segments: BehaviorSubject<any[]>;
  public calculatedSegments: BehaviorSubject<any[]>;

  constructor() {
    this.segments = new BehaviorSubject([]);
    this.segments.subscribe(x => this.segs = x);
    this.processWealthSegmentsJson();
    this.addSimpleQuadratic(3);
    this.addSimpleExponential();
    // ^2 = 485.427-499.285
    // ^3 = 478.303-498.928
    // ^5 = 464.375-498.215
    // Math.E = 373.07-492.897
  }

  getY(x) {
    const segment = this.segs.find(seg => seg.x1 <= x && x <= seg.x2);
    const index = this.segs.indexOf(segment);
    if (!segment) {
      return 0;
    }
    return index >= 32 ? segment.simpleExponential(x) : segment.simpleQuadratic(x);
  }

  private addSimpleQuadratic(power = 3) {
    this.segments.subscribe(segments => {
      segments.forEach(segment => {
        const startX = segment.cumulativeHouseholds - segment.households;
        const c = segment.householdMin;
        const y = segment.householdMax - c;
        const xsr2 = Math.pow(segment.households, power);
        const a = y / xsr2;
        segment.simpleQuadratic = household => {
          const x = household - startX;
          return a * Math.pow(x, power) + c;
        };
      });
    });
  }

  private addSimpleExponential(exponent = Math.E) {
    this.segments.subscribe(segments => {
      segments.forEach(segment => {
        const startX = segment.cumulativeHouseholds - segment.households;
        const c = segment.householdMin;
        const y = segment.householdMax - c;
        const logy = Math.log(y) / Math.log(exponent);
        const a = logy / segment.households;
        segment.simpleExponential = household => {
          const x = household - startX;
          return Math.pow(Math.E, a * x) + c;
        };
      });
    });
  }

  private async processWealthSegmentsJson() {

    // copy
    let segments = [];
    wealthSegments.forEach(x => {
      const segment: any = Object.assign({}, x);
      segments.push(segment);
    });

    // add wealthiest
    // (presuming that the wealthiest, are whole different households)
    let lastSegment = segments[segments.length - 1];
    lastSegment.householdMax = wealthiest[wealthiest.length - 1].billions * 1000000000;
    lastSegment.households -= wealthiest.length;

    const newSegment = {
      householdMin: wealthiest[wealthiest.length - 1].billions * 1000000000,
      householdMax: wealthiest[0].billions * 1000000000,
      households: wealthiest.length,
      total: Math.round(wealthiest
        .map(x => x.billions)
        .reduce((sum, amount) => sum + amount) * 1000000000)
    };
    segments.push(newSegment);
    lastSegment = newSegment;

    //segments = segments.slice(0, 18);

    // cumulative households + co-ordinates
    let cumulative = 0;
    let totalHouseholds = 0;
    segments.forEach(x => {
      x.x1 = cumulative;
      x.y1 = x.householdMin;
      cumulative += x.households;
      x.cumulativeHouseholds = cumulative;
      x.x2 = cumulative;
      x.y2 = x.householdMax;
    });
    this.households = totalHouseholds = cumulative;

    // total amount
    segments.forEach(x => {
      x.total = x.total || (((x.householdMin || 0) +
      (x.householdMax || x.householdMin)) / 2 * x.households);
    });

    // percent of people
    segments.forEach(x => {
      x.percentHouseholds = x.cumulativeHouseholds / totalHouseholds * 100;
    });

    // taxation
    // Rules
    // 1. Can't tax beyond the top 15% of households in order to avoid
    //      imposing paper work on anybody in the lower 80%.
    // 2. Identify a step quantity that is like the net worth between 10% and 15%.
    //      At the moment $1,000,000.
    // 3. Increase tax on the $1 by 1% for each step until a UBI is paid for.
    //      At the moment the highest % is predicted to be no more than 10%.
    const totalPeople = 24966530;
    let taxBracketStep = 1000000;
    let taxPercent = 0.01;
    // TODO: Check percent that is adults.
    const target = totalPeople * 400 * 52 * 0.8;
    let amount = 0;
    for (
      var stepsTaken = 1;
      stepsTaken <= 50 && amount < target;
      stepsTaken += 1
    ) {
      const bracket = taxBracketStep * stepsTaken;
      segments.forEach((segment, i) => {
        const taxable = Math.max(0, segment.total / segment.households - bracket);
        if (taxable && segment.percentHouseholds < 1) {
          const taxTotal = segment.households * taxable * taxPercent;
          segment.taxed = (segment.taxed || 0) + taxTotal;
          segment.rateReached = stepsTaken;
          amount += taxTotal;
        }
      });
    }

    this.segments.next(segments);
  }
}
