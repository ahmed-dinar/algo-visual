<template>
  <div class="graph-area">
    <button v-on:click="updateGrap">Greet</button>
    <div id="graph-container"></div>
  </div>
</template>

<script>

import * as d3 from 'd3';

export default {
  name: 'HelloWorld',
  data(){
    return {
      color: d3.scaleOrdinal(d3.schemeCategory20),
      width: 960,
      height: 600,
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
      this.sourceNode = 'MES';
      this.destNode = 'ECB';
      this.updateTest();
    },
    updateTest(){
      var preLink = this.svg.selectAll('.links').data(this.edges);
      var preNode = this.svg.selectAll('.nodes').data(this.graph.nodes);

      console.log(preLink);
      preLink.exit().remove();
      console.log(preLink);
      console.log(preNode);
      preNode.exit().remove();
      console.log(preNode);
    },
    drawGraph(){

      let _this = this;

      _this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().distance(15).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-400).theta(0)) 
        .force("collide", d3.forceCollide().radius(100))
        .force("center", d3.forceCenter(_this.width / 2, _this.height / 2));


      

      _this.links = _this.svg
          .append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(_this.edges)
          .enter().append("line")
          .attr("stroke-width", 2)
          .attr('stroke', function(d){

            if(d.source.name === _this.sourceNode && d.target.name === _this.destNode){
              return '#ba1914';
            }

            return '#E5E5E5';

          });


      

      _this.nodes = _this.svg
            .append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(_this.graph.nodes)
            .enter().append("circle")
            .attr("r", 15)
            .attr("fill", function(d, i) { return _this.color(i); })
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


       _this.nodelabels = _this.svg.selectAll(".nodelabel") 
         .data(_this.graph.nodes)
         .enter()
         .append("text")
         .attr("x", function(d){ return d.x; })
         .attr("y", function(d){ return d.y; })
         .attr("class", "nodelabel")
         .attr("stroke", "black")
         .text(function(d){return d.name;});


       _this.linklabels = _this.svg.append("g")
                    .attr("class","links")
                    .selectAll("text")
                    .data(_this.edges)
                    .enter().append("text")
                      .attr("font-size","10px")
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
    this.svg = d3.select("#graph-container").append("svg").attr("width", "100%").attr("height", "100%");
    this.preLink = this.svg.append("g").selectAll(".links"),
    this.preNode = this.svg.append("g").selectAll(".nodes");
    this.loadEdges();
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
  height: 600px;
  margin: 0 auto;
}


</style>
