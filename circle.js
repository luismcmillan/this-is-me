export default class circle {
    
    constructor(name, links) {
      this.x = 50+Math.random()*800;
      this.y = 50+Math.random()*800;
      this.vx = 2;
      this.vy = 2;
      this.radius = 5;
      this.color = "grey";
      this.dragging = false;
      this.name = name;
      this.links = links
    }
    draw_me() {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.hovered ? "red" : this.color;
        ctx.fill();
      }
    

    move() {
      this.x += this.vx;
      this.y += this.vy;
      if (
        this.y + this.vy > 300 - this.radius ||
        this.y + this.vy < this.radius
      ) {
        this.vy = -this.vy;
      }
      if (
        this.x + this.vx > 600 - this.radius ||
        this.x + this.vx < this.radius
      ) {
        this.vx = -this.vx;
      }
    }

    follow(parent){
      var distance = Math.sqrt((parent.x-this.x)**2 + (parent.y-this.y)**2);
      if (distance > 200) {
          this.x = this.x - this.vx*((this.x-parent.x)/(Math.abs(this.x-parent.x) + Math.abs(this.y-parent.y)))
          this.y = this.y - this.vy*((this.y-parent.y)/(Math.abs(this.x-parent.x) + Math.abs(this.y-parent.y)))
      } else if (distance < 100 ){
          this.x = this.x + this.vx*((this.x-parent.x)/(Math.abs(this.x-parent.x) + Math.abs(this.y-parent.y)))
          this.y = this.y + this.vy*((this.y-parent.y)/(Math.abs(this.x-parent.x) + Math.abs(this.y-parent.y)))
      }
    }

    keep_distance_to(neighbor){
      var distance = Math.sqrt((neighbor.x-this.x)**2 + (neighbor.y-this.y)**2);
      if (distance < 50) {
          this.x = this.x + this.vx*((this.x-neighbor.x)/(Math.abs(this.x-neighbor.x) + Math.abs(this.y-neighbor.y)))
          this.y = this.y + this.vy*((this.y-neighbor.y)/(Math.abs(this.x-neighbor.x) + Math.abs(this.y-neighbor.y)))
      }
    }
    isPointInside(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
      }
  }