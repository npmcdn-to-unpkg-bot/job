// var app = angular.module('app', [
//         'ngResource',
//         'ui.router'
//     ]);

(function(){
    var width = 1000, height = 800;

    var $leftPanelSettings = $('.i-left-panel-settings');

    var data = [
        {
            name: 'A',
            order: 0,
            link: [7, 4, 9]
        },{
            name: 'B',
            order: 1,
            link: [0]
        },{
            name: 'C',
            order: 2,
            link: [1]
        },{
            name: 'D',
            order: 3,
            link: [2]
        },{
            name: 'E',
            order: 4,
            link: [3]
        },{
            name: 'F',
            order: 5,
            link: [1, 2]
        },{
            name: 'G',
            order: 6,
            link: [5]
        },{
            name: 'H',
            order: 7,
            link: [6]
        },{
            name: 'I',
            order: 8,
            link: [0]
        },{
            name: 'J',
            order: 9,
            link: [10]
        },{
            name: 'K',
            order: 10,
            link: [4]
        }
    ], nodes = [], edges = [];

    for(var i = 0; i < data.length; i ++){
        var tmpData = data[i];
        nodes.push({
            name: tmpData.name
        });
        for(var j = 0; j < tmpData.link.length; j ++){
            edges.push({
                source: tmpData.order,
                target: tmpData.link[j]
            });
        }
    }

    nodes.forEach(function(d, i){
        d.x = d.y = width/(nodes.length)*i;
        console.log(d);
    });

    var svg = d3.select(".i-show-canvas").append("svg")
        .attr("width", width)
        .attr("height", height);


    var force = d3.layout.force()
        .nodes(nodes)
        .links(edges)
        .size([width,height])
        .linkDistance(500)
        .linkStrength(0)
        .charge([-900]);

    var drag = force.drag()
        .on("dragstart", function(d, i){
            d.fixed = true;
        });

    force.start();

    var defs = svg.append("defs");

    var arrowMarker = defs.append("marker")
                            .attr("id","arrow")
                            .attr("markerUnits","strokeWidth")
                            .attr("markerWidth","12")
                            .attr("markerHeight","12")
                            .attr("viewBox","0 0 12 12") 
                            .attr("refX","6")
                            .attr("refY","6")
                            .attr("orient","auto");

    var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

    arrowMarker.append("path")
                .attr("d",arrow_path)
                .attr("fill","#000");

    // var line = svg.append("line")
    //          .attr("x1",0)
    //          .attr("y1",0)
    //          .attr("x2",200)
    //          .attr("y2",50)
    //          .attr("stroke","red")
    //          .attr("stroke-width",2)
    //          .attr("marker-end","url(#arrow)");

    // var curve_path = "M20,70 T80,100 T160,80 T200,90";

    // var curve = svg.append("path")
    //              .attr("d",curve_path)
    //              .attr("fill","white")
    //              .attr("stroke","red")
    //              .attr("stroke-width",2)
    //              .attr("marker-start","url(#arrow)")
    //              .attr("marker-mid","url(#arrow)")
    //              .attr("marker-end","url(#arrow)");

    var svg_edges = svg.selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .style("stroke","#ccc")
        .style("stroke-width",1)
        .attr("marker-end","url(#arrow)");

    var color = d3.scale.category20();

    var svg_nodes = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r",20)
        .attr("class", "i-point")
        .style("fill",function(d,i){
            return color(i);
        })
        .on("click", function(d, i){
            showSettings(i);
            showInfo(i);
        })
        .call(drag);

    var svg_texts = svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .style("fill", "black")
        .attr("dx", 20)
        .attr("dy", 8)
        .text(function(d){
            return d.name;
        });

    force.on("tick", function(){ //对于每一个时间间隔
        //更新连线坐标
        svg_edges.attr("x1",function(d){ return d.source.x; })
            .attr("y1",function(d){ return d.source.y; })
            .attr("x2",function(d){ return d.target.x; })
            .attr("y2",function(d){ return d.target.y; });

        //更新节点坐标
        svg_nodes.attr("cx",function(d){ return d.x; })
            .attr("cy",function(d){ return d.y; });

        //更新文字坐标
        svg_texts.attr("x", function(d){ return d.x; })
           .attr("y", function(d){ return d.y; });
    });

    var showSettings = function(i){
        var $relatedPointsArea = $('#i-related-points');
        $relatedPointsArea.empty();
        $('#i-point').text(i);
        for(var m = 0; m < data.length; m ++){
            var tmpData = data[m];
            if(tmpData.order === i){
                for(var n = 0; n < tmpData.link.length; n ++){
                    var p = $('<p></p>');
                    p.text(tmpData.order+' -> '+tmpData.link[n]);
                    $relatedPointsArea.append(p);
                }
            }
        }
        $('.i-left-panel-settings').css('display', 'block');
    }
    var hideSettings = function(){
        $('.i-left-panel-settings').css('display', 'none');
    }

    var showInfo = function(i){
        var $infoPanel = $('<div></div>');
        $infoPanel.attr('class', 'i-right-canvas-info-panel')
                    .css('display', 'block');
        $('.i-right-canvas').append($infoPanel);
    }

    var hideInfo = function(){
        $('.i-right-canvas-info-panel').css('display', 'none');
    }

    $('body').on('click', function(e){
        if(e.target.className.baseVal !== 'i-point'){
            hideSettings();
            hideInfo();
        }
    });

})();