const ctx = canvas.getContext("2d");

const mouse  = {x : 0, y : 0, button : false}
function mouseEvents(e){
  mouse.x = e.pageX;
  mouse.y = e.pageY;
  mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
}
["down","up","move"].forEach(name => document.addEventListener("mouse"+name,mouseEvents));




// x1,y1 location of a circle start
// x2,y2 location of the end circle
// bend factor. negative bends up for, positive bends down. If zero the world will end 
// aLen is Arrow head length in pixels
// aWidth is arrow head width in pixels
// sArrow boolean if true draw start arrow
// eArrow  boolean if true draw end  arrow
// startRadius = radius of a circle if start attached to circle
// endRadius = radius of a circle if end attached to circle
function drawBend(x1, y1, x2, y2, bend, aLen, aWidth, sArrow, eArrow, startRadius, endRadius){
    var mx, my, dist, nx, ny, x3, y3, cx, cy, radius, vx, vy, a1, a2;
    var arrowAng,aa1,aa2,b1;
    // find mid point
    mx = (x1 + x2) / 2;  
    my = (y1 + y2) / 2;
    
    // get vector from start to end
    nx = x2 - x1;
    ny = y2 - y1;
    
    // find dist
    dist = Math.sqrt(nx * nx + ny * ny);
    
    // normalise vector
    nx /= dist;
    ny /= dist;
    
    // The next section has some optional behaviours
    // that set the dist from the line mid point to the arc mid point
    // You should only use one of the following sets
    
    //-- Uncomment for behaviour of arcs
    // This make the lines flatten at distance
    //b1 =  (bend * 300) / Math.pow(dist,1/4);

    //-- Uncomment for behaviour of arcs
    // Arc bending amount close to constant
    // b1 =  bend * dist * 0.5

    b1 = bend * dist

    // Arc amount bend more at dist
    x3 = mx + ny * b1;
    y3 = my - nx * b1;
   
    // get the radius
    radius = (0.5 * ((x1-x3) * (x1-x3) + (y1-y3) * (y1-y3)) / (b1));

    // use radius to get arc center
    cx = x3 - ny * radius;
    cy = y3 + nx * radius;

    // radius needs to be positive for the rest of the code
    radius = Math.abs(radius);

    


    // find angle from center to start and end
    a1 = Math.atan2(y1 - cy, x1 - cx);
    a2 = Math.atan2(y2 - cy, x2 - cx);
    
    // normalise angles
    a1 = (a1 + Math.PI * 2) % (Math.PI * 2);
    a2 = (a2 + Math.PI * 2) % (Math.PI * 2);
    // ensure angles are in correct directions
    if (bend < 0) {
        if (a1 < a2) { a1 += Math.PI * 2 }
    } else {
        if (a2 < a1) { a2 += Math.PI * 2 }
    }
    
    // convert arrow length to angular len
    arrowAng = aLen / radius  * Math.sign(bend);
    // get angular length of start and end circles and move arc start and ends
    
    a1 += startRadius / radius * Math.sign(bend);
    a2 -= endRadius / radius * Math.sign(bend);
    aa1 = a1;
    aa2 = a2;
   
    // check for too close and no room for arc
    if ((bend < 0 && a1 < a2) || (bend > 0 && a2 < a1)) {
        return;
    }
    // is there a start arrow
    if (sArrow) { aa1 += arrowAng } // move arc start to inside arrow
    // is there an end arrow
    if (eArrow) { aa2 -= arrowAng } // move arc end to inside arrow
    
    // check for too close and remove arrows if so
    if ((bend < 0 && aa1 < aa2) || (bend > 0 && aa2 < aa1)) {
        sArrow = false;
        eArrow = false;
        aa1 = a1;
        aa2 = a2;
    }
    // draw arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, aa1, aa2, bend < 0);
    ctx.stroke();

    ctx.beginPath();

    // draw start arrow if needed
    if(sArrow){
        ctx.moveTo(
            Math.cos(a1) * radius + cx,
            Math.sin(a1) * radius + cy
        );
        ctx.lineTo(
            Math.cos(aa1) * (radius + aWidth / 2) + cx,
            Math.sin(aa1) * (radius + aWidth / 2) + cy
        );
        ctx.lineTo(
            Math.cos(aa1) * (radius - aWidth / 2) + cx,
            Math.sin(aa1) * (radius - aWidth / 2) + cy
        );
        ctx.closePath();
    }
    
    // draw end arrow if needed
    if(eArrow){
        ctx.moveTo(
            Math.cos(a2) * radius + cx,
            Math.sin(a2) * radius + cy
        );
        ctx.lineTo(
            Math.cos(aa2) * (radius - aWidth / 2) + cx,
            Math.sin(aa2) * (radius - aWidth / 2) + cy
        );
        ctx.lineTo(
            Math.cos(aa2) * (radius + aWidth / 2) + cx,
            Math.sin(aa2) * (radius + aWidth / 2) + cy
        );
        ctx.closePath();
    }
    ctx.fill();
}



/** SimpleUpdate.js begin **/
// short cut vars 
var w = canvas.width;
var h = canvas.height;
var cw = w / 2;  // center 
var ch = h / 2;
var globalTime = new Date().valueOf();  // global to this 

// main update function
function update(timer){
    globalTime = timer;
    if(w !== innerWidth || h !== innerHeight){  // resize if needed
      cw = (w = canvas.width = innerWidth) / 2;
      ch = (h = canvas.height = innerHeight) / 2;
    }    
    ctx.setTransform(1,0,0,1,0,0); // reset transform
    ctx.globalAlpha = 1;           // reset alpha
    ctx.clearRect(0,0,w,h);

    var startRad = (Math.sin(timer / 2000) * 0.5 + 0.5) * 20 + 5;
    var endRad = (Math.sin(timer / 7000) * 0.5 + 0.5) * 20 + 5;
    ctx.lineWidth = 2;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(cw,ch,startRad,0,Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(mouse.x,mouse.y,endRad,0,Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    
    
    
    drawBend(cw,ch,mouse.x,mouse.y,-0.1,10,10,true,true,startRad + 1,endRad + 1);
    drawBend(cw,ch,mouse.x,mouse.y,-0.3,10,10,true,true,startRad + 1,endRad + 1);
    drawBend(cw,ch,mouse.x,mouse.y,-0.6,10,10,true,true,startRad + 1,endRad + 1);
    drawBend(cw,ch,mouse.x,mouse.y,0.1,10,10,true,true,startRad + 1,endRad + 1);
    drawBend(cw,ch,mouse.x,mouse.y,0.3,10,10,true,true,startRad + 1,endRad + 1);
    drawBend(cw,ch,mouse.x,mouse.y,0.6,10,10,true,true,startRad + 1,endRad + 1);


    requestAnimationFrame(update);
}
requestAnimationFrame(update);