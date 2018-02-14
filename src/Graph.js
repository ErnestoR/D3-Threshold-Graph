import React, { Component } from 'react';
import * as d3 from 'd3';
import "d3-selection-multi";

const margin = { top: 10, right: 20, bottom: 30, left: 110 };
const fullWidth = 565;
const fullHeight = 400;
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;


const blue = `#1086E8`;
const lightBlue = `#C9E1F9`;
const grey = '#C1C1C1';
const gridLine = '#F6F7FB';
const tickColors = [lightBlue, gridLine];
const lineColors = ['#1086E8', '#63BD5A', '#7A5DA3'];

const meterWidth = 10;
const tickValues = [0,25,50,75,100];
let index = 1;

const yScale = d3.scaleLinear()
  .domain([0,100])
  .range([height, 0]);

const thresholds = [
  {
    id: 1,
    value: 50
  }
];

class Graph extends Component {
  constructor(props) {
    super(props);

    const parseTime = d3.timeParse('%d/%m/%Y');

    // threshold = {
    //   index: 1,
    //   value: 50,
    //   type: [1,2,3]
    // };

    this.state = {
      data: props.data.map(d => {
        return {
          ...d,
          values: d.values.map(item => ({
            ...item,
            date: parseTime(item.date)
          }))
        };
      }),
      thresholds,
    };

    this.addNewThreshold = this.addNewThreshold.bind(this);
  }

  componentDidMount() {
    const { data } = this.state;

    const svg = d3.select('.chart')
      .append('svg')
        .attrs({
          width  : width + margin.left + margin.right,
          height : height + margin.top + margin.bottom
        });

    svg.call(this.drawGridLines, this);

    const chartArea = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime()
      .domain([
        d3.min(data, device => d3.min(device.values, d => d.date)),
        d3.max(data, device => d3.max(device.values, d => d.date))
      ])
      .range([0, width]);

    // Add xAxis
    chartArea
      .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(7));

    // Add yAxis
    chartArea
      .append('g')
      .call(this.createYAxis()
        .tickFormat((d) => `${d}%`)
      );

    svg.call(this.addNewThreshold, true);

    // threshold meter container
    svg.call(this.drawThresholdMeter, this.addNewThreshold);

    //Meter hover area
    const hoverItem = svg.select('.threshold-hover-mark');

    const addThreshold = this.addNewThreshold;
    svg.append('rect')
      .attrs({
        'class': 'threshold-hover',
        'x': margin.left / 3 - 5,
        'y': margin.top,
        'height': height,
        'width': meterWidth + 10,
        'fill-opacity': .03,
      })
      .on('mouseenter', function () {
        hoverItem.classed('hidden', false)
      })
      .on('mousemove', function () {
        let y = d3.mouse(this)[1] - margin.top;

        hoverItem.attr('transform', `translate(0, ${y})`);

        let yValue = yScale.invert(y);
        let int = d3.format('d');

        hoverItem.select('.meter-text')
          .text(`${int(yValue)}%`)
      })
      .on('mouseleave', function () {
        hoverItem.classed('hidden', true)
      })
      .on('click',  function() {
        let y = d3.mouse(this)[1] - margin.top;

        let yValue = d3.format('d')(yScale.invert(y));

        hoverItem.select('.meter-text')
          .text(`${yValue} %`);

        d3.select('.x-meter')
          .call(addThreshold, false, y, yValue);
      });

    svg.select('.x-meter')
      .call(this.generateThresholds);


    setTimeout( () => {
      console.log('lol')

      thresholds.push({
        id: 2,
        value : 75,
      })

      svg.select('.x-meter')
        .call(this.generateThresholds);
    }, 2000)

    // Line Graph
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.health));

    chartArea
      .selectAll('.line')
      .data(data)
      .enter()
        .append('path')
        .attrs({
          'class': 'line',
          'd': d => line(d.values)
        })
        .styles({
          'stroke': (d, i) => lineColors[i],
          'stroke-width': 2,
          'fill': 'none'
        });
  }

  createYAxis() {
    return d3.axisLeft(yScale)
      .tickValues(tickValues)
  }

  drawGridLines(selection, cmp) {
    selection.append('g')
      .attrs({
        'class': 'grid',
        'transform': `translate(${margin.left}, ${margin.top})`
      })
      .call(cmp.createYAxis()
        .tickSize(-width)
        .tickFormat('')
      );
  }

  /**
   * Adds new threshold container (text, icon, line) and threshold meter bar
   *
   * @param selection - D3 selection
   * @param isHover - If true will add necessary attr for hover threshold
   * @param yPosition - Position to add threshold
   * @param yValue - value for text
   */
  addNewThreshold(selection, isHover, yPosition, yValue) {
    const me = this;
    let blueHover = blue;

    const container = selection.append('g')
      .attrs({
        'class': 'x-threshold' ,
        'data-index': index,
      });

    // label
    const text = container.append('text')
      .attrs({
        'class': 'meter-text',
        "y": 15,
      });

    // icon
    container.append('polygon')
      .attrs({
        'class': 'meter-icon',
        'points': '8 0 30 0 30 12 8 12 0 6',
        'transform': `translate(46.5, 4.5)`,
        'fill': `${isHover ? blueHover : lightBlue }`,
      });

    // line
    container.append("line")
      .attrs({
        'class': 'meter-line',
        'x1': margin.left + 2,
        'x2': fullWidth,
        'y1': 11,
        'y2': 11,
        'stroke': `${isHover ? blueHover : lightBlue }`,
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        'stroke-width': 1,
        'stroke-dasharray': '5, 5',
      });

    if (isHover) {
      container
        .attr('class', 'threshold-hover-mark')
        .classed('hidden', true);
    }

    if (yPosition) {
      text.text(`${yValue}%`);

      d3.select('.x-meter')
        .append('rect')
        .attrs({
          'class': 'meter-bar',
          'y': margin.top + yPosition,
          'x': margin.left / 3,
          'data-index': index,
          'height': height - yPosition,
          'width': meterWidth,
          'fill': lightBlue,
        });

      container
        .attr('transform', `translate(0, ${yPosition})`)
        .call(d3.drag()
          .on("start", this.dragStart)
          .on("drag", this.drag)
          .on("end", this.dragEnd));

      thresholds[index] = {
        index,
        position: margin.top + yPosition,
        value: yValue,
      };

      index++;
    }
  }

  drawThresholdMeter(selection, addNewThreshold) {
    const meterContainer = selection.append('g')
      .attr('class', 'x-meter');

    //Meter bar
    meterContainer
      .append('rect')
      .attrs({
        'class': 'meter',
        'x': margin.left / 3,
        'y': margin.top,
        'height': height,
        'width': meterWidth,
        'fill': blue,
        'rx': 4,
        'ry': 4,
      });
  }

  generateThresholds(selection) {
    const container = selection.selectAll('.meter-bar')
      .data(thresholds);

    container.exit()
      .remove();

    container.enter()
      .append('rect')
      .attrs({
        'class': 'meter-bar',
        'x': margin.left / 3,
        'y': (d) => yScale(d.value) + margin.top,
        'height': (d) => yScale(d.value),
        'width': meterWidth,
        'fill': lightBlue,
      });
  }

  dragStart() {
    d3.select(this)
      .classed('active', true);
  }

  drag() {
    const currentIndex = Number(this.getAttribute('data-index'));
    const y = yScale.invert(d3.event.y - 5);
    const yValue = d3.format('d')(y);
    const yPosition = d3.event.y - 5;

    if (0 > y || y > 100 ) {
      return;
    }

    // Transform threshold container
    d3.select(this)
      .attr('transform', `translate(0, ${yPosition})`)
      .select('.meter-text')
        .text(`${yValue}%`);

    // Transform threshold meter
    d3.select(`.x-meter rect[data-index="${currentIndex}"]`)
      .attrs({
        'y': margin.top + yPosition,
        height: height - yPosition,
      });

    thresholds[currentIndex] = {
      ...thresholds[currentIndex],
      position : margin.top + yPosition,
      value : Number(yValue)
    };

  }

  dragEnd() {
    d3.select(this)
      .classed('active', false);

    console.log(thresholds)
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
