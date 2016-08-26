
var Search_Button=d3.select("input[name='search']");

// search button behavior
Search_Button.on("mouseover",function(){
  d3.select(this).style({"background-image": "url('/static/SearchButtonMouseOver.png')"})
});


Search_Button.on("mouseout",function(){
  d3.select(this)
  .style({"background-image": "url('/static/SearchButton.png')"})
});

//Search button click
Search_Button.on('click', Handle_Search_Button);

//input box enter
d3.select("input[name='keywords']").on('keydown',function(){
  if (d3.event.keyCode==13){
      Handle_Search_Button();
  };
});

//Search button handler
function Handle_Search_Button(){
  console.log("click search button");
  d3.json('/texttowid/'+get_inputtext(),function(error,data){
      //get current local nodes
      var currentnodes = CURRENT_NODESSET(CLIENT_NODES,"wid");
      //get query
      var query = data
      if(_.contains(currentnodes,query)){//existings, explore local
          var subparameters = {'ipt':query,'tp':Type_distance,'minhops':1,'localnodes':currentnodes};
          var parameters = {'N':N_SearchButton,'parameters':subparameters,'generator':'get_Rel_one','start':true};
          var info={'explorelocal':true,'localnodes':null,'parameters':parameters};
          console.log(info);
          d3.json('/explore/'+JSON.stringify(info),function(error,data){
              assert(data.AddNew==false, 'why need to add new nodes when exploring local graph?');
              var highlights={'nodes':[query],'paths':data.paths};
              highlight_nodespaths(highlights);
              ZoomToNodes([query]);
          });
      }else{//not existing, explore whole
          var subparameters = {'ipt':query,'tp':Type_distance,'minhops':1,'localnodes':null};
          var parameters = {'N':N_SearchButton,'parameters':subparameters,'generator':'get_Rel_one','start':true};
          var info={'explorelocal':false,'localnodes':currentnodes,'parameters':parameters};
          console.log(info);
          d3.json('/explore/'+JSON.stringify(info),function(error,data){
              assert(data.AddNew==true, 'why not add new nodes when queries not in local graph?');
              var bornplace = {x:w/2, y:h/2, vx:NaN, vy: NaN};
              SHOW_UPDATE_FORCE(data,bornplace);
              node_left_click_on();
              var highlights={'nodes':[query],'paths':data.paths};
              highlight_nodespaths(highlights);
              ZoomToNodes([query]);
          });
      };
  });
};

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
      var currentnodes = CURRENT_NODESSET(CLIENT_NODES,"wid");
      var clicked = d.wid;
      var subparameters = {'ipt':d.wid,'tp':Type_distance,'minhops':1,'localnodes':currentnodes};
      var parameters = {'N':N_SearchButton,'parameters':subparameters,'generator':'get_Rel_one','start':true};
      var info={'explorelocal':true,'localnodes':null,'parameters':parameters};
      d3.json('/explore/'+JSON.stringify(info),function(error,data){
          var highlights = {'nodes':[clicked],'paths':data.paths};
          highlight_nodespaths(highlights);
      });
      //update inputbox
      d3.select('input[name="keywords"]').node().value = d.label;
   });
};

// Backlayer background click on
function Backlayer_clickon(){
    BACKLAYER.on('click',function(){
        console.log("click Backlayer");
        RedoBack();
    });
};



