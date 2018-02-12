import React, { Component } from 'react';
import * as d3 from 'd3';

const margin = { top: 10, right: 20, bottom: 30, left: 110 };
const fullWidth = 565;
const fullHeight = 400;
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;
const meterWidth = 10;

const blue = `#1086E8`;
const lightBlue = `#C9E1F9`;
const grey = '#C1C1C1';


let yScale = d3.scaleLinear()
  .domain([0,100])
  .range([height, 0]);

class Graph extends Component {
  constructor(props) {
    super(props);

    const parseTime = d3.timeParse('%d/%m/%Y');

    this.state = {
      data: props.data.map(d => {
        return {
          ...d,
          values: d.values.map(item => ({
            ...item,
            date: parseTime(item.date)
          }))
        };
      })
    }

    this.addNewThreshold = this.addNewThreshold.bind(this);
  }

  componentDidMount() {
    const { data } = this.state;

    const svg = d3.select('.chart')
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const chartArea = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    let xScale = d3.scaleTime()
      .domain([
        d3.min(data, device => d3.min(device.values, d => d.date)),
        d3.max(data, device => d3.max(device.values, d => d.date))
      ])
      .range([0, width]);

    chartArea
      .append('g')
        .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(7));

    let yScale = d3.scaleLinear()
      .domain([0,100])
      .range([height, 0]);

    chartArea
      .append('g')
      .call(d3.axisLeft(yScale)
        .tickValues([0,25,50,75,100])
        .tickFormat((d) => `${d}%`)
      );

    svg.call(this.addNewThreshold, true);

    // threshold meter container
    svg.call(this.drawThresholdMeter, this.addNewThreshold);


    var line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.health))

    chartArea
      .selectAll('.line')
      .data(data)
      .enter()
        .append('path')
        .attr('class', 'line')
        .attr('d', d => line(d.values))
        .style('stroke', (d, i) => ['#1086E8', '#63BD5A', '#7A5DA3'][i])
        .style('stroke-width', 2)
        .style('fill', 'none');

    //this.addNewthreshold(chartArea)
  }

  drawThresholdMeter(selection, addNewThreshold) {
    const meterContainer = selection.append('g');
    const hoverItem = selection.select('.threshold-hover-mark');

    //Meter bar
    meterContainer
      .append('rect')
      .attr('class', 'meter')
      .attr('x', margin.left / 3)
      .attr('y', margin.top)
      .attr('height', height)
      .attr('width', meterWidth)
      .attr('fill', blue);

    //Meter hover area
    meterContainer
      .append('rect')
      .attr('class', 'threshold-hover')
      .attr('x', margin.left / 3 - 5)
      .attr('y', margin.top)
      .attr('width', meterWidth + 10)
      .attr('height', height)
      .attr('fill-opacity', .1)
      .on('mouseenter', function () {
        hoverItem.classed('hidden', false)
      })
      .on('mousemove', function (d) {
        let y = d3.mouse(this)[1] - margin.top;

        hoverItem.attr('transform', `translate(0, ${y })`)
      })
      .on('mouseleave', function () {
        hoverItem.classed('hidden', true)
      })
      .on('click',  function() {
        let y = d3.mouse(this)[1] - margin.top;

        selection.call(addNewThreshold, false, y);
      });
  }

  dragStart() {
    console.log('drag start');
    d3.select(this)
      .classed('active', true);
  }

  drag() {
    let y = yScale.invert(d3.event.y - 5);

    if (0 > y || y > 100 ) {
      return;
    }

    console.log('drag', y);

    d3.select(this)
      .attr('transform', `translate(0, ${d3.event.y - 5})`)
  }

  dragEnd() {
    console.log('drag end');
    d3.select(this)
      .classed('active', false);
  }

  addNewThreshold(selection, isHover, yPosition) {
    let newColor = '#'+((1<<24)*Math.random()|0).toString(16);
    let blueHover = '#1086E8';

    const container = selection.append('g')


    // container.append('text')
    //   .attr("x", -25)
    //   .attr("y", 17)
    //   .text(yPosition);

    container.append('polygon')
        .attr("points", "8 0 30 0 30 12 8 12 0 6")
        .attr("fill", `${isHover ? blueHover : newColor }`)
        .attr('transform', `translate(46.5, 4.5)`);

    if (isHover) {
      container
        .attr('class', 'threshold-hover-mark')
        .classed('hidden', true);
    }

    container.append("line")
      .attr('class', 'threshold-line')
      .attr("x1", margin.left + 2)
      .attr("x2", fullWidth)
      .attr("y1", 11)
      .attr("y2", 11)
      .attr("stroke", `${isHover ? blueHover : newColor }`)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5, 5");

    if (yPosition) {
      container
        .attr('transform', `translate(0, ${yPosition + 5})`)
        .call(d3.drag()
          .on("start", this.dragStart)
          .on("drag", this.drag)
          .on("end", this.dragEnd));
    }
  }

  render() {
    return (
      <div
        className="chart"
        ref={(r) => this.chartRef = r}>
      </div>
    )
  }
}

export default Graph;
