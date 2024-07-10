import circle from "./circle.js";
const jsoncontent = await loadJson();

const canvas = document.getElementById("canvas");
var circle_size = document.getElementById("circle_size").value;
const ctx = canvas.getContext("2d");
var ctx_width = canvas.getAttribute("width");
var ctx_height = canvas.getAttribute("height");
ctx.strokeStyle = "gray";
let raf;
let general_dragged = false;
let general_hovered = false;
let running = false;
const balls = [];
const map = new Map();
//Creates all circles
var i = 0;
for (const element of jsoncontent) {
  map.set(element.name, element.id);
  balls.push(
    new circle(
      element.id,
      element.name,
      ctx_width / 2 +
        ctx_width * 0.45 * Math.sin((i / jsoncontent.length) * 2 * Math.PI),
      ctx_height / 2 +
        ctx_width * 0.45 * Math.cos((i / jsoncontent.length) * 2 * Math.PI),
      circle_size,
      element.content
    )
  );
  i++;
}
//Creates all connections
for (const element of jsoncontent) {
  const children_list = [];
  const parent_list = [];
  for(const child of element.children){
    children_list.push(balls[map.get(child)]);
  }
  for(const parent of element.parents){
    parent_list.push(balls[map.get(parent)]);
  }
  balls[element.id].child_links= children_list;
  balls[element.id].parent_links= parent_list;
}

//Creates connectivity matrix
let matrix = Array.from({ length: balls.length }, () =>
  Array(balls.length).fill(0)
);
for(const ball of balls){
  let children_links = ball.get_child_links();
  for (let i = 0; i < children_links.length; i++) {
    matrix[ball.id][map.get(children_links[i].name)] = 1;
  } 
}


for (const element of balls) {
  element.draw();
}

draw_all_lines(matrix);


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
      }
    }
  }

  for (const element of balls) {
    element.change_circle_gravity();
    element.change_circle_size();
    element.draw();
    //draw_me(element);
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
  if (general_hovered) {
    clear();
    draw_all_lines(matrix);
  }
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouse_x = (e.clientX - rect.left)*scaleX;
  const mouse_y = (e.clientY - rect.top)*scaleY;
  let found_hovered = false;

  for (const element of balls) {
    element.hovered = element.dragging ||element.isPointInside(mouse_x, mouse_y);
    element.draw()
    if (element.hovered) {
      found_hovered = true;
      general_hovered = true;
      document.getElementById("circle-content").innerHTML = element.give_content();
      if (element.dragging == true) {
        element.x = mouse_x;
        element.y = mouse_y;
      }
    }
  }
  general_hovered = found_hovered ? true : false;
});

canvas.addEventListener("click", (e) => {
  if (!running) {
    raf = window.requestAnimationFrame(draw);
    running = true;
  }
});

document.getElementById("myModal"),
  addEventListener("click", (e) => {
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
  let found_dragged = false;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouse_x = (e.clientX - rect.left)*scaleX;
  const mouse_y = (e.clientY - rect.top)*scaleY;

  if (!general_dragged){
    for (const element of balls) {
      if (element.isPointInside(mouse_x, mouse_y)) {
        element.dragging = true;
        found_dragged = true;
      }
    }
  }
  
  found_dragged ? general_dragged = true : general_dragged = false;
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
  general_dragged = false;
  for (const element of balls) {
    element.dragging = false;
    element.hovered = false;
  }
});
