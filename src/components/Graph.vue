<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2 tools">
        <div class="tools-container">
          <div class="form-group">
            <input type="text"  v-model="sourceNode" placeholder="Source">
          </div>
          <div class="form-group">
            <input type="text"  v-model="destNode" placeholder="Destination">
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-outline-primary btn-sm" v-on:click="traverseGrap">GO!</button>
          </div>


          <div class="tool-options">


            <toggle-button
            :labels="{checked: 'ZOOM', unchecked: 'ZOOM'}"
            :color="{checked: '#1c67bc', unchecked: '#82868c'}"
            :width="63"
            @change="toggleZoom"
            v-model="isZoom"/><br>

            

            <toggle-button
            :labels="{checked: 'EDIT', unchecked: 'EDIT'}"
            :color="{checked: '#1c67bc', unchecked: '#82868c'}"
            :width="63"
            @change="editableChange"
            v-model="editable"/>
            <transition
              :duration="500"
              name="custom-classes-transition"
              enter-active-class="animated bounceIn"
              leave-active-class="animated bounceOut"
            >
              <div class="edit-tools" v-if="editable">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" v-model="isAddNode" class="custom-control-input" id="isAddNode">
                  <label class="custom-control-label" for="isAddNode">Add Node</label>
                </div>
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" v-model="isAddEdge" v-on:change="addEdgeChange()" class="custom-control-input" id="isAddEdge">
                  <label class="custom-control-label" for="isAddEdge">Add Edge</label>
                </div>
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" v-model="isDirected" v-on:change="drawGraph()" class="custom-control-input" id="isDirected">
                  <label class="custom-control-label" for="isDirected">Directed Graph</label>
                </div>
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" v-model="isLinkLabel" v-on:change="drawGraph()" class="custom-control-input" id="isLinkLabel">
                  <label class="custom-control-label" for="isLinkLabel">Edge Label</label>
                </div>
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" v-model="isVertexLabel" v-on:change="drawGraph()" class="custom-control-input" id="isVertexLabel">
                  <label class="custom-control-label" for="isVertexLabel">Node Label</label>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="col-10">
          <div id="graph-container"></div>
      </div>
    </div>
  </div>
</template>

<script>

import * as d3 from 'd3';
import { alphabet } from '../assets/helpers';
let graphData = require("../assets/data.json")

export default {
  name: 'Graph',
  data(){
    return {
      isZoom: false,
      isAddEdge: false,
      isAddNode: false,
      isVertexLabel: false,
      isLinkLabel: true,
      editable: false,
      selectedEdge: null,
      selectedNode: null,
      selectedTargetNode: null,
      activeEdge: null,
      isDirected: false,
      linkDistance: 5,
      collideRadius: 70,
      width: 1000,
      height: 560,
      simulation: null,
      links: null,
      nodes: null,
      nodelabels: null,
      linklabels: null,
      vertexlabels: null,
      sourceNode: "D",
      destNode: "E",
      svg: null,
      edges: [],
      edgeLabels: [],
      graph: graphData
    }
  },
  methods: {
    toggleZoom(){
      this.initiateGraph();
      this.drawGraph();
    },
    toggleLinkLabel(){
      if( this.isLinkLabel ){
        this.loadEdgeLabels();
      }
      else{
        this.edgeLabels = [];
      }
      this.drawGraph();
    },
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
    traverseGrap(){
      let _this = this;

      if( !_this.sourceNode || !_this.destNode ){
        return;
      }

      let theEdge = _this.edges.filter(e => e.source.name === _this.sourceNode.trim() && e.target.name === _this.destNode.trim());


      if( !theEdge.length ){
        this.$noty.error(`No edge found from ${_this.sourceNode} to ${_this.destNode}`, { timeout: 5000 });
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
    editableChange(){
      if(!this.editable){
        this.isAddNode = false;
        this.selectedEdge = null;
        this.selectedNode = null;
        this.drawGraph();
      }
    },
    addEdgeChange(){
      if(!this.isAddEdge){
        this.selectedNode = null;
        this.destNode = null;
        this.drawGraph();
      }
    },
    linkMousedown(d){
      console.log('linkMousedown');
      let _this = this;

      if( !this.editable ) return;

      if( !this.selectedEdge ){
        this.selectedEdge = d;
      }
      else{
        this.selectedEdge = null;
      }

      this.drawGraph();
    },
    nodeMousedown(d){

      let _this = this;

      if( !this.editable || !this.isAddEdge ) return;

      if( !this.selectedNode ){
        this.selectedNode = d;
        this.drawGraph();
        return;
      }

      //if same node, deselect
      if( this.selectedNode.name == d.name ){
        console.log('same node');
        this.selectedNode = null;
        this.drawGraph();
        return;
      }

      if( this.edges.filter(link => _this.isSameEdge(link, { source: this.selectedNode, target: d }) ).length ){
        this.$noty.warning("Can't create more that one edge", { timeout: 0 });
        return;
      }
      
      this.edges.push({
        source: this.selectedNode,
        target: d,
        value: "0",
        id: this.edges.length + 1
      });

      this.loadEdgeLabels(true);
      
      this.selectedNode = null;
      this.drawGraph(true);
    },
    isSameEdge(a, b){
      return (a.source.name === b.source.name && a.target.name === b.target.name) ||
      (a.source.name === b.target.name && a.target.name === b.source.name);
    },
    drawGraph(makeTick){

      let _this = this;

      //update nodes
      _this.nodes = _this.nodes.data(_this.graph.nodes, d => d.name);
      _this.nodes.exit().remove();
      _this.nodes = _this.nodes
            .enter().append("circle")
            .attr("class", "nodes")
            .attr("r", d => d.radius)
            .attr("title", d => d.name)
            .attr("fill", 'black')
            .attr("stroke-width", 2)
            .merge(_this.nodes)
            .on("mousedown", _this.nodeMousedown)
            .call(d3.drag()
                .on('start', function(d) {
                  if (!d3.event.active)
                    _this.simulation.alphaTarget(0.9).restart();

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
                        
                  //d.fx = null;
                  //d.fy = null;
                }));

      _this.nodes.attr("stroke", function(d) {
        return _this.selectedNode && _this.selectedNode.name == d.name ? "red" : "none";
      });


      //update links
      _this.links = _this.links.data(_this.edges);
      _this.links.exit().remove();
      _this.links = _this.links
          .enter().append("path")
          .attr("class", "links")
          .attr("stroke-width", 3)
          .merge(_this.links)
          .attr("id", (d,i) => `link-${i}`)
          .attr("marker-end", "url(#markerArrow")
          .on("mousedown", _this.linkMousedown);

      if( !_this.isDirected ){
        _this.links.attr("marker-end", null);
      }

      _this.links.attr("stroke", function(d) {
        console.log('_this.selectedEdge');
        console.log(_this.selectedEdge);
        return (_this.selectedEdge && _this.isSameEdge(_this.selectedEdge, d))  ? 'red' : 'black';
      });


      _this.nodelabels = _this.nodelabels.data(_this.graph.nodes, d => d.name);
      _this.nodelabels.exit().remove();
      _this.nodelabels = _this.nodelabels
         .enter().append("text")
         .merge(_this.nodelabels)
         .attr("class", "node-label")
         .attr("text-anchor", "middle")
         .attr("stroke", "white")
         .text(d => d.name);

      _this.vertexlabels = _this.vertexlabels.data(!_this.isVertexLabel ? [] : _this.graph.nodes, d => d.name);
      _this.vertexlabels.exit().remove();
      _this.vertexlabels = _this.vertexlabels
         .enter().append("text")
         .merge(_this.vertexlabels)
         .attr("class", "vertex-label")
         .attr("font-size","14px")
         .attr("text-anchor", "middle")
         .attr("stroke", "black")
         .text(d => "Vertex - " + d.name);


      //edge labels
      _this.linklabels = _this.linklabels.data(_this.isLinkLabel ? _this.edgeLabels : []);
      _this.linklabels.exit().remove();
      _this.linklabels = _this.linklabels
                    .enter().append("text")
                    .style("pointer-events", "none")
                    .attr("class", "link-label");
                    
      _this.linklabels.append('textPath')
        .attr('xlink:href',(d,i) => `#link-${i}`)
        .attr("startOffset", "50%")
        .style("pointer-events", "none")
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


      if(makeTick){
        _this.simulation.alpha(0.1).restart();
      }else{
        _this.simulation.restart();
      }

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

      _this.vertexlabels
          .attr("x", d => d.x) 
          .attr("y", d => d.y - d.radius - 3);

      //http://bl.ocks.org/jhb/5955887
      _this.linklabels.attr('transform', function(d){
          if (d.target.x < d.source.x){
            let bbox = this.getBBox();
            let rx = bbox.x+bbox.width/2;
            let ry = bbox.y+bbox.height/2;
            return `rotate(180 ${rx} ${ry})`;
          }
          return `rotate(0)`;
      }).attr("dy", -5);
  
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
    loadEdgeLabels(update){
      let _this = this;
      if(update){
        _this.edgeLabels = [];
      }
      _this.edges.forEach(function(edge){
        _this.edgeLabels.push(edge);
      });
    },
    initiateGraph(){

     this.svg = d3.select("#graph-container");
     this.svg.selectAll("*").remove();

     this.svg = this.svg
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("id", "graph-svg")
        .attr("margin", "0px auto");
        
    if( this.isZoom ){
      this.svg = this.svg.call(d3.zoom().on("zoom", () => {
        this.svg.attr("transform", d3.event.transform);
      }));
    }
    this.svg = this.svg.append("g");


      this.svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr('fill', 'white')
        .on("mousedown", this.mousedown);

      this.svg
            .append('defs')
            .append("marker")
            .attr("class", "arrow")
            .attr("id", "markerArrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5 L5,0 L0,5")
            .style("stroke", "black")
            .style("fill", "black")
            .style("opacity", "1");

      this.nodes = this.svg.append("g").selectAll(".nodes");
      this.links = this.svg.append("g").selectAll(".links");
      this.nodelabels = this.svg.append("g").selectAll(".node-label");
      this.vertexlabels = this.svg.append("g").selectAll(".vertex-label");
      this.linklabels = this.svg.append("g").selectAll(".link-label");

      
      this.simulation = d3.forceSimulation()
          .force("link", d3.forceLink().distance(this.linkDistance).id(d => d.id))
          .force('charge', d3.forceManyBody().strength(100).theta(0)) 
          .force("collide", d3.forceCollide().radius(this.collideRadius))
          .force("center", d3.forceCenter(this.width / 2, this.height / 2));

      d3.select(window)
        .on("keydown", this.keydown);
      
    },
    mousedown(){

      if( !this.editable || !this.isAddNode ) return;

      this.selectedEdge = null;
      this.selectedNode = null;
      let len = this.graph.nodes.length;

      if( len >= 15 ){
        this.$noty.warning("Can't create more that 15 nodes", { timeout: 0 });
        return;
      }

      let m = d3.mouse(this.svg.node());
      

      this.graph.nodes.push({
        "name": len > 0 ? alphabet[alphabet.indexOf(this.graph.nodes[len-1].name)+1] : alphabet[0],
        "radius": 18,
        "x": m[0],
        "y": m[1]
      });
      this.drawGraph();
    },
    keydown(){
      if(!this.editable) return;

      switch (d3.event.keyCode) {
        // backspace
        case 8: 
        // delete
        case 46: {
          if (this.selectedNode) {

            this.graph.nodes.splice(this.graph.nodes.indexOf(this.selectedNode), 1);

            this.edges = this.edges.filter(d => d.source.name !== this.selectedNode.name && d.target.name !== this.selectedNode.name);

            this.loadEdgeLabels(true);

            this.selectedNode = null;
            this.drawGraph();
          } 
          else if (this.selectedEdge) {
            this.edges = this.edges.filter(d => !(d.source.name === this.selectedEdge.source.name && d.target.name === this.selectedEdge.target.name));

            this.loadEdgeLabels(true);

            this.selectedEdge = null;
            this.drawGraph();
          }
          break;
        }
      }
    }
  },
  mounted(){
    this.loadEdges();
    this.loadEdgeLabels();
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

.tools-container{
  width: 80%;
  margin: 0 auto;
  padding-top: 15px;
  margin-left: 5px;
}

.tools{
  border-right: 1px solid #ccc;
}

.edit-tools{
  padding-left: 10px;
}

.tool-options .custom-control-label{
/*   font-weight: 600; */
}




</style>
