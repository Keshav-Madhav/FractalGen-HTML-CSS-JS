canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

var dotPlaced = false; // Variable to check if a dot has been placed

window.onload = function() {
    var canvas = document.getElementById('canvas');
    var startAngle = 0;
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var x = 3; // Number of sides
        var size = 300; // Size of the polygon
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;

        // Listen for changes on the input field
        document.getElementById('edges').addEventListener('change', function(event) {
            x = event.target.value;
            dotPlaced = false;
            drawPolygon();
        });

        function drawPolygon() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            ctx.beginPath();
            if (x === 0) {
                ctx.arc(centerX, centerY, size, 0, 2 * Math.PI);
            } else {
                startAngle = -Math.PI / 2; // Start from the top
                if (x % 2 === 0) { // If even, adjust start angle to make a flat side lay on the x axis
                    startAngle += Math.PI / x;
                }
                ctx.moveTo(centerX + size * Math.cos(startAngle), centerY + size * Math.sin(startAngle));

                for (var side = 0; side <= x; side++) {
                    ctx.lineTo(centerX + size * Math.cos(startAngle + side * 2 * Math.PI / x), centerY + size * Math.sin(startAngle + side * 2 * Math.PI / x));
                }
            }

            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        drawPolygon();

        var polygon = [];
        for (var side = 0; side <= x; side++) {
            polygon.push([
                centerX + size * Math.cos(startAngle + side * 2 * Math.PI / x),
                centerY + size * Math.sin(startAngle + side * 2 * Math.PI / x)
            ]);
        }

        canvas.addEventListener('click', function(event) {
            if (!dotPlaced) { 
                var rect = canvas.getBoundingClientRect();
                var mouseX = event.clientX - rect.left;
                var mouseY = event.clientY - rect.top;
        
                // Check if the point is inside the polygon
                if (pointInPolygon([mouseX, mouseY], polygon)) {
                    ctx.beginPath();
                    ctx.arc(mouseX, mouseY, 2, 0, 2 * Math.PI); 
                    ctx.fillStyle = 'white';
                    ctx.fill();
        
                    dotPlaced = true; 
                }
            }
        });
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
