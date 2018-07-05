webpackJsonp([1],{"85jD":function(e,t){},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("7+uW"),r={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("h1",[this._v("Algo Visual")]),this._v(" "),t("router-view")],1)},staticRenderFns:[]};var o=n("VU/8")({name:"App"},r,!1,function(e){n("85jD")},null,null).exports,s=n("/ocq"),i=n("f4AQ"),l={name:"DirectedGraph",data:function(){return{nodeRadius:30,refX:6,linkDistance:15,collideRadius:100,width:960,height:500,simulation:null,links:null,nodes:null,nodelabels:null,linklabels:null,sourceNode:null,destNode:null,svg:null,edges:[],graph:{nodes:[{name:"A"},{name:"B"},{name:"C"},{name:"D"},{name:"E"}],links:[{source:"A",target:"B",value:"6.6km"},{source:"B",target:"C",value:"11km"},{source:"D",target:"C",value:"8.6 km"},{source:"D",target:"E",value:"12 km"},{source:"A",target:"E",value:"4.7 km"}]}}},computed:{},methods:{updateGrap:function(){console.log("updating"),this.drawGraph()},drawGraph:function(){console.log("updating 2");var e=this;e.links=e.links.data(e.edges),e.links.exit().remove(),e.links=e.links.enter().append("line").merge(e.links).attr("class","links").attr("marker-end","url(#arrowhead)").attr("stroke-width",2).attr("stroke",function(t){return e.sourceNode&&e.destNode&&t.source.name===e.sourceNode.trim()&&t.target.name===e.destNode.trim()?"#ba1914":"#058e02"}),e.nodes=e.nodes.data(e.graph.nodes,function(e){return e.name}),e.nodes.exit().remove(),e.nodes=e.nodes.enter().append("circle").attr("class","nodes").attr("r",e.nodeRadius).attr("fill","#2a5eb2").merge(e.nodes).call(i.drag().on("start",function(t){i.event.active||e.simulation.alphaTarget(.3).restart(),t.fx=t.x,t.fy=t.y}).on("drag",function(e){e.fx=i.event.x,e.fy=i.event.y}).on("end",function(t){i.event.active||e.simulation.alphaTarget(0),t.fx=null,t.fy=null})),e.nodelabels=e.nodelabels.data(e.graph.nodes,function(e){return e.name}),e.nodelabels.exit().remove(),e.nodelabels=e.nodelabels.enter().append("text").merge(e.nodelabels).attr("class","node-label").attr("font-size","22px").attr("textLength",2*e.nodeRadius).attr("text-anchor","middle").attr("letter-spacing","1px").attr("stroke","#fff").append("tspan").text(function(e){return e.name}),e.linklabels=e.linklabels.data(e.edges),e.linklabels.exit().remove(),e.linklabels=e.linklabels.enter().append("text").merge(e.linklabels).attr("font-size","14px").attr("stroke","black").text(function(e){return e.value}),e.simulation.nodes(e.graph.nodes).on("tick",e.onTick),e.simulation.force("link").links(e.edges)},onTick:function(){this.links.attr("x1",function(e){return e.source.x}).attr("y1",function(e){return e.source.y}).attr("x2",function(e){return e.target.x}).attr("y2",function(e){return e.target.y}),this.nodes.attr("cx",function(e){return e.x}).attr("cy",function(e){return e.y}),this.nodelabels.attr("x",function(e){return e.x}).attr("y",function(e){return e.y+5}),this.linklabels.attr("x",function(e){return(e.source.x+e.target.x)/2}).attr("y",function(e){return(e.source.y+e.target.y)/2})},loadEdges:function(){var e=this;e.graph.links.forEach(function(t){e.edges.push({source:e.graph.nodes.filter(function(e){return e.name===t.source})[0],target:e.graph.nodes.filter(function(e){return e.name===t.target})[0],value:t.value})})}},mounted:function(){this.loadEdges(),this.svg=i.select("#graph-container").append("svg").attr("width","100%").attr("height","100%"),this.svg.append("defs").append("marker").attr("id","arrowhead").attr("viewBox","0 0 10 10").attr("refX",this.nodeRadius-this.refX).attr("refY",5).attr("orient","auto").attr("markerWidth",10).attr("markerHeight",10).attr("xoverflow","visible").append("svg:path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("fill","#000").style("stroke","none"),this.links=this.svg.append("g").selectAll(".links"),this.nodes=this.svg.append("g").selectAll(".nodes"),this.nodelabels=this.svg.append("g").selectAll(".node-label"),this.linklabels=this.svg.append("g").selectAll(".link-label"),this.simulation=i.forceSimulation().force("link",i.forceLink().distance(this.linkDistance).id(function(e){return e.id})).force("charge",i.forceManyBody().strength(-400).theta(0)).force("collide",i.forceCollide().radius(this.collideRadius)).force("center",i.forceCenter(this.width/2,this.height/2)),this.drawGraph()}},u={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"graph-area"},[n("div",{staticClass:"inputs"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.sourceNode,expression:"sourceNode"}],attrs:{type:"text",placeholder:"Source"},domProps:{value:e.sourceNode},on:{input:function(t){t.target.composing||(e.sourceNode=t.target.value)}}}),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.destNode,expression:"destNode"}],attrs:{type:"text",placeholder:"Destination"},domProps:{value:e.destNode},on:{input:function(t){t.target.composing||(e.destNode=t.target.value)}}}),e._v(" "),n("button",{staticClass:"btn btn-outline-primary btn-sm",attrs:{type:"button"},on:{click:e.updateGrap}},[e._v("Update Edge")])]),e._v(" "),n("div",{attrs:{id:"graph-container"}})])},staticRenderFns:[]};var d=n("VU/8")(l,u,!1,function(e){n("S5TB")},"data-v-1f5c3894",null).exports,c={name:"HomeComponent",data:function(){return{color:i.scaleOrdinal(i.schemeCategory20),width:960,height:500,simulation:null,links:null,nodes:null,nodelabels:null,linklabels:null,sourceNode:null,destNode:null,svg:null,edges:[],graph:{nodes:[{name:"ECB"},{name:"MES"},{name:"MOHAKHALI"},{name:"DHANMONDI"},{name:"MIRPUR-10"}],links:[{source:"ECB",target:"MES",value:"6.6 km"},{source:"MES",target:"MOHAKHALI",value:"11 km"},{source:"DHANMONDI",target:"MOHAKHALI",value:"8.6 km"},{source:"DHANMONDI",target:"MIRPUR-10",value:"12 km"},{source:"ECB",target:"MIRPUR-10",value:"4.7 km"}]}}},computed:{},methods:{updateGrap:function(){console.log("updating"),this.drawGraph()},drawGraph:function(){console.log("updating 2");var e=this;e.links=e.links.data(e.edges),e.links.exit().remove(),e.links=e.links.enter().append("line").merge(e.links).attr("stroke-width",2).attr("stroke",function(t){return e.sourceNode&&e.destNode&&t.source.name===e.sourceNode.trim()&&t.target.name===e.destNode.trim()?"#ba1914":"#058e02"}),e.nodes=e.nodes.data(e.graph.nodes,function(e){return e.name}),e.nodes.exit().remove(),e.nodes=e.nodes.enter().append("circle").attr("r",15).attr("fill",function(t,n){return e.color(n)}).merge(e.nodes).call(i.drag().on("start",function(t){i.event.active||e.simulation.alphaTarget(.3).restart(),t.fx=t.x,t.fy=t.y}).on("drag",function(e){e.fx=i.event.x,e.fy=i.event.y}).on("end",function(t){i.event.active||e.simulation.alphaTarget(0),t.fx=null,t.fy=null})),e.nodelabels=e.nodelabels.data(e.graph.nodes,function(e){return e.name}),e.nodelabels.exit().remove(),e.nodelabels=e.nodelabels.enter().append("text").merge(e.nodelabels).attr("x",function(e){return e.x}).attr("y",function(e){return e.y}).attr("class","nodelabel").attr("stroke","black").text(function(e){return e.name}),e.linklabels=e.linklabels.data(e.edges),e.linklabels.exit().remove(),e.linklabels=e.linklabels.enter().append("text").merge(e.linklabels).attr("font-size","14px").attr("stroke","black").text(function(e){return e.value}),e.simulation.nodes(e.graph.nodes).on("tick",e.onTick),e.simulation.force("link").links(e.edges)},onTick:function(){console.log("ticked"),this.links.attr("x1",function(e){return e.source.x}).attr("y1",function(e){return e.source.y}).attr("x2",function(e){return e.target.x}).attr("y2",function(e){return e.target.y}),this.nodes.attr("cx",function(e){return e.x}).attr("cy",function(e){return e.y}),this.nodelabels.attr("x",function(e){return e.x}).attr("y",function(e){return e.y}),this.linklabels.attr("x",function(e){return(e.source.x+e.target.x)/2}).attr("y",function(e){return(e.source.y+e.target.y)/2})},loadEdges:function(){var e=this;e.graph.links.forEach(function(t){e.edges.push({source:e.graph.nodes.filter(function(e){return e.name===t.source})[0],target:e.graph.nodes.filter(function(e){return e.name===t.target})[0],value:t.value})})}},mounted:function(){this.loadEdges(),this.svg=i.select("#graph-container").append("svg").attr("width","100%").attr("height","100%"),this.links=this.svg.append("g").selectAll(".links"),this.nodes=this.svg.append("g").selectAll(".nodes"),this.nodelabels=this.svg.selectAll(".nodelabel"),this.linklabels=this.svg.append("g").selectAll(".link-label"),this.simulation=i.forceSimulation().force("link",i.forceLink().distance(15).id(function(e){return e.id})).force("charge",i.forceManyBody().strength(-400).theta(0)).force("collide",i.forceCollide().radius(100)).force("center",i.forceCenter(this.width/2,this.height/2)),this.drawGraph()}},p={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"graph-area"},[n("div",{staticClass:"inputs"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.sourceNode,expression:"sourceNode"}],attrs:{type:"text",placeholder:"Source"},domProps:{value:e.sourceNode},on:{input:function(t){t.target.composing||(e.sourceNode=t.target.value)}}}),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.destNode,expression:"destNode"}],attrs:{type:"text",placeholder:"Destination"},domProps:{value:e.destNode},on:{input:function(t){t.target.composing||(e.destNode=t.target.value)}}}),e._v(" "),n("button",{staticClass:"btn btn-outline-primary btn-sm",attrs:{type:"button"},on:{click:e.updateGrap}},[e._v("Update Edge")])]),e._v(" "),n("div",{attrs:{id:"graph-container"}})])},staticRenderFns:[]};var g=n("VU/8")(c,p,!1,function(e){n("kqHU")},"data-v-6a4fe698",null).exports;a.a.use(s.a);var h=new s.a({mode:"hash",routes:[{path:"/",name:"HomeComponent",component:g},{path:"/graph/directed",name:"DirectedGraph",component:d}]});a.a.config.productionTip=!1,new a.a({el:"#app",router:h,components:{App:o},template:"<App/>"})},S5TB:function(e,t){},kqHU:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.ff639989a9f1a02756a9.js.map