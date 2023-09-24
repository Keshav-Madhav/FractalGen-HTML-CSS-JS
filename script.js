canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

var dotPlaced = false;
var dotX;
var dotY;
var x = 3;
var size = 300;
var polygon = [];

window.onload = function() {
    var canvas = document.getElementById('canvas');
    var startAngle = 0;
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
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
            drawLineToClosestVertice(dotX, dotY, polygon, ctx);
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

// find the closest vertice to the dot
function drawLineToClosestVertice(dotX, dotY, polygon, ctx) {
    var closestVertice;
    var closestDistance = Infinity;

    // Find the closest vertice
    for (var i = 0; i < polygon.length; i++) {
        var dx = dotX - polygon[i][0];
        var dy = dotY - polygon[i][1];
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestVertice = polygon[i];
        }
    }

    // Draw a line from the dot to the closest vertice
    ctx.beginPath();
    ctx.moveTo(dotX, dotY);
    ctx.lineTo(closestVertice[0], closestVertice[1]);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}
