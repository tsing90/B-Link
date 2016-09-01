d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

function GETRANDOMINT(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var TITLECOLOR_CHANGE = function(){
      d3.select("div.header").select("h1").transition().duration(1000).style("color",function(){
      var r=GETRANDOMINT(0,255);
      var g=GETRANDOMINT(0,255);
      var b=GETRANDOMINT(0,255);
      return "rgb(" + [r, g, b].join(",") + ")";
  });
};


var w=window.innerWidth || document.body.clientWidth;
var h=window.innerHeight || document.body.clientHeight;
var maxlinkdistance=100;
var minlinkdistance=20;
var maxlinkwidth=5;
var minlinkwidth=1;
var maxNodeRadius=20;
var minNodeRadius=5;
var tran = d3.transition()
             .duration(5000)
             .ease(d3.easeLinear);

var HltNodesNumber=20;
var POSITIONFORCE_STRENGTH=0.8;
var N_SearchButton=3;
var Type_distance = 'Fw';
var N_ExploreFunctionpanel=20;
var HltPathColor = '#FF6800';
var NodeColor = '#3498DB';
var EdgeColor = '#aaa';

//add svg
SVG = d3.select('body').append('svg').attr('id',"Mainback").attr('width',w) .attr('height',h);
function SVG_change_size(){
    w=window.innerWidth || document.body.clientWidth;
    h=window.innerHeight || document.body.clientHeight;
    SVG.attr('width',w) .attr('height',h);
    BACKLAYER.attr("width", w).attr("height", h);
};
//add  main canvas
GRAPH = SVG.append("g")
           .attr("id","MainGraph");

BACKLAYER_Zoom = d3.zoom()
                   .scaleExtent([1/4,4])
                   .on("zoom",zoomed);
BACKLAYER = SVG.insert("rect",":first-child")
                  .attr("id","Backlayer")
                  .attr("width", w)
                  .attr("height", h)
                  .call(BACKLAYER_Zoom);

//set nodes and edges and simulation
CLIENT_NODES=[];
CLIENT_EDGES=[];
//define SIMULATION
SIMULATION = d3.forceSimulation()
               .force("link",d3.forceLink().id(function id(d){return d.wid;}).links(CLIENT_EDGES)) //add spring
               .force("charge", d3.forceManyBody().strength(-100)) //repel each other
               .force("center", d3.forceCenter(w / 2, h / 2)) // force to center
               .nodes(CLIENT_NODES);
// tick on
  TICK = function(){
      if( SIMULATION.alpha()>=0.49 ){
          SIMULATION.alphaTarget(0);
      };

      GRAPH.selectAll(".edge").attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      GRAPH.selectAll(".gnode").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      GRAPH.selectAll(".edgelabel").attr("x", function(d) { return (d.source.x+d.target.x)/2; })
      .attr("y", function(d) { return (d.source.y+d.target.y)/2; });
  };

  SIMULATION.on("tick",TICK);

// drag behavior

  function dragstarted(d) {
       if (!d3.event.active) SIMULATION.alphaTarget(0.3).restart();
       d.fx = d.x;
       d.fy = d.y;
  };

  function dragged(d) {
       d.fx = d3.event.x;
       d.fy = d3.event.y;
  };

  function dragended(d) {
       if (!d3.event.active) SIMULATION.alphaTarget(0);
       d.fx = null;
       d.fy = null;
  };
  function zoomed() {
  GRAPH.attr("transform", d3.event.transform);
}

// hide the left side info panel 
  function hideLeftPanel() {
	var elem = document.getElementById("left-panel");
        elem.classList.toggle("hide");
  };
