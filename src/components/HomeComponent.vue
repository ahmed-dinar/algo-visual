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
  name: 'HomeComponent',
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
          .attr('stroke', d => (
              ((_this.sourceNode && _this.destNode)
                && (d.source.name === _this.sourceNode.trim() && d.target.name === _this.destNode.trim())) 
                ? '#ba1914' 
                : '#058e02'
          ));
          

      //update nodes
      _this.nodes = _this.nodes.data(_this.graph.nodes, d => d.name);
      _this.nodes.exit().remove();
      _this.nodes = _this.nodes
            .enter().append("circle")
            .attr("r", 15)
            .attr("fill", (d,i) => _this.color(i))
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

      _this.nodelabels = _this.nodelabels.data(_this.graph.nodes, d => d.name);
      _this.nodelabels.exit().remove();
      _this.nodelabels = _this.nodelabels
         .enter().append("text")
         .merge(_this.nodelabels)
         .attr("x", d => d.x)
         .attr("y", d => d.y)
         .attr("class", "nodelabel")
         .attr("stroke", "black")
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
      console.log('ticked');
      this.links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      this.nodes
          .attr("cx", d=> d.x)
          .attr("cy", d=> d.y);

      this.nodelabels
          .attr("x", d => d.x) 
          .attr("y", d=> d.y);

      this.linklabels
          .attr("x", d => (d.source.x + d.target.x)/2)
          .attr("y", d => (d.source.y + d.target.y)/2);
    },
    loadEdges(){

      let _this = this;

      _this.graph.links.forEach(function(edge){
        _this.edges.push({
          source: _this.graph.nodes.filter(n => n.name === edge.source)[0],
          target: _this.graph.nodes.filter(n => n.name === edge.target)[0],
          value: edge.value
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
