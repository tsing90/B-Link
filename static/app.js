
var Search_Button=d3.select("input[name='search']");

// search button behavior
Search_Button.on("mouseover",function(){
  d3.select(this).style({"background-image": "url('/static/SearchButtonMouseOver.png')"})
});


Search_Button.on("mouseout",function(){
  d3.select(this)
  .style({"background-image": "url('/static/SearchButton.png')"})
});


Search_Button.on('click',function(){
  console.log("click search button");
  d3.json('/texttowid/'+get_inputtext(),function(error,data){
      //change view to all nodes
      console.log("adjust view to the query nodes");
      //get current nodes
      var currentnodes = CURRENT_NODESSET(CLIENT_NODES,"wid");
      //find new nodes
      var newnodes = _.difference(data, currentnodes);

      if(newnodes.length!=0){
          var serverinfo ={existing_nodes:currentnodes,queries: newnodes, N:N_SearchButton};
          console.log(serverinfo);
          d3.json('/gdata/'+JSON.stringify(serverinfo),function(error,data){
                console.log(" finish Got data from server");
                mydata=data;
                console.log(data);
                SHOW_UPDATE_FORCE(data, false);
                console.log("finish build force");
                node_right_click_on();
                node_left_click_on();
                console.log("finishe add event listeners");
          });
      };
  });
});

// node click behavior
function node_right_click_on(){
   d3.select("#maincanvas").selectAll('.gnode').on('contextmenu',function(d){
      d3.event.preventDefault();
      console.log("click node");
      console.log(d.label);
      d3.json('/neighbor_level/'+d.wid,function(error,data){
          console.log(JSON.stringify(data));
          circle_layout_neighbor(data);
          Backlayer_clickon();
      });
   });
};

// node left click behavior
function node_left_click_on(){
   d3.select("#maincanvas").selectAll('.gnode').on('click',function(d){
      d3.json('/wordrank/'+d.wid,function(error,data){
          console.log(JSON.stringify(data));
          highlight_wordrank(data);
          Backlayer_clickon();
      });
   });
};

// Backlayer background click on
function Backlayer_clickon(){
    BACKLAYER.on('click',function(){
        console.log("click Backlayer");
        RedoBack();
    });
};


