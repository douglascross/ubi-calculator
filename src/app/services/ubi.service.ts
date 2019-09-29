import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WealthSegmentsService } from './wealth-segments.service';
import population from '../../assets/json/population.json';

@Injectable({
  providedIn: 'root'
})
export class UbiService {

  public segments = new BehaviorSubject([]);
  

  // data
  public wsSegments = [];
  public taxSegments = [];
  public adults;
  public children;
  public households;

  // input
  public estimationModel = 'cubic';
  public taxBracketStart = 2000000;
  public taxBracketStep = 1000000;
  public taxPercentStep = 1;
  public amountPerAdult = 400;
  public amountPerChild = 100;
  public reduceNewstart = false;
  public reduceAustudy = false;
  public reducePension = false;

  // output
  public ubiCost;
  public totalTax;
  public totalWealth;
  public averageWealth;
  public medianWealth;

  constructor(
    public ws: WealthSegmentsService) {

    this.adults = population
      .filter(x => x[1] >= 18)
      .map(x => x[2] as number)
      .reduce((o, x) => o + x);

    this.children = population
      .filter(x => x[1] < 18)
      .map(x => x[2] as number)
      .reduce((o, x) => o + x);

    this.ws.segments.subscribe(segments => {
      this.wsSegments = [].concat(segments);
      this.calculate();
    });
  }

  createSegments() {
    const households = this.households = this.ws.households;
    const taxSegments = [];
    const model = this.estimationModel;

    for (var i = 0; i < 80; i += 10) {
      const x = households * (i+5) / 100;
      const y = this.ws.getY(x, model);
      const x1 = Math.round(households * i / 100);
      const x2 = Math.round(households * (i + 10) / 100);
      const y1 = Math.round(this.ws.getY(x1, model));
      const y2 = Math.round(this.ws.getY(x2, model));
      taxSegments.push({
        name: Math.round(i+10) + "%",
        x: Math.round(x),
        y: Math.round(y),
        x1, y1, x2, y2,
        chunk: 10
      });
    }
    for (var i = 80; i < 99; i += 1) {
      const x = households * (i + 0.5) / 100;
      const y = this.ws.getY(x, model);
      const x1 = Math.round(households * i / 100);
      const x2 = Math.round(households * (i + 1) / 100);
      const y1 = Math.round(this.ws.getY(x1, model));
      const y2 = Math.round(this.ws.getY(x2, model));
      taxSegments.push({
        name: 'Top ' + Math.round(100 - i) + "%",
        x: Math.round(x),
        y: Math.round(y),
        x1, y1, x2, y2,
        chunk: 1
      });
    }
    for (var i = 99; i <= 99.9; i += 0.1) {
      const x = households * (i + 0.05) / 100;
      const y = this.ws.getY(x, model);
      const x1 = Math.round(households * i / 100);
      const x2 = Math.round(households * (i + 0.1) / 100);
      const y1 = Math.round(this.ws.getY(x1, model));
      const y2 = Math.round(this.ws.getY(x2, model));
      taxSegments.push({
        name: 'Top ' + (100 - i).toPrecision(1) + "%",
        x: Math.round(x),
        y: Math.round(y),
        x1, y1, x2, y2,
        chunk: 0.1
      });
    }
    taxSegments.forEach(x => {
      x.total = Math.round(x.total || (x.y * x.chunk * households / 100));
    });
    const total = this.totalWealth = taxSegments.map(x => x.total).reduce((o, x) => o + x);
    taxSegments.forEach(x => {
      const sharePercent = x.total / (total * (x.chunk / 100));
      x.sharePercent = sharePercent >= 10 ?
        Math.round(sharePercent) :
        sharePercent.toPrecision(2);
    });

    this.taxSegments = taxSegments;
  }

  calculate(cfg: any = {}) {
    this.estimationModel = cfg.estimationModel || this.estimationModel || 'cubic';
    this.taxBracketStart = cfg.taxBracketStart || this.taxBracketStart || 2000000;
    this.taxBracketStep = cfg.taxBracketStep || this.taxBracketStep || 1000000;
    this.taxPercentStep = cfg.taxPercentStep || this.taxPercentStep || 1;
    this.amountPerAdult = cfg.amountPerAdult || this.amountPerAdult || 300;
    this.amountPerChild = cfg.amountPerChild || this.amountPerChild || 100;
    this.reduceNewstart = cfg.reduceNewstart || this.reduceNewstart || false;
    this.reduceAustudy = cfg.reduceAustudy || this.reduceAustudy || false;
    this.reducePension = cfg.reducePension || this.reducePension || false;

    this.createSegments();

    const households = this.households;
    // TODO: Check percent that is adults.
    const target = this.adults * this.amountPerAdult * 52 + this.children * this.amountPerChild * 52;
    this.ubiCost = target;

    // reset
    this.taxSegments.forEach((segment, i) => {
      segment.taxed = 0;
      segment.rateReached = 0;
    });

    // taxation
    let taxBracketStep = this.taxBracketStep;
    let taxPercentStep = this.taxPercentStep / 100;
    let amount = 0;
    let bracket = this.taxBracketStart;
    for (
      var stepsTaken = 1;
      stepsTaken <= 50 && amount < target;
      stepsTaken += 1
    ) {
      bracket += taxBracketStep * (stepsTaken - 1);
      this.taxSegments.forEach((segment, i) => {
        const qty = segment.qty || (households * (segment.chunk / 100));
        segment.qty = Math.round(qty);
        const taxable = Math.max(0, segment.y - bracket);
        if (taxable) {
          const taxTotal = qty * taxable * taxPercentStep;
          segment.taxed = (segment.taxed || 0) + taxTotal;
          segment.rateReached = stepsTaken * this.taxPercentStep;
          amount += taxTotal;
        }
      });
    }
    this.totalTax = amount;
    this.taxSegments.forEach(x => {
      x.taxed = Math.round(x.taxed || 0);
      x.rateReached = x.rateReached;
      x.rateFinal = x.taxed ? (x.taxed / x.total * 100) : 0;
      x.perWeek = x.taxed / x.qty / 52;
    });

    this.averageWealth = this.totalWealth / this.households;
    this.medianWealth = this.ws.getY(this.households / 2, this.estimationModel);

    this.segments.next(this.taxSegments);
  }
}
