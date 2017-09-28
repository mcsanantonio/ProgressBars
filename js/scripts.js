        var i = 0;
        var percent;

        // Create data array of values to visualize
        var endpoint = { "buttons":[47,32,-36,-6],"bars":[39,83,40], "limit":190 };
        var dataArray = endpoint.bars;
        var element = d3.select('#graphic').node();
        var a = element.getBoundingClientRect().width;

        console.log(a);
         // optional values
        var margin = {
            top: 20,
            right: 0,
            bottom: 0,
            left: 0
        };

        var width = 960,
            height = 300;

        // Create variable for the SVG
        var svg = d3.select("#graphic").append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("width", '100%')
            .attr("height", height)
            .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
            .attr('preserveAspectRatio','xMinYMin')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            //.attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(dataArray, function (d) {
                return endpoint.limit; // max of 100
            })]);

        var y = d3.scale.linear()
            .range([0, height])
            .domain(dataArray.map(function (d) {
                return d;
            }));

        updateBars(0); // call initially
        generateControls();

        function incrementBar(objButton){  
            var increment = objButton.value;
            update(increment);
        }

        function update(i) {
            var bar = document.getElementById("barName");
            var selectedValue = bar.selectedIndex;

            d3.select("svg").remove();

            svg = d3.select("#graphic").append("svg")
            .attr("width", '100%')
            .attr("height", height)
            .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
            .attr('preserveAspectRatio','xMinYMin')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            dataArray[selectedValue] = parseInt(dataArray[selectedValue]) + parseInt(i);
            if (dataArray[selectedValue] <= 0 )
                dataArray[selectedValue] = 0; 
            updateBars(i);
        }

        function updateBars(i) {
            var bars = svg.selectAll(".bar")
              .data(dataArray)
              .enter()
              .append("g");

             //append rects - iterates the number of items
            bars.append("rect")
              .attr("class", function(d) {
                var barClass = "bar";

                if (d >= endpoint.limit )
                  barClass = "over";

                return barClass;
              })
              .attr("x", function(d, i) {return margin.left })
              .attr("y", function(d, i) {return height / dataArray.length * i})
              .attr("height", 60)
              .attr("width", function (d) {
                percent = d;

                if (percent <= 0) 
                  d = 0;

                return x(d);
              });
 

            // Select, append to SVG, and add attributes to text
            bars.append("text")
               .attr("class", function(d) {
                    var textClass = "text";

                    if (d >= endpoint.limit)
                      textClass = "over-text";

                    return textClass;
                  })
               .attr("x", function (d) {
                    return a / 2;
                })
               .attr("y", function (d, i) { return (height / dataArray.length) * i + 35})
               .text(function (d) {
                    if (d <= 0) 
                      d = 0;

                    return d + "%";
                });

        }

        function generateControls() {
          // create dropdown
            var select = d3.select("#dropdown-container")
            .append("select")
            .attr("class","select")
            .attr("name","barName")
            .attr("id","barName")

            var options = select
            .selectAll('option')
            .data(endpoint.bars).enter()
            .append('option')
            .text(function (d,i) { return "Progress Bar #" + (i + 1); });

          // create buttons
            d3.select("#btn-container")
            .selectAll("input")
            .data(endpoint.buttons)
            .enter()
            .append("input")
            .attr("type","button")
            .attr("class","button")
            .attr("value", function (d){return d})
            .attr("onclick", "incrementBar(this)")

        }