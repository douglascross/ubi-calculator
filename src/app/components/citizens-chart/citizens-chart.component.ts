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

  originalData = [];
  data = [];

  vis: any;

  richData: any;
  richestData: any;

  xRange: any;
  yRange: any;

  xAxisG: any;
  yAxisG: any;
  linePath: any;

  constructor(cs: CitizenService) {
    const data = [];
    cs.betterWealthRanges.forEach((r, i) => {
      data.push({ x: r[6], y: r[5] });
    });

    this.richestData = data.pop();
    this.richData = data.pop();

    this.originalData = data;
  }

  refreshData() {
    this.data = [].concat(this.originalData);
    if (this.includeRich) {
      this.data.push(this.richData);
    }
    if (this.includeRichest) {
      this.data.push(this.richestData);
    }
  }

  refresh() {
    this.refreshData();
    const lineData = this.data;
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
  }

  ngOnInit() {
    const lineData = this.data;
    var vis = this.vis = select('#visualisation');
    const xRange = this.xRange = scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]);
    const yRange = this.yRange = scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]);


    this.xAxisG = this.vis.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')');

    this.yAxisG = this.vis.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (MARGINS.left) + ',0)');

    this.linePath = vis.append('svg:path')
      .attr('stroke', 'blue')
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
