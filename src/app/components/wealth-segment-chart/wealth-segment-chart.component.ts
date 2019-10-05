import { Component, Input } from '@angular/core';
import { select, curveLinear, min, max, line, axisBottom, axisLeft} from "d3";
import { scaleLinear } from "d3-scale";
import { UbiService } from '../../services/ubi.service';

const WIDTH = 256;
const HEIGHT = 256;
const MARGINS = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};

let chartCount = 0;

@Component({
  selector: 'wealth-segment-chart',
  templateUrl: './wealth-segment-chart.component.html'
})
export class WealthSegmentsChart {

  @Input() chunk = 10;

  id = '';

  lineData = [];
  polyData = [];
  taxPolyData = [];

  vis: any;

  richData: any;
  richestData: any;

  xRange: any;
  yRange: any;

  xAxisG: any;
  yAxisG: any;
  linePath: any;
  polyPaths: any[];
  taxPolyPaths: any[];

  segments = [];

  constructor(public ubi: UbiService) {
    chartCount += 1;
    this.id = "chart" + chartCount;
    setTimeout(() => {
      this.ubi.segments.subscribe(segments => {
        this.segments = segments.filter(x => x.y && x.chunk === this.chunk);
        this.init();
      });
    }, 0);
  }

  refreshData() {
    const data = this.segments;
    const lineData = [];
    data.forEach((r, i) => {
      lineData.push({ x: r.x, y: r.y });
    });

    this.lineData = lineData;
    const polyData = [];
    data.forEach((r, i) => {
      if (r.chunk === this.chunk) {
        const x1 = r.x1;
        const y1 = r.y;
        const x2 = r.x2;
        const y2 = r.y;
        polyData.push([
          { x: x1, y: y1 },
          { x: x2, y: y2 },
          { x: x2, y: 0 },
          { x: x1, y: 0 }
        ]);
      }
    });
    this.polyData = polyData;

    const taxPolyData = [];
    data.forEach((r, i) => {
      if (r.chunk === this.chunk) {
        const x1 = r.x1;
        const y1 = r.y * -1 * r.rateFinal / 100;
        const x2 = r.x2;
        const y2 = r.y * -1 * r.rateFinal / 100;
        taxPolyData.push([
          { x: x1, y: y1 },
          { x: x2, y: y2 },
          { x: x2, y: 0 },
          { x: x1, y: 0 }
        ]);
      }
    });
    this.taxPolyData = taxPolyData;
  }

  refresh() {
    this.refreshData();
    const polyData = this.polyData;
    const xRange = this.xRange.domain(
      [min(polyData, d => d[3].x),
      max(polyData, d => d[1].x)]
    );
    const yRange = this.yRange.domain(
      [min(polyData, d => d[3].y - (d[1].y * 0.4)),
      max(polyData, d => d[1].y)]
    );

    var xAxis = axisBottom(xRange);
    var yAxis = axisLeft(yRange);

    // this.xAxisG.call(xAxis);
    // this.yAxisG.call(yAxis);

    const lineFunc = line()
      .x(d => xRange(d.x))
      .y(d => yRange(d.y))
      .curve(curveLinear);

    // this.linePath.attr('d', lineFunc(lineData));

    const polyPaths = this.polyPaths;
    this.polyData.forEach((polyData, i) => {
      try {
        polyPaths[i].attr('d', lineFunc(polyData) + 'z');
      } catch(e) {}
    });

    const taxPolyPaths = this.taxPolyPaths;
    this.taxPolyData.forEach((polyData, i) => {
      try {
        taxPolyPaths[i].attr('d', lineFunc(polyData) + 'z');
      } catch(e) {}
    });
  }

  initialised = false;
  init() {
    const data = [].concat(this.segments);
    if (this.initialised) {
      this.refresh();
      return;
    }
    this.initialised = !!data.length;

    var vis = this.vis = select('#' + this.id);
    this.xRange = scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]);
    this.yRange = scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]);

    const polyPaths = [];
    data.forEach(x => {
      polyPaths.push(vis.append('svg:path')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('fill', '#3B225E'));
    });
    this.polyPaths = polyPaths;

    const taxPolyPaths = [];
    data.forEach(x => {
      taxPolyPaths.push(vis.append('svg:path')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('fill', '#FBD012'));
    });
    this.taxPolyPaths = taxPolyPaths;

    this.refresh();
  }

  ngOnChanges() {
    setTimeout(() => {
      this.refresh();
    }, 100)
  }

  update(name, value) {
    this[name] = value;
    this.refresh();
  }

}
