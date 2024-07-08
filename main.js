import circle from "./circle.js";
const jsoncontent = await loadJson();



const canvas = document.getElementById("canvas");
var circle_size = document.getElementById("circle_size").value;
const ctx = canvas.getContext("2d");
var ctx_width = canvas.getAttribute('width');
var ctx_height = canvas.getAttribute('height');
console.log(ctx_width,500);
ctx.strokeStyle = "gray";
let raf;
let general_hovered = false;
let text_is_given = false;
let dragging = false;
let running = false;
const balls = [];
const map = new Map();
var counter = 0;
//Creates all circles
for(var i=0; i < jsoncontent.length; i++){
  map.set(jsoncontent[i].name, counter);
  counter++;
  
  balls.push(new circle(jsoncontent[i].name, ctx_width/2 + ctx_width*0.45*Math.sin(i/jsoncontent.length*2*Math.PI),ctx_height/2 + ctx_width*0.45*Math.cos(i/jsoncontent.length*2*Math.PI),jsoncontent[i].links,circle_size));
  
}
for (const element of jsoncontent) {
  
}
//Creates connectivity matrix
let matrix = Array.from({ length: 313 }, () => Array(313).fill(0));
for (let i = 0; i < matrix.length; i++) {
  let links = jsoncontent[i].links;
  for (let j = 0; j < jsoncontent[i].links.length; j++) {
    matrix[i][map.get(links[j])] = 1;
  }
}

for (const element of balls) {
  draw_me(element);
}

draw_all_lines(matrix);

function draw_me(general_ball) {
  ctx.font = "15px Arial"; // Schriftgröße und Schriftart
  ctx.fillStyle = "grey"; // Textfarbe
  ctx.textAlign = 'center';
  // Schritt 3: Text in das Canvas zeichnen

  ctx.beginPath();
  ctx.arc(
    general_ball.x,
    general_ball.y,
    general_ball.radius,
    0,
    Math.PI * 2,
    true
  );
  ctx.closePath();
  if (general_hovered) {
    ctx.strokeStyle = "#D3D3D3";
    ctx.fillStyle = "#D3D3D3";
  } else {
    ctx.strokeStyle = "grey";
    ctx.fillStyle = "grey";
  }
  if (general_ball.hovered) {
    ctx.fillStyle = general_ball.hovered ? "black" : "grey";
    ctx.fillText(general_ball.name, general_ball.x, general_ball.y-5);
    text_is_given = true;
  }

  //ctx.fillStyle = "blue";
  ctx.fill();
}

function clear() {
  ctx.fillStyle = "rgb(255 255 255 / 30%)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_line_between(ball1, ball2) {
  ctx.moveTo(ball1.x, ball1.y);
  ctx.lineTo(ball2.x, ball2.y);
  ctx.stroke();
}

function draw() {
  clear();
  draw_all_lines(matrix);

  /*
  ball2.keep_distance_to(ball3);
  ball2.keep_distance_to(ball4);
  ball2.keep_distance_to(ball5);
  ball2.keep_distance_to(ball6);
  ball2.keep_distance_to(ball7);
  ball2.keep_distance_to(ball8);
  ball2.keep_distance_to(ball9);

  ball3.keep_distance_to(ball2);
  ball3.keep_distance_to(ball4);
  ball3.keep_distance_to(ball5);
  ball3.keep_distance_to(ball6);
  ball3.keep_distance_to(ball7);
  ball3.keep_distance_to(ball8);
  ball3.keep_distance_to(ball9);

  ball4.keep_distance_to(ball2);
  ball4.keep_distance_to(ball3);
  ball4.keep_distance_to(ball5);
  ball4.keep_distance_to(ball6);
  ball4.keep_distance_to(ball7);
  ball4.keep_distance_to(ball8);
  ball4.keep_distance_to(ball9);

  ball5.keep_distance_to(ball2);
  ball5.keep_distance_to(ball4);
  ball5.keep_distance_to(ball3);
  ball5.keep_distance_to(ball6);
  ball5.keep_distance_to(ball7);
  ball5.keep_distance_to(ball8);
  ball5.keep_distance_to(ball9);

  ball6.keep_distance_to(ball2);
  ball6.keep_distance_to(ball4);
  ball6.keep_distance_to(ball5);
  ball6.keep_distance_to(ball3);
  ball6.keep_distance_to(ball7);
  ball6.keep_distance_to(ball8);
  ball6.keep_distance_to(ball9);

  ball7.keep_distance_to(ball2);
  ball7.keep_distance_to(ball4);
  ball7.keep_distance_to(ball5);
  ball7.keep_distance_to(ball6);
  ball7.keep_distance_to(ball3);
  ball7.keep_distance_to(ball8);
  ball7.keep_distance_to(ball9);

  ball8.keep_distance_to(ball2);
  ball8.keep_distance_to(ball4);
  ball8.keep_distance_to(ball5);
  ball8.keep_distance_to(ball6);
  ball8.keep_distance_to(ball7);
  ball8.keep_distance_to(ball3);
  ball8.keep_distance_to(ball9);

  ball9.keep_distance_to(ball2);
  ball9.keep_distance_to(ball4);
  ball9.keep_distance_to(ball5);
  ball9.keep_distance_to(ball6);
  ball9.keep_distance_to(ball7);
  ball9.keep_distance_to(ball8);
  ball9.keep_distance_to(ball3);
*/

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[j][i] == 1) {
        balls[i].follow(balls[j]);
        balls[j].follow(balls[i]);
      }
    }
  }

  for (const element of balls) {
    element.change_circle_gravity();
    element.change_circle_size();
    draw_me(element);
  }
  raf = window.requestAnimationFrame(draw);
}

async function loadJson() {
  try {
    const response = await fetch("./obsidian.json");
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  }
}

canvas.addEventListener("mousemove", (e) => {
    if(text_is_given){
        clear();
        draw_all_lines(matrix);
    }
    const rect = canvas.getBoundingClientRect();
    const mouse_x = e.clientX - rect.left;
    const mouse_y = e.clientY - rect.top;
    var found_hovered = false;
    for (const element of balls) {
        element.hovered = element.isPointInside(mouse_x, mouse_y);
        if (element.isPointInside(mouse_x, mouse_y)) {
        found_hovered = true;
        general_hovered = true;
        if (element.dragging == true) {
            element.x = mouse_x;
            element.y = mouse_y;
        }
        }
    }
    general_hovered = found_hovered ? true : false;
    for (const element of balls) {
        draw_me(element);
    }
});

canvas.addEventListener("click", (e) => {
  if (!running) {
    raf = window.requestAnimationFrame(draw);
    running = true;
  }
});

document.getElementById("myModal"),addEventListener("click", (e) => {
  if (!running) {
    raf = window.requestAnimationFrame(draw);
    running = true;
  }
});

canvas.addEventListener("mouseout", (e) => {
  for (const element of balls) {
    element.dragging = false;
  }
  window.cancelAnimationFrame(raf);
  running = false;
});

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (const element of balls) {
    if (element.isPointInside(mouseX, mouseY)) {
      element.dragging = true;
    }
  }
});

function draw_all_lines(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] == 1) {
        draw_line_between(balls[i], balls[j]);
      }
    }
  }
}

canvas.addEventListener("mouseup", (e) => {
  for (const element of balls) {
    element.dragging = false;
  }
});




  


