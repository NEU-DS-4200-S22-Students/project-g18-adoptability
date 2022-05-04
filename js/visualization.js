// Get data
function getData() {
    d3.selectAll("svg > *").remove()
    let dispatcher = d3.dispatch('zoom')
    d3.csv('./data/animals_sample_cleaned.csv',
        function(d) {
            return {
                'tta': Date.parse(d.status_changed_at) - Date.parse(d.published_at),
                'url': d.url,
                'species': d.species,
                'age': d.age,
                'size': d.size,
                'special_needs': d.attributes_special_needs,
                'spayed_neutered': d.attributes_spayed_neutered,
                'house_trained': d.attributes_house_trained,
                'shots': d.attributes_shots_current,
                'children': d.environment_children
            };
        })
        .then(function(d) {
            d.sort((a, b) => a['tta'] - b['tta'])
            barChartRef = barChart(d)
            dispatcher.on('zoom', barChart.updateSelection);
            timelineRef = timeline(d, dispatcher);
            barChartRef.selectionDispatcher(dispatcher);
        });
}

getData()
