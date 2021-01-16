function TextVisualization(objectOfWords){
    let self = this;
    self.objectOfWords = objectOfWords
    self.init();
};

TextVisualization.prototype.init = function(){
    let self = this;
    self.data = self.objectOfWords;
    
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    let divVisualization = d3.select("#text-visualization");

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divVisualization.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width;
    self.svgHeight = 740;

    //creates svg element within the div
    self.svg = divVisualization.select("svg")
        .attr("id", "visualization")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

    self.maxRadius = d3.max(self.data, function(d){
        return d.FREQUENCY;
    });

    // creates scale for the radius setting a minimum radius to 20
    self.radiusScale = d3.scaleLinear()
        .domain([0, self.maxRadius])
        .range([20, 80]);

    // depending on the radius scale the font size
    self.textScale = d3.scaleLinear()
        .domain([20, 80])
        .range([18, 40]);

    self.colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain([0, self.maxRadius])

    self.simulation = d3.forceSimulation(self.data) 
        .force("charge", d3.forceManyBody().strength(-90))
        .force("center", d3.forceCenter().x(self.svgWidth/2).y(self.svgHeight/2))
        .force('x', d3.forceX().x(function(d, i) {
            return self.svgWidth/2;
          }))
        .force('y', d3.forceY().y(function(d) {
            return self.svgHeight/2;
        }));
};

TextVisualization.prototype.update = function(){
    let self = this;   
    let svg = d3.select("#text-visualization").select("svg");

    let nodes = svg.selectAll("circle").data(self.data)
    nodes.exit().remove()
    nodes = nodes
        .enter()
        .append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("r", function(d){
            return self.radiusScale(d.FREQUENCY);
        })
        .style("fill", function(d){
            return self.colorScale(d.FREQUENCY);
        }).merge(nodes);

    nodes
        .attr("r", function(d){
            return self.radiusScale(d.FREQUENCY);
        })
        .style("fill", function(d){
            return self.colorScale(d.FREQUENCY);
        })
        .merge(nodes);

    
    let wordName = svg.selectAll("text").data(self.data)
    wordName.exit().remove()
    wordName = wordName
        .enter()
        .append("text")
        .text(function(d){
            return d.WORD;
        })
        .style("font-size", function(d){
            return self.textScale(d.FREQUENCY);
        })
        .attr("class", "word-text")
        .merge(wordName);

    wordName
        .text(function(d){
            return d.WORD;
        })
        .style("font-size", function(d){
            return self.textScale(d.FREQUENCY);
        })
        .attr("class", "word-text")
        .merge(wordName);

    let wordFrequency = svg.selectAll("text")
        .append("tspan")
        .text(function(d){
            return d.FREQUENCY;
        })
        .style("font-size", function(d){
            return self.textScale(d.FREQUENCY);
        })
        .attr("class", "word-text");

    self.simulation.nodes(self.data)
        .force('collision', d3.forceCollide().radius(function(d) {
            return self.radiusScale(d.FREQUENCY);
    }));

    self.simulation.on("tick", function() {
        nodes
            .attr("cx", function(d, i) { 
                return d.x; 
            }) 
            .attr("cy", function(d) { 
                return d.y; 
            });
        
        wordName
            .attr("x", function(d){
                return d.x; 
            })
            .attr("y", function(d){
                return d.y;
            });
        
        wordFrequency
            .attr("x", function(d){
                return d.x; 
            })
            .attr("y", function(d){
                let fontSize = self.textScale(d.FREQUENCY);
                return d.y+fontSize+2;
            });
    });
        
    nodes.call(d3.drag()
        .on("start", (e, d) => dragstart(e, d))
        .on("drag", (e, d) => drag(e, d))
        .on("end", (e, d) => dragend(e, d)));

    wordName.call(d3.drag()
        .on("start", (e, d) => dragstart(e, d))
        .on("drag", (e, d) => drag(e, d))
        .on("end", (e, d) => dragend(e, d)));

    wordFrequency.call(d3.drag()
        .on("start", (e, d) => dragstart(e, d))
        .on("drag", (e, d) => drag(e, d))
        .on("end", (e, d) => dragend(e, d)));

    function dragstart(e, d) {
        if (!e.active) self.simulation.alphaTarget(0.3).restart(); d.fx = d.x;
            d.fy = d.y;
    }
        
    function drag(e, d) { 
        d.fx = e.x; d.fy = e.y;
    }
        
    function dragend(e, d) {
    if (!e.active) self.simulation.alphaTarget(0); d.fx = null;
        d.fy = null;
    }

}



