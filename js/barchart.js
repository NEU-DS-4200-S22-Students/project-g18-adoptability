const width2 = 500,
    height2 = 300;
const margin2 = {
    top: 40,
    bottom: 30,
    left: 40,
    right: 40
};

function barChart(data) {
    console.log("barchart called");
    let svg2 = d3
            .select('#vis-svg-2')
            .append('svg')
            .attr('width', width2)
            .attr('height', height2)
            .style('background', '#e9f7f2'),
        dispatch;

    // Filter on species
    if (document.getElementById('species_option').value !== 'Species') {
        console.log('Filtering on species')
        data = data.filter(d => d.species === document.getElementById('species_option').value)
    }

    // Filter on age
    if (document.getElementById('age_option').value !== 'Age Range') {
        console.log('Filtering on age')
        data = data.filter((d) => d.age === document.getElementById('age_option').value)
    }

    // Filter on size
    if (document.getElementById('size_option').value !== 'Size') {
        console.log('Filtering on size')
        data = data.filter(d => d.size === document.getElementById('size_option').value)
    }

    // Filter on special needs
    if (document.getElementById('special_needs').checked) {
        console.log('Filtering on special needs')
        data = data.filter(d => d.special_needs === 'TRUE')
    }

    // Generate frequency information for given data
    function summarize(data) {
        return [
            { trait: 'House-Trained', freq: data.filter(d => d.house_trained === 'TRUE').length / data.length || 0},
            { trait: 'Spayed/Neutered', freq: data.filter(d => d.spayed_neutered === 'TRUE').length / data.length || 0},
            { trait: 'Shots Up-To-Date', freq: data.filter(d => d.shots === 'TRUE').length / data.length || 0},
            { trait: 'Child-Friendly', freq: data.filter(d => d.children === 'TRUE').length / data.length || 0}
        ];
    }

    let traitData = summarize(data);

    let yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height2 - margin2.bottom, margin2.top]);

    let xScale = d3.scaleBand()
        .domain( traitData.map(function(d){
            return d.trait;
        }))
        .range([margin2.left, width2 - margin2.right])
        .padding(0.5);

    //Draw Axes
    let yAxis = svg2
        .append('g')
        .attr('transform', `translate(${margin2.left},0)`)
        .call(d3.axisLeft().tickFormat(d3.format(".0%")).scale(yScale));

    //Add label
    yAxis
        .append('text')
        .attr('y', 30)
        .attr('x', 30)
        .attr('fill', newBlack)
        .attr("font-weight", 700)
        .text('Frequency');

    let xAxis = svg2
        .append('g')
        .attr('transform', `translate(0,${height2 - margin2.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    //Add label
    xAxis
        .append('text')
        .attr('x', width2 - margin2.left)
        .attr('y', -10)
        .attr('fill', newBlack)
        .attr("font-weight", 700)
        .text('Trait');

    //Draw bars
    function drawBars(data) {
        return svg2
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', function(d) {
                return xScale(d.trait);
            })
            .attr('y', function(d) {
                return height2 - margin2.bottom;
            })
            .attr('width', xScale.bandwidth())
            .attr('fill', lavender)
            .attr('stroke', purple)
            //if there is nothing in the data set, do not draw the bars
            .attr('opacity', function () {
                if (data.length > 0) {
                    return 1
                }
                return 0
            })
            // chart height animation
            .attr("height", 0)
            .transition()
            .ease(d3.easeLinear)
            .attr("y", function (d) {return yScale(d.freq)})
            .attr("height", function (d) {
                return height2 - margin2.bottom - yScale(d.freq)});
    }

    let bars = drawBars(traitData)

    // Dispatching
    barChart.updateSelection = function(selectedData) {
        traitData = summarize(selectedData)
        drawBars(traitData)
        return barChart;
    }
    barChart.selectionDispatcher = function (_) {
        if (_) {
            dispatch = _
            return barChart;
        }
        return dispatch
    }

    return barChart
}
