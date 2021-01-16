function WordCountVisualization(wordCount){

    let self = this;
    self.data = wordCount;
    self.init();
};

WordCountVisualization.prototype.init = function(){
    let self = this;
    let divVisualization = d3.select("#word-count-visualization");

    // gets access to the div element created for this chart from HTML
    self.svgBounds = divVisualization.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width;
    self.svgHeight = 500;

    // creates svg element within the div
    self.svg = divVisualization.select("svg")
        .attr("id", "visualization")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

    // appends tooltip used when mouse enter
    d3.select("#word-count-visualization")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute") 
        .style("opacity", 0 )
        .style("z-index", 10);

    // converts string into a number
    for(let i = 0; i < self.data.length; i++){
        self.data[i].COUNT = +self.data[i].COUNT;
    }

    self.maxCount = d3.max(self.data, function(d){
        return d.COUNT;
    });
    self.minCount = d3.min(self.data, function(d){
        return d.COUNT;
    });
    
    // x axis scale based on the number of words
    self.xScale = d3.scaleLinear()
        .domain([self.minCount, self.maxCount])
        .range([100, self.svgWidth - 50]);

    // force layout simulation
    self.simulation = d3.forceSimulation(self.data) 
        .force('charge', d3.forceManyBody().strength(5))
        .force('x', d3.forceX().x(function(d, i) {
            return self.xScale(d.COUNT);
          }))
        .force('y', d3.forceY().y(function(d) {
            return self.svgHeight/2;
        }))
        .force('collision', d3.forceCollide().radius(function(d) {
            return 31;
        }));
};

/*
 * tooltip definition.
 */
WordCountVisualization.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<div>";
    tooltip_data.result.forEach(function(row){
        text += "<span>" + row.NAME+ "</span>"
    });
    return text;
}

WordCountVisualization.prototype.update = function(){
    let self = this;   

    let svg = d3.select("#word-count-visualization").select("svg");
    
    //Update text and line to timeline layout
    svg.append("text")
        .attr("class", "text")
        .attr("x", self.xScale(600))
        .attr("y", 40)
        .text("600 Words")

    svg.append("text")
        .attr("class", "text")
        .attr("x", self.xScale(1200))
        .attr("y", 40)
        .text("1200")

    svg.append("text")
        .attr("class", "text")
        .attr("x", self.xScale(1800))
        .attr("y", 40)
        .text("1800")

    svg.append("text")
        .attr("class", "text")
        .attr("x", self.xScale(2450))
        .attr("y", 40)
        .text("2450")

    svg.append("text")
        .attr("class", "text")
        .attr("x", self.xScale(3450))
        .attr("y", 40)
        .text("3450")

    svg.append("line")
        .attr("stroke", "red")
        .attr("stroke-width", 5)
        .attr("x1", 0)
        .attr("x2", self.svgWidth)
        .attr("y1", self.svgHeight/2)
        .attr("y2", self.svgHeight/2)

    svg.append("line")
        .attr("class", "lineChart")
        .attr("x1", self.xScale(600))
        .attr("x2", self.xScale(600))
        .attr("y1", 50)
        .attr("y2", self.svgHeight - 100)

    svg.append("line")
        .attr("class", "lineChart")
        .attr("x1", self.xScale(1200))
        .attr("x2", self.xScale(1200))
        .attr("y1", 50)
        .attr("y2", self.svgHeight - 100)

    svg.append("line")
        .attr("class", "lineChart")
        .attr("x1", self.xScale(1800))
        .attr("x2", self.xScale(1800))
        .attr("y1", 50)
        .attr("y2", self.svgHeight - 100)
    
    svg.append("line")
        .attr("class", "lineChart")
        .attr("x1", self.xScale(2450))
        .attr("x2", self.xScale(2450))
        .attr("y1", 50)
        .attr("y2", self.svgHeight - 100)

    svg.append("line")
        .attr("class", "lineChart")
        .attr("x1", self.xScale(3450))
        .attr("x2", self.xScale(3450))
        .attr("y1", 50)
        .attr("y2", self.svgHeight - 100)

    // creates a defs tag where each pattern will store an image with id corresponding to the number of words.
    // i followed a tutorial to implement this. I added the link in the README.txt file. 
    svg.append("defs").selectAll("defs")
        .data(self.data)
        .enter()
        .append("pattern")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("id", function(d){
            console.log(d);
            return d.index
        })
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("xlink:href", function(d){
            return d.LINK
        });

    // appends each node giving it an id for later use fot the tooltip
    let nodes = svg.selectAll("circle").data(self.data)
    nodes.exit().remove()
    nodes = nodes
        .enter()
        .append("circle")
        .attr("id", function(d){
            return d.NAME;
        })
        .attr("class", "fairy-tale")
        .attr("stroke", "black")
        .attr("stroke-width", 1)

    self.simulation.on("tick", function() {
        nodes
            .attr("r", 30)
            .attr("cx", function(d) { 
                return d.x; 
            }) 
            .attr("cy", function(d) { 
                return d.y; 
            })
            .attr("fill", function(d){
                return "url(#" + d.index + ")"
            });
    });

    // this for loop was implemented to add event listeners for each circle in the visualization
    let circles = document.querySelectorAll(".fairy-tale")
    for(let i = 0; i < circles.length; i++){
        // highlights the circles that are available to click
        if(circles[i].getAttribute("id") === "FAIRY OINTMENT" || circles[i].getAttribute("id") === "MOUSE AND MOUSER" || circles[i].getAttribute("id") === "THE OLD WOMAN AND HER PIG" || circles[i].getAttribute("id") === "THE THREE SILLIES" || circles[i].getAttribute("id") === "TITTY MOUSE AND TATTY MOUSE"){
            circles[i].classList.add("highlighted")
        }

        // once mouse enter, display tooltip above the cursor
        circles[i].addEventListener("mouseenter", function(e){
            let id = e.target.getAttribute("id")
            tooltip_data = {
                "result":[
                    {
                        "NAME": id,
                    }
                ] 
            }             
            let text = WordCountVisualization.prototype.tooltip_render(tooltip_data)
            d3.select('#tooltip')
                .html(text)
                .style('opacity', 1)
                .style('left', (e.pageX-76) + 'px')
                .style('top', (e.pageY-80) + 'px')
        });

        // removea tooltip once mouse leaves
        circles[i].addEventListener("mouseleave", function(e){
            d3.select('#tooltip')
                .style('opacity', 0)
        });

        // once clicked, loads the other visualization located on TextVisualization.js
        circles[i].addEventListener("click", function(e){
            let id = e.target.getAttribute("id");
            if(id === "FAIRY OINTMENT" || id === "MOUSE AND MOUSER" || id === "THE OLD WOMAN AND HER PIG" || id === "THE THREE SILLIES" || id === "TITTY MOUSE AND TATTY MOUSE"){
                d3.text("/data/" + id + ".txt").then(function(text) {
                    let objectOfWords = WordCountVisualization.prototype.parseWords(text)
                    let textVisualization = new TextVisualization(objectOfWords); 
                    textVisualization.update();
                });
            }
        });
    }
}

/*
 *  Helper functions:
 *  parseWords: parses the txt file for the selected fary tale and returns an array of objects with the word as key and frequency as value. 
 */
WordCountVisualization.prototype.parseWords = function (text){
    let arrayOfLines = text.split('\n');
    // checks which ones are words and add them into the allWords array
    let allWords = []
    for(let i = 1; i < arrayOfLines.length; i++){
        let arrayOfWords = arrayOfLines[i].split(' ');
        for(let j = 0; j < arrayOfWords.length; j++){
            let currentWord = arrayOfWords[j]
            //Removes non-letter from string
            let transforedWord = "";
            for(let k = 0; k < currentWord.length; k++){
                if(WordCountVisualization.prototype.isLetter(currentWord[k])){
                    transforedWord+=currentWord[k]
                }
            }
            //Does not add 'stopwords' to allWords
            if(!WordCountVisualization.prototype.stopWords(transforedWord.toLowerCase())){
                allWords.push(transforedWord.toLowerCase())
            }
        }
    }

    // holds the work and the frequency for each word
    let objectOfWords = {};
    for(let i = 0; i < allWords.length; i++){
        let currentWord = allWords[i];
        if(objectOfWords.hasOwnProperty(currentWord)){
            objectOfWords[currentWord] += 1;
        } else {
            objectOfWords[currentWord] = 1;
        }
    }

    // holds final array of objects
    let result = new Array();
    for (let key in objectOfWords) {
        result.push({
            "WORD": key,
            "FREQUENCY": objectOfWords[key]
        })
    }
    return result;
}

WordCountVisualization.prototype.isLetter = function (character) {
    let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\'-';
    return letters.indexOf(character) >= 0;
}

WordCountVisualization.prototype.stopWords = function (word) {
    // got array of 'stopwords' from: http://xpo6.com/list-of-english-stop-words/
    let letters = ["", "won't", "a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "i", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thick", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"];
    return letters.indexOf(word) >= 0;
}


