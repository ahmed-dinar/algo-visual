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
      linkDistance: 15,
      collideRadius: 100,
      width: 960,
      height: 500,
      simulation: null,
      arrows: null,
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
          {name: "A", radius: 30},
          {name: "B", radius: 20},
          {name: "C", radius: 25},
          {name: "D", radius: 30},
          {name: "E", radius: 30}
        ],
        links: [
          {source: "A", target: "B", value: "6.6km"},
          {source: "B", target: "C", value: "11km"},
          {source: "D", target: "C", value: "8.6 km"},
          {source: "D", target: "E", value: "12 km"},
          {source: "A", target: "E", value: "4.7 km"}
        ]
      }
    }
  },
  methods: {
    updateGrap(){
      this.drawGraph();
    },
    drawGraph(){

      let _this = this;

      //update nodes
      _this.nodes = _this.nodes.data(_this.graph.nodes, d => d.name);
      _this.nodes.exit().remove();
      _this.nodes = _this.nodes
            .enter().append("circle")
            .attr("class", "nodes")
            .attr("r", d => d.radius)
            .attr("fill", '#2a5eb2')
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


      //update links
      _this.links = _this.links.data(_this.edges);
      _this.links.exit().remove();
      _this.links = _this.links
          .enter().append("path")
          .merge(_this.links)
          .attr("class", "links")
          .attr("stroke-width", 2)
          .attr('stroke', d => (
              ((_this.sourceNode && _this.destNode)
                && (d.source.name === _this.sourceNode.trim() && d.target.name === _this.destNode.trim())) 
                ? '#ba1914' 
                : '#058e02'
          ))
          .attr("marker-end", d => "url(#marker" + d.id + ")"); //arrow



      _this.arrows = _this.arrows.data(_this.edges);
      _this.arrows.exit().remove();
      _this.arrows = _this.arrows
          .enter().append("marker")
          .merge(_this.arrows)
          .attr("class", "arrow")
          .attr("id", d => "marker" + d.id)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 10)
          .attr("refY", 0)
          .attr("markerWidth", 10)
          .attr("markerHeight", 10)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M0,-5 L10,0 L0,5")
          .style("stroke", "black")
          .style("fill", "black")
          .style("opacity", "1");



      _this.nodelabels = _this.nodelabels.data(_this.graph.nodes, d => d.name);
      _this.nodelabels.exit().remove();
      _this.nodelabels = _this.nodelabels
         .enter().append("text")
         .merge(_this.nodelabels)
         .attr("class", "node-label")
         .attr("font-size","22px")
         .attr("textLength", d => _this.graph.nodes.filter(n => n.name === d.name)[0].radius * 2)
         .attr("text-anchor", "middle")
         .attr("letter-spacing", "1px")
         .attr("stroke", "#fff")
         .text(d => d.name);

      _this.linklabels = _this.linklabels.data(_this.edges);
      _this.linklabels.exit().remove();
      _this.linklabels = _this.linklabels
                    .enter().append("text")
                    .merge(_this.linklabels)
                    .attr("font-size","14px")
                    .attr("stroke", "black")
                    .text(d => d.value);

      _this.simulation
        .nodes(_this.graph.nodes)
        .on("tick", _this.onTick);

      _this.simulation
        .force("link")
        .links(_this.edges);
    },
    onTick(){

      let _this = this;

      _this.nodes
          .attr("cx", d=> d.x)
          .attr("cy", d=> d.y);

      
      _this.links.attr("d", _this.getArrowOffset);
      
      _this.nodelabels
          .attr("x", d => d.x) 
          .attr("y", d=> d.y + 5);

      _this.linklabels
          .attr("x", d => (d.source.x + d.target.x)/2)
          .attr("y", d => (d.source.y + d.target.y)/2);
    },
    //https://stackoverflow.com/a/16754080
    getArrowOffset(d){
      let diffX = d.target.x - d.source.x;
      let diffY = d.target.y - d.source.y;

      let pathLength = Math.sqrt((diffX * diffX) + (diffY * diffY));

      let offsetX = (diffX * d.target.radius) / pathLength;
      let offsetY = (diffY * d.target.radius) / pathLength;

      return "M" + d.source.x + "," + d.source.y + "L" + (d.target.x - offsetX) + "," + (d.target.y - offsetY);
    },
    loadEdges(){

      let _this = this;

      _this.graph.links.forEach(function(edge, indx){
        _this.edges.push({
          source: _this.graph.nodes.filter(n => n.name === edge.source)[0],
          target: _this.graph.nodes.filter(n => n.name === edge.target)[0],
          value: edge.value,
          id: indx + 5
        });
      });
    }
  },
  mounted(){

    this.loadEdges();

    this.svg = d3.select("#graph-container").append("svg").attr("width", "100%").attr("height", "100%");

    this.arrows = this.svg.append("defs").selectAll(".arrow");
    this.links = this.svg.append("g").selectAll(".links");
    this.nodes = this.svg.append("g").selectAll(".nodes");
    this.nodelabels = this.svg.append("g").selectAll(".node-label");
    this.linklabels = this.svg.append("g").selectAll(".link-label");
    
    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().distance(this.linkDistance).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-400).theta(0)) 
        .force("collide", d3.forceCollide().radius(this.collideRadius))
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
