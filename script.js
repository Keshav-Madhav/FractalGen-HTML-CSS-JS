canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;


window.onload = function() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var x = 3; // Number of sides
        var size = 300; // Size of the polygon
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;

        // Listen for changes on the input field
        document.getElementById('edges').addEventListener('change', function(event) {
            x = event.target.value;
            drawPolygon();
        });

        function drawPolygon() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            ctx.beginPath();
            if (x === 0) {
                ctx.arc(centerX, centerY, size, 0, 2 * Math.PI);
            } else {
                var startAngle = -Math.PI / 2; // Start from the top
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

        drawPolygon(); // Draw the initial polygon
    }
}
