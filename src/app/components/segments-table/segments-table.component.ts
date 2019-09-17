import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WealthSegmentsService } from '../../services/wealth-segments.service';

@Component({
  selector: 'app-segments-table',
  templateUrl: './segments-table.component.html',
  styleUrls: ['./segments-table.component.scss']
})
export class SegmentsTableComponent implements OnInit {

  segments = [];

  calculatedSegments = [];


  ageGenderStats = [
    ["M", 0, 158199],
    ["M", 1, 160277],
    ["M", 2, 163291],
    ["M", 3, 165723],
    ["M", 4, 164128],
    ["M", 5, 165628],
    ["M", 6, 166252],
    ["M", 7, 165165],
    ["M", 8, 165223],
    ["M", 9, 164582],
    ["M", 10, 163548],
    ["M", 11, 162794],
    ["M", 12, 159254],
    ["M", 13, 153592],
    ["M", 14, 149980],
    ["M", 15, 148072],
    ["M", 16, 147341],
    ["M", 17, 150630],
    ["M", 18, 157470],
    ["M", 19, 164194],
    ["M", 20, 168095],
    ["M", 21, 171012],
    ["M", 22, 177290],
    ["M", 23, 186646],
    ["M", 24, 191345],
    ["M", 25, 190054],
    ["M", 26, 188708],
    ["M", 27, 189292],
    ["M", 28, 190967],
    ["M", 29, 189549],
    ["M", 30, 187047],
    ["M", 31, 185838],
    ["M", 32, 185471],
    ["M", 33, 184942],
    ["M", 34, 183643],
    ["M", 35, 182932],
    ["M", 36, 180001],
    ["M", 37, 175247],
    ["M", 38, 169472],
    ["M", 39, 163505],
    ["M", 40, 159507],
    ["M", 41, 157494],
    ["M", 42, 157629],
    ["M", 43, 158373],
    ["M", 44, 160584],
    ["M", 45, 163445],
    ["M", 46, 166676],
    ["M", 47, 169433],
    ["M", 48, 164771],
    ["M", 49, 158011],
    ["M", 50, 153896],
    ["M", 51, 149598],
    ["M", 52, 147965],
    ["M", 53, 148072],
    ["M", 54, 150599],
    ["M", 55, 153919],
    ["M", 56, 153961],
    ["M", 57, 152638],
    ["M", 58, 148910],
    ["M", 59, 144261],
    ["M", 60, 140915],
    ["M", 61, 137407],
    ["M", 62, 134626],
    ["M", 63, 130567],
    ["M", 64, 125471],
    ["M", 65, 123119],
    ["M", 66, 121031],
    ["M", 67, 118798],
    ["M", 68, 116628],
    ["M", 69, 113315],
    ["M", 70, 111941],
    ["M", 71, 113603],
    ["M", 72, 105301],
    ["M", 73, 92508],
    ["M", 74, 86591],
    ["M", 75, 78967],
    ["M", 76, 73160],
    ["M", 77, 68774],
    ["M", 78, 63123],
    ["M", 79, 58534],
    ["M", 80, 53651],
    ["M", 81, 49276],
    ["M", 82, 45042],
    ["M", 83, 39987],
    ["M", 84, 35460],
    ["M", 85, 31679],
    ["M", 86, 28177],
    ["M", 87, 25443],
    ["M", 88, 22770],
    ["M", 89, 19315],
    ["F", 0, 149536],
    ["F", 1, 151497],
    ["F", 2, 154244],
    ["F", 3, 156887],
    ["F", 4, 155787],
    ["F", 5, 157056],
    ["F", 6, 157614],
    ["F", 7, 156758],
    ["F", 8, 156978],
    ["F", 9, 156176],
    ["F", 10, 155161],
    ["F", 11, 154400],
    ["F", 12, 150765],
    ["F", 13, 145154],
    ["F", 14, 141241],
    ["F", 15, 140127],
    ["F", 16, 140213],
    ["F", 17, 142921],
    ["F", 18, 149015],
    ["F", 19, 154858],
    ["F", 20, 158894],
    ["F", 21, 163417],
    ["F", 22, 169666],
    ["F", 23, 177427],
    ["F", 24, 182313],
    ["F", 25, 183380],
    ["F", 26, 185078],
    ["F", 27, 188508],
    ["F", 28, 192346],
    ["F", 29, 192789],
    ["F", 30, 191359],
    ["F", 31, 190342],
    ["F", 32, 190086],
    ["F", 33, 189780],
    ["F", 34, 187996],
    ["F", 35, 186080],
    ["F", 36, 181994],
    ["F", 37, 176568],
    ["F", 38, 170863],
    ["F", 39, 165199],
    ["F", 40, 161325],
    ["F", 41, 159120],
    ["F", 42, 158981],
    ["F", 43, 159920],
    ["F", 44, 162524],
    ["F", 45, 166646],
    ["F", 46, 171770],
    ["F", 47, 176532],
    ["F", 48, 172303],
    ["F", 49, 165465],
    ["F", 50, 161599],
    ["F", 51, 156450],
    ["F", 52, 154078],
    ["F", 53, 153811],
    ["F", 54, 156397],
    ["F", 55, 159569],
    ["F", 56, 159280],
    ["F", 57, 158333],
    ["F", 58, 155630],
    ["F", 59, 151058],
    ["F", 60, 147889],
    ["F", 61, 144772],
    ["F", 62, 141309],
    ["F", 63, 137686],
    ["F", 64, 133816],
    ["F", 65, 131054],
    ["F", 66, 127580],
    ["F", 67, 124554],
    ["F", 68, 122165],
    ["F", 69, 118164],
    ["F", 70, 115699],
    ["F", 71, 116881],
    ["F", 72, 108515],
    ["F", 73, 96355],
    ["F", 74, 91417],
    ["F", 75, 84310],
    ["F", 76, 78766],
    ["F", 77, 75086],
    ["F", 78, 70419],
    ["F", 79, 66568],
    ["F", 80, 62528],
    ["F", 81, 58625],
    ["F", 82, 54804],
    ["F", 83, 50288],
    ["F", 84, 45805],
    ["F", 85, 42317],
    ["F", 86, 39174],
    ["F", 87, 36759],
    ["F", 88, 34243],
    ["F", 89, 30232]
  ];

  adults = 0;
  children = 0;

  constructor(
    public ws: WealthSegmentsService,
    public cdr: ChangeDetectorRef) {

    this.adults = this.ageGenderStats
      .filter(x => x[1] >= 18)
      .map(x => x[2] as number)
      .reduce((o, x) => o + x);

    this.children = this.ageGenderStats
      .filter(x => x[1] < 18)
      .map(x => x[2] as number)
      .reduce((o, x) => o + x);
  }

  ngOnInit() {
    console.log(this.ws);
    this.ws.segments.subscribe(segments => {
      const households = this.ws.households;
      this.segments = [].concat(segments);
      console.log('this.segments', this.segments);
      this.cdr.detectChanges();

      for (var i = 0; i < 80; i += 10) {
        const x = households * (i+5) / 100;
        const y = this.ws.getY(x);
        this.calculatedSegments.push({
          name: Math.round(i+10) + "%",
          x: Math.round(x),
          y: Math.round(y),
          chunk: 10
        });
      }
      for (var i = 80; i < 99; i += 1) {
        const x = households * i / 100;
        const y = this.ws.getY(x);
        this.calculatedSegments.push({
          name: 'Top ' + Math.round(100 - i) + "%",
          x: Math.round(x),
          y: Math.round(y),
          chunk: 1
        });
      }
      for (var i = 99; i < 99.85; i += 0.1) {
        const x = households * i / 100;
        const y = this.ws.getY(x);
        this.calculatedSegments.push({
          name: 'Top ' + (100 - i).toPrecision(1) + "%",
          x: Math.round(x),
          y: Math.round(y),
          chunk: 0.1
        });
      }
      for (var i = 99.9; i < 99.985; i += 0.01) {
        const x = households * i / 100;
        const y = this.ws.getY(x);
        this.calculatedSegments.push({
          name: 'Top ' + (100 - i).toPrecision(1) + "%",
          x: Math.round(x),
          y: Math.round(y),
          chunk: 0.01
        });
      }
      for (var i = 99.99; i <= 100; i += 0.001) {
        const x = households * i / 100;
        const y = this.ws.getY(x);
        const people = Math.round((100 - i) * 100000);
        this.calculatedSegments.push({
          name: 'Top ' + people,
          x: Math.round(x),
          y: Math.round(y),
          chunk: 0.001
        });
      }
      const lastSegment = segments[segments.length - 1];
      this.calculatedSegments.forEach(x => {
        x.total = Math.round(x.total || (x.y * x.chunk * households / 100));
      });
      const total = this.calculatedSegments.map(x => x.total).reduce((o, x) => o + x);
      console.log('total', total);
      this.calculatedSegments.forEach(x => {
        const sharePercent = x.total / (total * (x.chunk / 100));
        x.sharePercent = sharePercent >= 10 ?
          Math.round(sharePercent) :
          sharePercent.toPrecision(2);
      });
      console.log(this.calculatedSegments);


      const totalPeople = 24966530;
      console.log('adults', this.adults);
      console.log('children', this.children);
      const sharesPerHousehold = (this.adults + this.children / 4) / households;
      console.log('share per household', sharesPerHousehold);
      // TODO: Check percent that is adults.
      const target = this.adults * 400 * 52 + this.children * 100 * 52;
      console.log('target', target);

      console.log('percent', target / total * 100);

      console.log('averageHouseholdWealth', Math.round(total / households));
      console.log('medianHouseholdWealth', Math.round(this.ws.getY(households / 2)));

      console.log('averageHouseholdWealth', Math.round(total / households - 420000));
      console.log('medianHouseholdWealth', Math.round(this.ws.getY(households / 2) - 420000));

      // taxation
      // Rules
      // 1. Can't tax beyond the top 15% of households in order to avoid
      //      imposing paper work on anybody in the lower 80%.
      // 2. Identify a step quantity that is like the net worth between 10% and 15%.
      //      At the moment $1,000,000.
      // 3. Increase tax on the $1 by 1% for each step until a UBI is paid for.
      //      At the moment the highest % is predicted to be no more than 10%.
      let taxBracketStep = 1000000;
      let taxPercent = 0.01;
      // TODO: Check percent that is adults.
      let amount = 0;
      for (
        var stepsTaken = 1;
        stepsTaken <= 50 && amount < target;
        stepsTaken += 1
      ) {
        const bracket = taxBracketStep * stepsTaken;
        this.calculatedSegments.forEach((segment, i) => {
          const taxable = Math.max(0, segment.y - bracket);
          if (taxable) {
            const qty = segment.qty || (households * (segment.chunk / 100));
            segment.qty = qty;
            const taxTotal = qty * taxable * taxPercent;
            segment.taxed = (segment.taxed || 0) + taxTotal;
            segment.rateReached = stepsTaken;
            amount += taxTotal;
            if (segment.qty) {
              console.log(taxTotal, segment.taxed);
            }
          }
        });
      }
      this.calculatedSegments.forEach(x => {
        x.taxed = Math.round((x.taxed || 0)/1000) * 1000;
        x.rateReached = (x.rateReached || 0).toPrecision(2);
        x.rateFinal = x.taxed ? (x.taxed / x.total * 100).toPrecision(3) : '';
        x.perWeek = x.taxed / x.qty / 52;
      });
    });
  }

}
