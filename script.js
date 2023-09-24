var canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext('2d');

var canvasTop = document.getElementById('canvas-top');
canvasTop.width = canvasTop.clientWidth;
canvasTop.height = canvasTop.clientHeight;
var ctxTop = canvasTop.getContext('2d');

var dotPlaced = false;
var dotX;
var dotY;
var x = 3;
var size = 370;
var polygon = [];
var speed = 1;

window.onload = function() {

    var startAngle = 0;
    if (canvas.getContext) {
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;

        // Listen for changes on the input field
        document.getElementById('edges').addEventListener('change', function(event) {
            x = event.target.value;
            console.log(x);
            dotPlaced = false;
            drawPolygon();
        });

        // Draw the polygon
        function drawPolygon() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            if (x == 1) {
                ctx.arc(centerX, centerY, size, 0, 2 * Math.PI);
                polygon = {type: 'circle', centerX: centerX, centerY: centerY, radius: size};
                console.log(polygon);
            } else {
                startAngle = -Math.PI / 2; // Start from the top
                if (x % 2 === 0) {
                    startAngle += Math.PI / x;
                }
                ctx.moveTo(centerX + size * Math.cos(startAngle), centerY + size * Math.sin(startAngle));
        
                // Create an array of the polygon's vertices
                polygon = [];
                for (var side = 0; side <= x; side++) {
                    var verticeX = centerX + size * Math.cos(startAngle + side * 2 * Math.PI / x);
                    var verticeY = centerY + size * Math.sin(startAngle + side * 2 * Math.PI / x);
                    polygon.push([verticeX, verticeY]);
                    ctx.lineTo(verticeX, verticeY);
                }
            }
        
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        drawPolygon();

        // Listen for clicks on the canvas
        canvas.addEventListener('click', function(event) {
            if (!dotPlaced) { 
                var rect = canvas.getBoundingClientRect();
                var mouseX = event.clientX - rect.left;
                var mouseY = event.clientY - rect.top;
                dotX = mouseX;
                dotY = mouseY;
        
                // Check if the point is inside the shape
                if (pointInShape([mouseX, mouseY], polygon)) {
                    ctx.beginPath();
                    ctx.arc(mouseX, mouseY, 2, 0, 2 * Math.PI); 
                    ctx.fillStyle = 'white';
                    ctx.fill();
                    dotPlaced = true; 
                }
            }
        });

        document.getElementById('start').addEventListener('click', function() {
            drawLineToRandomVertice(dotX, dotY, polygon, ctx);
        });
        
    }
}

// check if point is inside polygon
function pointInShape(point, shape) {
    var x = point[0], y = point[1];

    if (shape.type === 'circle') {
        var dx = x - shape.centerX;
        var dy = y - shape.centerY;
        return dx * dx + dy * dy <= shape.radius * shape.radius;
    } else {
        return pointInPolygon(point, shape);
    }
}

function pointInPolygon(point, vs) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

// find a random vertice to the dot
function drawLineToRandomVertice(dotX, dotY, shape, ctx) {
    var randomPoint;

    if (shape.type === 'circle') {
        var angle = Math.random() * 2 * Math.PI;
        var randomX = shape.centerX + shape.radius * Math.cos(angle);
        var randomY = shape.centerY + shape.radius * Math.sin(angle);
        randomPoint = [randomX, randomY];
    } else {
        var randomIndex = Math.floor(Math.random() * shape.length);
        randomPoint = shape[randomIndex];
    }

    // Clear the top canvas
    ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);

    // Draw a line from the dot to the random point on the top canvas
    ctxTop.beginPath();
    ctxTop.moveTo(dotX, dotY);
    ctxTop.lineTo(randomPoint[0], randomPoint[1]);
    ctxTop.strokeStyle = '#ffffff';
    ctxTop.stroke();

    placeDotInMiddle(dotX, dotY, randomPoint[0], randomPoint[1], ctx);
}

function placeDotInMiddle(dotX, dotY, verticeX, verticeY, ctx) {
    // Calculate the coordinates of the middle point
    var middleX = (dotX + verticeX) / 2;
    var middleY = (dotY + verticeY) / 2;

    // Draw the dot
    ctx.beginPath();
    ctx.arc(middleX, middleY, 0.1, 0, 2 * Math.PI); 
    ctx.fillStyle = 'white';
    ctx.fill();

    setTimeout(function() {
        drawLineToRandomVertice(middleX, middleY, polygon, ctx);
    }, speed);
}


// find the closest vertice to the dot
// function drawLineToClosestVertice(dotX, dotY, shape, ctx) {
//     var closestPoint;

//     if (shape.type === 'circle') {
//         // Calculate the angle from the center of the circle to the dot
//         var angle = Math.atan2(dotY - shape.centerY, dotX - shape.centerX);
//         // Calculate the coordinates of the point on the circumference
//         var closestX = shape.centerX + shape.radius * Math.cos(angle);
//         var closestY = shape.centerY + shape.radius * Math.sin(angle);
//         closestPoint = [closestX, closestY];
//     } else {
//         var closestDistance = Infinity;

//         // Find the closest vertice
//         for (var i = 0; i < shape.length; i++) {
//             var dx = dotX - shape[i][0];
//             var dy = dotY - shape[i][1];
//             var distance = Math.sqrt(dx * dx + dy * dy);

//             if (distance < closestDistance) {
//                 closestDistance = distance;
//                 closestPoint = shape[i];
//             }
//         }
//     }

//     // Draw a line from the dot to the closest point
//     ctx.beginPath();
//     ctx.moveTo(dotX, dotY);
//     ctx.lineTo(closestPoint[0], closestPoint[1]);
//     ctx.strokeStyle = 'white';
//     ctx.stroke();

//     placeDotInMiddle(dotX, dotY, closestPoint[0], closestPoint[1], ctx);
// }

// //  find the farthest vertice to the dot
// function drawLineToFarthestVertice(dotX, dotY, shape, ctx) {
//     var farthestPoint;

//     if (shape.type === 'circle') {
//         // Calculate the angle from the center of the circle to the dot
//         var angle = Math.atan2(dotY - shape.centerY, dotX - shape.centerX);
//         // Calculate the coordinates of the point on the circumference
//         var farthestX = shape.centerX + shape.radius * Math.cos(angle + Math.PI);
//         var farthestY = shape.centerY + shape.radius * Math.sin(angle + Math.PI);
//         farthestPoint = [farthestX, farthestY];
//     } else {
//         var farthestDistance = 0;

//         // Find the farthest vertice
//         for (var i = 0; i < shape.length; i++) {
//             var dx = dotX - shape[i][0];
//             var dy = dotY - shape[i][1];
//             var distance = Math.sqrt(dx * dx + dy * dy);

//             if (distance > farthestDistance) {
//                 farthestDistance = distance;
//                 farthestPoint = shape[i];
//             }
//         }
//     }

//     // Draw a line from the dot to the farthest point
//     ctx.beginPath();
//     ctx.moveTo(dotX, dotY);
//     ctx.lineTo(farthestPoint[0], farthestPoint[1]);
//     ctx.strokeStyle = 'white';
//     ctx.stroke();
    
//     placeDotInMiddle(dotX, dotY, farthestPoint[0], farthestPoint[1], ctx);
// }
