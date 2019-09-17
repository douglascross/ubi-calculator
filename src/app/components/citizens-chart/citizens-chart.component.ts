import { Component, Input, OnInit } from '@angular/core';
import { select, curveLinear, min, max, line, axisBottom, axisLeft} from "d3";
import { scaleLinear } from "d3-scale";
import { CitizenService } from '../../services/citizen.service';

const WIDTH = 800;
const HEIGHT = 500;
const MARGINS = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 100
};

@Component({
  selector: 'app-citizens-chart',
  templateUrl: './citizens-chart.component.html',
  styleUrls: ['./citizens-chart.component.scss']
})
export class CitizensChartComponent implements OnInit {

  @Input('include-richest') includeRichest = false;
  @Input('include-rich') includeRich = false;

  lineData = [];
  polyData = [];

  vis: any;

  richData: any;
  richestData: any;

  xRange: any;
  yRange: any;

  xAxisG: any;
  yAxisG: any;
  linePath: any;
  polyPaths: any[];
  circlePaths: any[];

  constructor(public cs: CitizenService) {
    const segments = [].concat(this.cs.segments).reverse();
    const totalPeople = this.cs.population;
    let cumulativePeople = 0;

    // Calculate percent of population
    segments.forEach(x => {
      cumulativePeople += x.people;
      x.percent = Math.round(cumulativePeople / totalPeople * 1000000) / 10000;
    });

    // Calculate tax
    let taxBracketStep = 1000000;
    let taxPercent = 0.01;
    const target = totalPeople * 400 * 52;
    let amount = 0;
    for (
      var stepsTaken = 1;
      stepsTaken <= 50 && amount < target;
      stepsTaken += 1
    ) {
      const bracket = taxBracketStep * stepsTaken;
      console.log('step', stepsTaken, amount);
      segments.forEach(segment => {
        const taxableMin = Math.max(0, (segment.householdMin / 2) - bracket);
        const taxableMax = Math.max(0, (segment.householdMax / 2) - bracket);
        console.log(taxableMin, taxableMax)
        if (taxableMin) {
          const taxMin = taxableMin * taxPercent;
          const taxMax = taxableMax * taxPercent;
          const taxTotal = segment.households * 2 * (taxMin + taxMax) / 2;
          amount += taxTotal;
        }
        console.log(amount);
      });
    }
  }

  getFilteredData() {
    const data = [].concat(this.cs.betterWealthRanges);
    this.richestData = data.pop();
    this.richData = data.pop();
    console.log('this.segments', this.cs.segments);
    if (this.includeRich) {
      data.push(this.richData);
    }
    if (this.includeRichest) {
      data.push(this.richestData);
    }
    return data;
  }

  refreshData() {
    const data = this.getFilteredData();
    const lineData = [];
    data.forEach((r, i) => {
      lineData.push({ x: r[6], y: r[5] });
    });
    this.lineData = lineData;
    console.log(data);
    const polyData = [];
    data.forEach((r, i) => {
      const x1 = i ? data[i - 1][6] : 0;
      const y1 = r[4];
      const x2 = r[6];
      const y2 = r[5];
      polyData.push([
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x2, y: 0 },
        { x: x1, y: 0 }
      ]);
    });
    this.polyData = polyData;
    console.log(polyData);
  }

  refresh() {
    this.refreshData();
    const lineData = this.lineData;
    const xRange = this.xRange.domain([min(lineData, d => d.x), max(lineData, d => d.x)]);
    const yRange = this.yRange.domain([min(lineData, d => d.y), max(lineData, d => d.y)]);

    var xAxis = axisBottom(xRange);
    var yAxis = axisLeft(yRange);

    this.xAxisG.call(xAxis);
    this.yAxisG.call(yAxis);

    const lineFunc = line()
      .x(d => xRange(d.x))
      .y(d => yRange(d.y))
      .curve(curveLinear);

    this.linePath.attr('d', lineFunc(lineData));

    const polyPaths = this.polyPaths;
    const polyData = this.polyData;
    console.log(this.lineData.length, lineData.length, polyData.length);
    this.polyData.forEach((polyData, i) => {
      polyPaths[i].attr('d', lineFunc(polyData));
    });


  }

  ngOnInit() {
    var vis = this.vis = select('#visualisation');
    this.xRange = scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]);
    this.yRange = scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]);

    this.xAxisG = this.vis.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')');

    this.yAxisG = this.vis.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (MARGINS.left) + ',0)');

    const data = [].concat(this.cs.betterWealthRanges);
    const polyPaths = [];
    data.forEach(x => {
      polyPaths.push(vis.append('svg:path')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('fill', 'purple'));
    });
    this.polyPaths = polyPaths;

    const circlePaths = [];
    data.forEach(x => {
      circlePaths.push(vis.append('svg:circle')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('fill', 'purple'));
    });
    this.circlePaths = circlePaths;

    this.linePath = vis.append('svg:path')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  update(name, value) {
    this[name] = value;
    this.refresh();
  }

}
