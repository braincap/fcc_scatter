var dataLink = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var width = 700 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var x = d3.scaleTime().range([width, 0]);
var y = d3.scaleBand().range([0, height]);

var tool = d3.select('.graph')
  .append('div')
  .attr('class', 'tool');

var chart = d3.select('.chart')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('class', 'main')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json(dataLink, data => {

  data.forEach(d => {
    var date = new Date(1900, 01, 01, 00, d['Time'].split(':')[0], d['Time'].split(':')[1], 0);
    d['Time'] = date;
  });

  console.log(data);

  x.domain([d3.min(data.map(d => d['Time'])), d3.max(data.map(d => d['Time']))]);
  y.domain(data.map(d => d['Place']));

  xAxis = d3.axisBottom(x).ticks(5);
  var tickFormat = xAxis.tickFormat(d => d3.timeFormat("%M:%S")(d - d3.min(data.map(d => d['Time']))));
  chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  yAxis = d3.axisLeft(y);
  var tickValues = y.domain().filter(d => d % 5 == 0);
  yAxis.tickValues(tickValues);

  chart.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'rotate(0)')
    .attr('transform', 'translate(' + 0 + ',0)')
    .call(yAxis);

  chart.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d["Time"]))
    .attr('cy', d => y(d["Place"]))
    .attr('r', 4)
    .style('fill', d => d['Doping'] ? 'OrangeRed ' : 'SlateGrey ')
    .style('stroke', 'black')
    .on('mouseover', () => tool.style('display', null))
    .on('mouseout', () => tool.style('display', 'none'))
    .on('mousemove', d => {
      tool
        .style('display', 'inline-block')
        .html('<h3>' + d['Name'] + ' : ' + d['Nationality'] + '</h3>' +
          '<p>' + d['Year'] + ' : ' + d3.timeFormat("%M:%S")(d['Time']) + '</p>' +
          '<p>' + d['Doping'] + '</p>'
        )
        .style("left", d3.event.pageX + 30 + "px")
        .style("top", d3.event.pageY - 70 + "px")
    });

  d3.selectAll('.dot')
    .append('text')
    .value(d => d['Name']);
});