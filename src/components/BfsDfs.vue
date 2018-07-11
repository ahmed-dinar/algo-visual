<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2 tools">
<!--         <div class="tools-container">
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
</div> -->
      </div>
      <div class="col-10">
          <div id="graph-container">
            <svg :width="width" :height="height" id="graph-svg" margin="0px auto">
              <g>
                <rect :width="width" :height="height" fill="white"></rect>
                <defs>
                  <marker class="arrow" id="markerArrow" viewBox="0 -5 10 10" refX="5" refY="0" markerWidth="5" markerHeight="5" orient="auto">
                    <path d="M0,-5 L5,0 L0,5" style="stroke: black; fill: black; opacity: 1;"></path>
                  </marker>
                </defs>
                <g v-if="nodes">
                  <circle v-for="(node,key) in nodes"
                  :key="node.id || key"
                  :r="node.radius || options.radius"
                  :title="node.title || node.name"
                  :fill="node.color || options.nodeColor"
                  :stroke-width="options.nodeStrokeWidth"
                  :stroke="node.stroke || options.nodeStroke"
                  style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"
                  :cx="node.x"
                  :cy="node.y"
                  class="nodes"></circle>
                </g>
                <g v-if="nodes">
                  <text v-for="(node,key) in nodes"
                  :key="node.id || key"
                  :stroke="options.nodeLabelStroke || 'white'"
                  :x="node.x"
                  :y="node.y + 5"
                  class="node-label" text-anchor="middle" >{{ node.name }}</text>
                </g>
                <g v-if="nodes">
                  <text v-for="(node,key) in nodes"
                  :key="node.id || key"
                  :stroke="options.vertexLabelStroke || 'black'"
                  :x="node.x"
                  :y="node.y - node.radius - 3"
                  :font-size="options.labelFontSize || '14px'"
                  class="vertex-label"  text-anchor="middle" >{{ getVertexLabel(node) }}</text>
                </g>
                <g v-if="links">
                  <path v-for="(link, key) in links"
                  :key="link.id || key"
                  :stroke-width="options.linkStrokeWidth"
                  :stroke="link.stroke || options.linkStroke"
                  :d="getArrowOffset(link)"
                  class="links"></path>
                </g>
                <g v-if="links">
                  <text v-for="(link, key) in links"
                  :key="link.id || key"
                  :font-size="options.labelFontSize || '14px'"
                  :stroke="options.linkLabelStroke || 'black'"
                  :x="(link.source.x + link.target.x)/2"
                  :y="(link.source.y + link.target.y)/2">{{ link.value }}</text>
                </g>
              </g>
            </svg>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as d3 from 'd3';
import has from 'has';
import { alphabet } from '../assets/helpers';
let graphData = require("../assets/data.json");

export default {
  name: 'BfsDfs',
  data(){
    return {
      options: {
        radius: 18,
        nodeColor: '#000000',
        nodeStrokeWidth: 2,
        nodeLabelStroke: '#ffffff',
        vertexLabelStroke: '#000000',
        labelFontSize: '13px',
        linkStrokeWidth: 2,
        linkStroke: '#000000',
        linkLabelStroke: '#000000',
      },
      width: 1000,
      height: 600,
      dragme: false,
      dragx: {
        x: 0,
        y: 0
      },
      force: {
        linkDistance: 5,
        charge: 100,
        collide: 80
      },
      simulation: null,
      links: [],
      nodes: []
    }
  },
  methods: {
     getArrowOffset(d){

      let diffX = d.target.x - d.source.x;
      let diffY = d.target.y - d.source.y;
      let pathLength = Math.sqrt((diffX * diffX) + (diffY * diffY));

      if( pathLength === 0 ){
        return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
      }

      let offsetX = (diffX * d.target.radius) / pathLength;
      let offsetY = (diffY * d.target.radius) / pathLength;
      return "M" + d.source.x + "," + d.source.y + "L" + (d.target.x - offsetX) + "," + (d.target.y - offsetY);
    },
    getVertexLabel(node){
      return `Vertex-${node.name}`;
    },
    buildNodes(){
      this.nodes = graphData.nodes.map((node, index) => {

        if(!has(node,'id') || !node.id) node.id = `node-${index}`;
        if(!has(node,'x') || !node.x) node.x = 5;
        if(!has(node,'y') || !node.y) node.y = 5;
      
        return node;
      });
      console.log('build node done');
      console.log(this.nodes);
    },
    buildLinks(){

       this.links = graphData.links.map((link, index) => {

        if(!has(link,'id') || !link.id)
          link.id = `link-${index}`;

        link.source = this.nodes.filter(n => n.name === link.source)[0];
        link.target = this.nodes.filter(n => n.name === link.target)[0];

        if(!has(link.source, 'x')) link.source.x = 0;
        if(!has(link.target, 'x')) link.target.x = 0;
        if(!has(link.source, 'y')) link.source.y = 0;
        if(!has(link.target, 'y')) link.target.y = 0;
        
        return link;
      });
    },
    init(){

      this.simulation = d3.forceSimulation()
          .force("link", d3.forceLink().distance(this.force.linkDistance).id(d => d.id))
          .force('charge', d3.forceManyBody().strength(this.force.charge).theta(0)) 
          .force("collide", d3.forceCollide().radius(this.force.collide))
          .force("center", d3.forceCenter(this.width / 2, this.height / 2));

      this.simulation
        .nodes(this.nodes);
        
      this.simulation
          .force("link")
          .links(this.links);

      this.simulation.restart();
    },
    update(){
      if (this.simulation)
        this.simulation.stop();

      this.init();
    }
  },
  watch: {
    nodes(newNodes){
      /*console.log('watching nodes');
      console.log(newNodes);*/
    }
  },
  created(){
    
  },
  mounted(){

    this.buildNodes();
    this.buildLinks();

    console.log(d3.selectAll(".nodes"));

    this.$nextTick(() => {
          d3.selectAll(".nodes").call(d3.drag()
                .on('start', d => {

                  if (!d3.event.active)
                    this.simulation.alphaTarget(0.9).restart();

                  console.log('start');
                  console.log(d);

                  d.fx = d.x;
                  d.fy = d.y;
                })
                .on('drag', d => {

                  console.log('drag');
                  console.log(d);
                  console.log("event");
                  console.log(d3.event);

                  d.fx = d3.event.x;
                  d.fy = d3.event.y;
                })
                .on('end', d => {
                  if (!d3.event.active) 
                    this.simulation.alphaTarget(0);

                  console.log('end');
                  console.log(d);
                        
                  //d.fx = null;
                  //d.fy = null;
                }));

          this.update();
    });



    
    
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
