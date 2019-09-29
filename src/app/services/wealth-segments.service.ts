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
    this.segments.subscribe(x => {
      this.segs = x;
      x.forEach(segment => {
        segment.calculators = {
          quadratic: this.createSimplePolynomial(segment, 2),
          cubic: this.createSimplePolynomial(segment, 3),
          polynomial4: this.createSimplePolynomial(segment, 4),
          polynomial5: this.createSimplePolynomial(segment, 5),
          exponential: this.createSimpleExponential(segment)
        };;
      });
    });
    this.processWealthSegmentsJson();
  }

  getY(x, calculator = 'cubic') {
    const segment = this.segs.find(seg => seg.x1 <= x && x <= seg.x2);
    if (!segment) {
      return 0;
    }
    return segment.calculators[calculator](x);
  }

  private createSimplePolynomial(segment, power = 3) {
    const startX = segment.cumulativeHouseholds - segment.households;
    const c = segment.householdMin;
    const y = segment.householdMax - c;
    const xsr2 = Math.pow(segment.households, power);
    const a = y / xsr2;
    return household => {
      const x = household - startX;
      return a * Math.pow(x, power) + c;
    };
  }

  private createSimpleExponential(segment, exponent = Math.E) {
    const startX = segment.cumulativeHouseholds - segment.households;
    const c = segment.householdMin;
    const y = segment.householdMax - c;
    const logy = Math.log(y) / Math.log(exponent);
    const a = logy / segment.households;
    return household => {
      const x = household - startX;
      return Math.pow(Math.E, a * x) + c;
    };
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
