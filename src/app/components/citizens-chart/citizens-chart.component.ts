import { Component, OnInit } from '@angular/core';
import { select, curveLinear, min, max, line, axisBottom, axisLeft} from "d3";
import { scaleLinear } from "d3-scale";
import { CitizenService } from '../../services/citizen.service';

@Component({
  selector: 'app-citizens-chart',
  templateUrl: './citizens-chart.component.html',
  styleUrls: ['./citizens-chart.component.scss']
})
export class CitizensChartComponent implements OnInit {

  data = [];

  constructor(cs: CitizenService) {
    // const citizens = cs.getAll(1000);
    const data = [];
    console.log(cs.betterWealthRanges);
    cs.betterWealthRanges.forEach((r, i) => {
      data.push({ x: r[6], y: r[5] });
    });

    this.data = data;

    console.log(data);
  }

  ngOnInit() {
    const lineData = this.data;
    var vis = select('#visualisation');
    const WIDTH = 1000;
    const HEIGHT = 500;
    const MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 100
    };
    const xRange = scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right])
      .domain([min(lineData, d => d.x), max(lineData, d => d.x)]);
    const yRange = scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom])
      .domain([min(lineData, d => d.y), max(lineData, d => d.y)]);

    var xAxis = axisBottom(xRange);
    // .tickSize(5)
    // .tickSubdivide(true);
    var yAxis = axisLeft(yRange);
    // .tickSize(5)
    // .orient('left')
    // .tickSubdivide(true);

    vis.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
      .call(xAxis);

    vis.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
      .call(yAxis);

    const lineFunc = line()
      .x(d => xRange(d.x))
      .y(d => yRange(d.y))
      .curve(curveLinear);

      console.log(lineData);

    vis.append('svg:path')
      .attr('d', lineFunc(lineData))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }

}
