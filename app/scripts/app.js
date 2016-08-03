// var app = angular.module('app', [
//         'ngResource',
//         'ui.router'
//     ]);

(function(){
    var width = 1000, height = 600;

    var $leftPanelSettings = $('.i-left-panel-settings');

    // var data = [
    //     {
    //         name: 'A',
    //         order: 0,
    //         link: [4, 7, 9]
    //     },{
    //         name: 'B',
    //         order: 1,
    //         link: [0]
    //     },{
    //         name: 'C',
    //         order: 2,
    //         link: [1]
    //     },{
    //         name: 'D',
    //         order: 3,
    //         link: [2]
    //     },{
    //         name: 'E',
    //         order: 4,
    //         link: [3]
    //     },{
    //         name: 'F',
    //         order: 5,
    //         link: [1, 2]
    //     },{
    //         name: 'G',
    //         order: 6,
    //         link: [5]
    //     },{
    //         name: 'H',
    //         order: 7,
    //         link: [6, 0]
    //     },{
    //         name: 'I',
    //         order: 8,
    //         link: [0]
    //     },{
    //         name: 'J',
    //         order: 9,
    //         link: [10]
    //     },{
    //         name: 'K',
    //         order: 10,
    //         link: [4]
    //     }
    // ];
    var nodes = [], edges = [];

    var data = [{
            name: "A",
            order: 0,
            link: [1]
        },{
            name: "B",
            order: 1,
            link: [2]
        },{
            name: "C",
            order: 2,
            link: [3]
        },{
            name: "D",
            order: 3,
            link: [4]
        },{
            name: "E",
            order: 4,
            link: [5]
        },{
            name: "F",
            order: 5,
            link: [6]
        },{
            name: "G",
            order: 6,
            link: [7]
        },{
            name: "H",
            order: 7,
            link: [8]
        },{
            name: "I",
            order: 8,
            link: [9]
        },{
            name: "J",
            order: 9,
            link: [0]
        }
    ];

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

    var svg = d3.select(".i-show-canvas").append("svg")
        .attr("width", width)
        .attr("height", height);


    var force = d3.layout.force()
        .nodes(nodes)
        .links(edges)
        .size([width,height])
        .linkDistance(400)
        .linkStrength(0)
        .charge(-1000)
        .chargeDistance(500)
        .friction(0.8);

    nodes.forEach(function(d, i){
        if(i !== 0){
            d.x = width/(nodes.length)*(i+1);
            d.y = width/(nodes.length)*(i+.3);
        }
        else{
            d.x = width/2;
            d.y = height/2;
            d.fixed = true;
        }
    });

    var drag = force.drag()
        .on("dragstart", function(d, i){
            d.fixed = true;
        });
        // .on("dragend", function(d, i){
        //     d.fixed = false;
        // });

    force.start();


    setTimeout(function(){
        nodes.forEach(function(d, i){
            d.fixed = false;
        });
    },2000);
    // var defs = svg.append("defs");

    // var arrowMarker = defs.append("marker")
    //                         .attr("id","arrow")
    //                         .attr("markerUnits","strokeWidth")
    //                         .attr("markerWidth","12")
    //                         .attr("markerHeight","12")
    //                         .attr("viewBox","0 0 12 12")
    //                         .attr("refX","6")
    //                         .attr("refY","6")
    //                         .attr("orient","auto");

    // var arrow_path = "M10,1 L1,6, L10,11 L8,6 L10, 1";

    // arrowMarker.append("path")
    //             .attr("d",arrow_path)
    //             .attr("fill","#000");

    function drawLineArrow(x1,y1,x2,y2){
        var path;
        var slopy,cosy,siny;
        var Par=10.0;
        var x3,y3;
        slopy=Math.atan2((y1-y2),(x1-x2));
        cosy=Math.cos(slopy);
        siny=Math.sin(slopy);

        path="M"+x1+","+y1+" L"+x2+","+y2;

        x3=(Number(x1)+Number(x2))/2;
        y3=(Number(y1)+Number(y2))/2;

        path +=" M"+x3+","+y3;

        path +=" L"+(Number(x3)+Number(Par*cosy-(Par/2.0*siny)))+","+(Number(y3)+Number(Par*siny+(Par/2.0*cosy)));  

        path +=" M"+(Number(x3)+Number(Par*cosy+Par/2.0*siny)+","+ (Number(y3)-Number(Par/2.0*cosy-Par*siny)));  
        path +=" L"+x3+","+y3;


        return path;
    }

    var svg_edges = svg.selectAll("path")
        .data(edges)
        .enter()
        .append("path")
        .attr("d", function(d, i){
            return drawLineArrow(d.source.x, d.source.y, d.target.x, d.target.y);
        })
        .style("stroke","#000")
        .style("stroke-width",2);

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
        // svg_edges.attr("x1",function(d){ return d.source.x; })
        //     .attr("y1",function(d){ return d.source.y; })
        //     .attr("x2",function(d){ return d.target.x; })
        //     .attr("y2",function(d){ return d.target.y; });
        svg_edges.attr("d", function(d){
            return drawLineArrow(d.source.x, d.source.y, d.target.x, d.target.y);
        });
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