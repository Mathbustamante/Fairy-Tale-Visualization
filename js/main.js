(function(){
    var instance = null;

    function init() {
        
        /* 
         * loads the WordCount file, where both the name, the number of words, and the image link is located. 
         * pass this into the WordCountVisualization where the visualization timeline will be loaded.
         */
        d3.csv("data/wordCount.csv")
        .then(function(wordCount) {
            let wordCountVis = new WordCountVisualization(wordCount);
            wordCountVis.update();
        });

    }

    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();
            init();
        }
        return instance;
    }

    Main.getInstance();
})();