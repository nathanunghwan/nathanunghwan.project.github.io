// Define the map and set the initial view
var map = L.map('map').setView([0, 0], 2);

// Add the base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);


d3.json("sample.json").then(function(data) {
  // Initialize an empty object to store the debt data
  var debtData = {};

  // Loop through the data and store the debt-to-GDP ratios by country
  data.forEach(function(d) {
    if (d['2021'] !== "no data") {
      debtData[d['Countries']] = parseFloat(d['2021']);
    }
  });

  // Load the GeoJSON data and add it to the map
  d3.json("countries.geojson").then(function(data) {
    // Create a Leaflet GeoJSON layer with styles based on the debt data
    var countries = L.geoJson(data, {
      style: function(feature) {
        // Get the country name and debt-to-GDP ratio
        var country = feature.properties.ADMIN;
        var debtRatio = debtData[country];

        // Set the color based on the debt-to-GDP ratio
        if (debtRatio) {
          if (debtRatio < 25) {
            return { color: '#ff7f00',fillColor: '#ff7f00' };
          } else if (debtRatio < 50) {
            return { color: '#c7e9c0', fillColor: '#c7e9c0' };
          } else if (debtRatio < 75) {
            return { color: '#a1d99b',fillColor: '#a1d99b' };
          } else if (debtRatio < 100) {
            return { color: '#74c476',fillColor: '#74c476' };
          } else if (debtRatio < 200) {
            return { color: '#007500',fillColor: '#007500' };  
          } else {
            return { color: '#0067A3',fillColor: '#0067A3' };
          }
        } else {
          return { color: 'gray' };
        }
      },
      onEachFeature: function(feature, layer) {
        // Get the country name and debt-to-GDP ratio
        var country = feature.properties.ADMIN;
        var debtRatio = debtData[country];

        // Create a tooltip with the country name and debt-to-GDP ratio
        var tooltipText = country + ': ' + (debtRatio ? debtRatio.toFixed(2) + '%' : 'No data');

        // Set the tooltip style
        layer.bindTooltip(tooltipText, {
          className: 'custom-tooltip'
        });
      }
    });

    // Add the countries layer to the map
    countries.addTo(map);
  });
});

// ******

//line chart
// Load the data from the JSON file
d3.json("sample.json").then(data => {
  console.log(data);
  // Get the country names from the data
  let countryNames = data.map(d => d.Countries);
  console.log(countryNames);

  // Add options to the select element for each country
  d3.select("#country-select")
    .selectAll("option")
    .data(countryNames)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

  // Call createPlots with the default country and the data
  createPlots(countryNames[0], data);

  // Update the plots when the country selection changes
  d3.select("#country-select")
    .on("change", function() {
      // Get the selected country
      let selectedCountry = d3.select(this).property("value");
      // Call createPlots with the selected country and the data
      createPlots(selectedCountry, data);
    });
});

function createPlots(country, data) {
  const countryData = data.find(d => d.Countries === country);
  const years = Object.keys(countryData).filter(key => key !== 'Countries');
  const debtRatios = years.map(year => countryData[year]);

  const chartData = [{
    x: years,
    y: debtRatios,
    type: 'line',
    name: `${country} Periodic Household Debt Ratio`,
    line: {
      color: 'green', 
      width: 3 
    },
    fill: 'tozeroy', 
    fillcolor: 'rgba(0, 255, 0, 0.5)' 
  }];

  const layout = {
    title: {
      text: `${country} Periodic Household Debt Ratio`,
      font: {
        size: 48,
        family: 'Arial',
        weight: 'bold'
      }
    },
    xaxis: {
      title: {
        text: 'Year',
        font: {
          size: 24
        }
      },
      tickfont: {
        size: 18 // 큰 숫자 크기로 변경
      }
    },
    yaxis: {
      title: {
        text: 'Debt Ratio',
        font: {
          size: 24
        }
      },
      tickfont: {
        size: 18 // 큰 숫자 크기로 변경
      }
    }
  };

  Plotly.newPlot('line-container', chartData, layout);
}


