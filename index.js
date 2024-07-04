/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "black";

let circles_array = [];
let hue = 0;


const mouse = {
    x: undefined,
    y:undefined,
}

function get_distance(c1, c2)
{
    // get distance between 2 circles

    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;

    let distance = Math.sqrt((dx*dx) + (dy*dy));
    return distance;
}

class Player
{
    constructor()
    {
        this.x = canvas.width/2;
        this.y = canvas.height/2;

        this.size = 5;
        this.colour = 'rgba(255, 255, 255, 1)';
    }

    update()
    {
        this.x = mouse.x;
        this.y = mouse.y;
    }

    draw()
    {
        context.fillStyle = this.colour;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }
}

let player = new Player();

class Circle
{
    constructor()
    {
        this.size = Math.random() * (player.size + 20) + (player.size/2);

        // generate random spawns outside of player vision/canvas
        let spawnPos = Math.floor(Math.random() * 4 + 1);
        if(spawnPos == 1) { // top spawn
            this.x = Math.random() * canvas.width;
            this.y = 0 - this.size;
        } else if (spawnPos == 2) { // right spawn
            this.x = canvas.width + this.size;
            this.y = Math.random() * canvas.height;
        } else if (spawnPos == 3) { // bottom spawn
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + this.size;
        } else if (spawnPos == 4) { //left spawn
            this.x = 0 - this.size;
            this.y = Math.random() * canvas.height;
        }
        
        // set speed/direction somewhat towards center
        this.speedX = Math.random() * 3;
        this.speedY = Math.random() * 3;

        if(this.x > canvas.width/2) {
            this.speedX *= -1;
        }

        if (this.y > canvas.height/2) {
            this.speedY *= -1;
        }

        this.colour = 'hsl('+ hue +',100%,50%)';
    }

    update()
    {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw()
    {
        context.fillStyle = this.colour;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }
}

canvas.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    player.update();
})

canvas.addEventListener('mousedown', function(event){

})

function handle_circles()
{
    for(let i = 0; i < circles_array.length; i++)
        {
            circles_array[i].update();
            circles_array[i].draw();

            // check if collision with player
            let distance = get_distance(player, circles_array[i]);
            if(distance <= (player.size + circles_array[i].size)) {
                if(player.size > circles_array[i].size) { // player eat circle
                    player.size += circles_array[i].size / 4;
                    circles_array.splice(i, 1);
                    i--;
                    continue;
                } else { //player die
                    player.size = 0;
                }
            }

            // remove circles that are out of bounds
            if(circles_array[i].x < -100 || circles_array[i].x > canvas.width+100) {
                circles_array.splice(i, 1);
                i--;
            } else if(circles_array[i].y < -100 || circles_array[i].y > canvas.height+100) {
                circles_array.splice(i, 1);
                i--;
            }
        }
}


let counter = 0;

function animate()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    // context.fillStyle = 'rgba(0, 0, 0, 0.9)';
    // context.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    handle_circles();

    // if(circles_array.length <= 20) {
    //     circles_array.push(new Circle());
    // }

    if(counter == 7) {
        circles_array.push(new Circle());
        counter = 0;
    }
    

    hue += 0.2;
    counter++;

    requestAnimationFrame(animate);

}

animate();