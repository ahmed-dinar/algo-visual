<template>
  <div class="graph-area container-fluid">
    <div class="row">
      <div class="col-3">
        <div class="tools-container">
          <div class="form-group">
            <input type="text"  v-model="sourceNode" placeholder="Source">
          </div>
          <div class="form-group">
            <input type="text"  v-model="destNode" placeholder="Destination">
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-outline-primary btn-sm" v-on:click="updateGrap">Update Edge</button>
          </div>
          <div class="form-group form-check isDirected">
            <input type="checkbox" v-model="isDirected" v-on:change="drawGraph()" class="form-check-input" id="isDirected">
            <label class="form-check-label" for="isDirected">Directed Edge</label>
          </div>
        </div>
      </div>
      <div class="col-9">
          <div id="graph-container"></div>
      </div>
    </div>
  </div>
</template>

<script>

import * as d3 from 'd3';
let graphData = require("../assets/data.json")

export default {
  name: 'Graph',
  data(){
    return {
      activeEdge: null,
      isDirected: false,
      linkDistance: 5,
      collideRadius: 100,
      width: 1000,
      height: 700,
      simulation: null,
      arrows: null,
      links: null,
      nodes: null,
      nodelabels: null,
      linklabels: null,
      sourceNode: "D",
      destNode: "E",
      svg: null,
      edges: [],
      graph: graphData
    }
  },
  methods: {
    pointOffset(d){
      let diffX = d.target.x - d.source.x;
      let diffY = d.target.y - d.source.y;

      let pathLength = Math.sqrt((diffX * diffX) + (diffY * diffY));

      let offsetX = (diffX * d.target.radius) / pathLength;
      let offsetY = (diffY * d.target.radius) / pathLength; 

      let offsetX2 = (diffX * d.source.radius) / pathLength;
      let offsetY2 = (diffY * d.source.radius) / pathLength;

      return [
        { x: d.source.x + offsetX2, y: d.source.y + offsetY2 },
        { x: d.target.x - offsetX, y: d.target.y - offsetY },
      ];
    },
    updateGrap(){
      let _this = this;

      if( !_this.sourceNode || !_this.destNode ){
        return;
      }

      let theEdge = _this.edges.filter(e => e.source.name === _this.sourceNode.trim() && e.target.name === _this.destNode.trim());

      if( !theEdge.length ){
        return;
      }
      theEdge = theEdge[0];

      d3.selectAll("#activeEdge").remove();
      _this.activeEdge = null;

      theEdge.distance = _this.pointDistance(theEdge);


      //https://jaketrent.com/post/animating-d3-line/
      _this.activeEdge = _this.svg.append('path')
          .datum(_this.pointOffset(theEdge))
          .attr("d", d3.line().x(d => d.x).y(d => d.y))
          .attr("id", "activeEdge")
          .attr("stroke", "red")
          .attr("stroke-width", 5)
          .attr("stroke-dasharray", theEdge.distance + ' ' + theEdge.distance)
          .attr("stroke-dashoffset", theEdge.distance)
          .transition()
          .duration(1500)
          .attr('stroke-dashoffset', 0)
          .on('end', () => {
            console.log('hola');
          });

      setTimeout(() => {
        d3.selectAll("#activeEdge").remove();
        _this.activeEdge = null;
      }, 5000);

     // this.drawGraph();
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
          .attr("class", "links")
          .attr("stroke-width", 2)
          
          .attr('stroke', d => (
              ((_this.sourceNode && _this.destNode)
                && (d.source.name === _this.sourceNode.trim() && d.target.name === _this.destNode.trim())) 
                ? '#ba1914' 
                : '#058e02'
          )).merge(_this.links)
          .attr("marker-end", d => "url(#marker" + d.id + ")");

      if( !_this.isDirected ){
        _this.links.attr("marker-end", null);
      }

      //arrows
      _this.arrows = _this.arrows.data(_this.edges);
      _this.arrows.exit().remove();
      _this.arrows = _this.arrows
            .enter().append("marker")
            .attr("class", "arrow")
            .attr("id", d => "marker" + d.id)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 7)
            .attr("refY", 0)
            .attr("markerWidth", 7)
            .attr("markerHeight", 7)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5 L7,0 L0,5")
            .style("stroke", "black")
            .style("fill", "black")
            .style("opacity", "1")
            .merge(_this.arrows);



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
        .on("tick", _this.onTick)
        .on("end", () => {
          console.log('tick end');
        });

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
    pointDistance(d){
      let diffX = d.target.x - d.source.x;
      let diffY = d.target.y - d.source.y;
      return Math.sqrt((diffX * diffX) + (diffY * diffY));
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
    },
    initiateGraph(){

      this.svg = d3.select("#graph-container")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("id", "graph-svg")
        .attr("margin", "0px auto");

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
    }
  },
  mounted(){
    this.loadEdges();
    this.initiateGraph();
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
}

#graph-container{
  border: 1px solid #ccc;
  margin: 0 auto;
  text-align: center;
}

.tools-container{
  width: 50%;
  margin: 0 auto;
  padding-top: 20px;
}

.isDirected .form-check-label{
  font-weight: bold;
}

</style>
