<template>
  <div class="graph-area">
    <div class="inputs">
      <input type="text"  v-model="sourceNode" placeholder="Source">
      <input type="text"  v-model="destNode" placeholder="Destination">
      <button type="button" class="btn btn-outline-primary btn-sm" v-on:click="updateGrap">Update Edge</button>
    </div>
    <div id="graph-container"></div>
  </div>
</template>

<script>

import * as d3 from 'd3';

export default {
  name: 'DirectedGraph',
  data(){
    return {
      color: d3.scaleOrdinal(d3.schemeCategory20),
      width: 960,
      height: 500,
      simulation: null,
      links: null,
      nodes: null,
      nodelabels: null,
      linklabels: null,
      sourceNode: null,
      destNode: null,
      svg: null,
      edges: [],
      graph: {
        nodes: [
          {name: "ECB"},
          {name: "MES"},
          {name: "MOHAKHALI" },
          {name: "DHANMONDI"},
          {name: "MIRPUR-10" }
        ],
        links: [
          {source: "ECB", target: "MES", value: "6.6 km"},
          {source: "MES", target: "MOHAKHALI", value: "11 km"},
          {source: "DHANMONDI", target: "MOHAKHALI", value: "8.6 km"},
          {source: "DHANMONDI", target: "MIRPUR-10", value: "12 km"},
          {source: "ECB", target: "MIRPUR-10", value: "4.7 km"}
        ]
      }
    }
  },
  computed: {

  },
  methods: {
    updateGrap(){
      console.log('updating');
      this.drawGraph();
    },
    drawGraph(){

      console.log('updating 2');

      let _this = this;

      //update links
      _this.links = _this.links.data(_this.edges);
      _this.links.exit().remove();
      _this.links = _this.links
          .enter().append("line")
          .merge(_this.links)
          .attr("stroke-width", 2)
          .attr('stroke', function(d){
            return ( (_this.sourceNode && _this.destNode)
              && (d.source.name === _this.sourceNode.trim() && d.target.name === _this.destNode.trim())) 
              ? '#ba1914' 
              : '#058e02';
          })
          

      //update nodes
      _this.nodes = _this.nodes.data(_this.graph.nodes, function(d){return d.name; });
      _this.nodes.exit().remove();
      _this.nodes = _this.nodes
            .enter().append("circle")
            .attr("r", 15)
            .attr("fill", function(d, i) { return _this.color(i); })
            .merge(_this.nodes)
            .call(
              d3.drag()
                .on('start', function(d) {

                  if (!d3.event.active)
                    _this.simulation.alphaTarget(0.3).restart();

                  d.fx = d.x;
                  d.fy = d.y;
                })
                .on('drag', function(d) {
                  d.fx = d3.event.x;
                  d.fy = d3.event.y;
                })
                .on('end', function(d) {
                  if (!d3.event.active) 
                    _this.simulation.alphaTarget(0);
                        
                  d.fx = null;
                  d.fy = null;
                })
            );


      _this.nodelabels = _this.nodelabels.data(_this.graph.nodes, function(d){return d.name; });
      _this.nodelabels.exit().remove();
      _this.nodelabels = _this.nodelabels
         .enter().append("text")
         .merge(_this.nodelabels)
         .attr("x", function(d){ return d.x; })
         .attr("y", function(d){ return d.y; })
         .attr("class", "nodelabel")
         .attr("stroke", "black")
         .text(function(d){return d.name;});


      _this.linklabels = _this.linklabels.data(_this.edges);
      _this.linklabels.exit().remove();
      _this.linklabels = _this.linklabels
                    .enter().append("text")
                    .merge(_this.linklabels)
                    .attr("font-size","14px")
                    .attr("stroke", "black")
                    .text( function(d) {  return d.value; });


      _this.simulation
        .nodes(_this.graph.nodes)
        .on("tick", function(){
          console.log('ticked');
          _this.links
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

          _this.nodes
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });

          _this.nodelabels
              .attr("x", function(d) { return d.x; }) 
              .attr("y", function(d) { return d.y; });

          _this.linklabels
              .attr("x", function(d) { return (d.source.x + d.target.x)/2; })
              .attr("y", function(d) { return (d.source.y + d.target.y)/2; });

      });

      _this.simulation
        .force("link")
        .links(_this.edges);
    },
    loadEdges(){

      let _this = this;

      _this.graph.links.forEach(function(element, index){
      
        let sourceNode = _this.graph.nodes.filter(function(n) {
            return n.name === element.source;
        })[0];
        
        let targetNode = _this.graph.nodes.filter(function(n) {
            return n.name === element.target;
        })[0];

        _this.edges.push({
          source: sourceNode,
          target: targetNode,
          value: element.value
        });
      });
    }
  },
  mounted(){

    this.loadEdges();

    this.svg = d3.select("#graph-container").append("svg").attr("width", "100%").attr("height", "100%");
    this.links = this.svg.append("g").selectAll(".links"),
    this.nodes = this.svg.append("g").selectAll(".nodes");
    this.nodelabels = this.svg.selectAll(".nodelabel");
    this.linklabels = this.svg.append("g").selectAll(".link-label");
    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().distance(15).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-400).theta(0)) 
        .force("collide", d3.forceCollide().radius(100))
        .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    this.drawGraph();
  }
}
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}


.graph-area{
  border: 1px solid #ccc;
  margin: 0;
  padding: 0;
  position: relative;
}

#graph-container{
  border: 1px solid #ccc;
  width: 960px;
  height: 500px;
  margin: 0 auto;
}

.inputs{
  margin: 5px 10px;
}

</style>
