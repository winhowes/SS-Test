$(function(){
    var coordinates = [];
    
    /** Return a random integer between [0 and max)
     * max: 1 more than the maximum integer value to be returned
    */
    var random = function(max){
        return Math.floor(Math.random()*max);
    };
    
    /* Set grid up and coordinates
     * width: width of the grid
     * height: height of the grid
    */
    function setup(width, height){
        coordinates = [];
        var grid = $("<div></div>");
        for(var i=0; i<height; i++){
            var col = $("<div class='col' id='col"+i+"'></div>");
            var last = (i+1===height)? "last_row": "";
            for(var j=0; j<width; j++){
                col.append("<div class='col"+j+" row"+i+" "+last+" block'></div>");
                coordinates.push({x: j, y: i});
            }
            grid.append(col);
        }
        $("#grid").html(grid.html());
        
        /* Randomize the coordinates */
        var coords = $("<div></div>");
        var new_coordinates = [];
        while(coordinates.length){
            var rand = random(coordinates.length),
            randCoord = coordinates[rand];
            coordinates.splice(rand, 1);
            new_coordinates.push(randCoord);
            coords.append("<div class='coords x"+randCoord.x+" y"+randCoord.y+"' >("+randCoord.x+", "+randCoord.y+") = <span>w</span></div>");
        }
        coordinates = new_coordinates.slice(0);
        $("#coordinates").html(coords.html());
    }
    
    setup(100, 100);
    
    /* Setup Template */
    var templateWidth = templateHeight = 3;
    var template = $("<div></div>");
    for(var i=0; i<templateHeight; i++){
        var col = $("<div class='col' id='col"+i+"'></div>");
        var last = (i+1===templateHeight)? "last_row": "";
        for(var j=0; j<templateWidth; j++){
            var black  = Math.round(Math.random())? "black" : "";
            col.append("<div class='col"+j+" row"+i+" "+last+" "+black+" block'></div>");
        }
        template.append(col);
    }
    $("#templateGrid").html(template.html());
    
    $("#templateGrid .block").on("click", function(){
        $(this).toggleClass("black");
    });
    
    function drawTemplate(){
        $(".highlight").removeClass("highlight");
        if(this.counter===coordinates.length){
            window.clearInterval(this.interval);
            $("#percent").text(100);
            return;
        }
        var coord = coordinates[this.counter];
        $(".coords.x"+coord.x+".y"+coord.y).addClass("highlight");
        this.counter++;
        
        $("#percent").text(Math.round(1000*((this.counter)/coordinates.length))/10);
        
        if($("#grid .col"+coord.x+".row"+coord.y).hasClass("black")){
            return;
        }
        
        var center = Math.floor(templateWidth/2);
        for(var i=0; i<templateHeight; i++){
            for(var j=0; j<templateWidth; j++){
                var x = (coord.x-center+j),
                y = (coord.y-center+i),
                elem = $("#grid .col"+x+".row"+y),
                coordElem = $(".coords.x"+x+".y"+y+" span");
                if($("#template .col"+j+".row"+i).hasClass("black")){
                    elem.addClass("black");
                    coordElem.text("b");
                }
            }
        }
    }
    
    function restart(){
        $("#grid .block").removeClass("black");
        $(".coords span").text("w");
        if(drawTemplate.interval){
            window.clearInterval(drawTemplate.interval);
        }
        drawTemplate.counter = 0;
        drawTemplate.interval = window.setInterval(drawTemplate.bind(drawTemplate), 50);
    }
    
    restart();
    
    $("#restart").on("click", restart);
    
    $("#stop").on("click", function(){
        if(drawTemplate.interval){
            window.clearInterval(drawTemplate.interval);
        }
    });
    
    $("#resume").on("click", function(){
        drawTemplate.interval = window.setInterval(drawTemplate.bind(drawTemplate), 50);
    });
    
    //Initialize width/height textboxes
    $("#width, #height").val(100);
    
    $("#gridDimensions").on("submit", function(event){
        event.preventDefault();
        var widthInput = $("#width");
        var widthVal = parseInt($.trim(widthInput.val()));
        
        var heightInput = $("#height");
        var heightVal = parseInt($.trim(heightInput.val()));
        
        if(isNaN(widthVal)){
            widthInput.focus();
            return;
        }
        if(isNaN(heightVal)){
            heightInput.focus();
            return;
        }
        setup(widthVal, heightVal);
        restart();
    });
});