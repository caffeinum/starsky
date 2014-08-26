function CanvasWrapper ( canvasId ) {
    var canvas  = document.getElementById( canvasId || "cvs" );
    if ( ! canvas ) return;
    var cnt = canvas.getContext("2d");
    if ( ! cnt ) return;
    
    this.canvas = canvas;
    
    this.fillRect = function (x,y,w,h) {
        cnt.fillStyle = "#000000";
        cnt.fillRect(x,y,w,h);
    };
    
    this.clear = function () { 
        cnt.clearRect(0, 0, canvas.width, canvas.height);
    };
    
    this.drawCircle = function (centerX, centerY, radius, color) {
        cnt.fillStyle = color;
        cnt.beginPath();
        cnt.arc( centerX, centerY, radius, 0, 2*Math.PI );
        cnt.fill();
    };
}

function Sky() {
    var cnt = new CanvasWrapper("sky");
    var sun = {x:0,y:0};
    var stars = [];
    var sky = this;
    
    this.setSun = function ( x, y ) {
        sun.x = x; sun.y = y;
        sun.speedX = 0;
        sun.speedY = 0;
        sun.radius = 20;
        console.log( sun );
    };
    
    this.setSunSpeed = function ( speedX, speedY ) {
        sun.speedX = speedX;
        sun.speedY = speedY;
        return sun.speedX*sun.speedX + sun.speedY*sun.speedY;
    };
    
    this.click = function ( x, y ) {
        this.setSun( x, y, 0, 0 );
        return false;
    };
    
    cnt.canvas.addEventListener('click', function (event) {
        if ( event.offsetX && event.offsetY )
            sky.setSunSpeed( (event.offsetX - sun.x) / 100,
                             (event.offsetY - sun.y) / 100);
    });
    
    cnt.canvas.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        if ( event.offsetX && event.offsetY )
            sky.setSun( event.offsetX, event.offsetY );
        return false;
    });
    
    this.setStars = function ( starsArray ) {
        starsArray.forEach(function (star) {
            stars.push( { x: star[0], y: star[1], color: '#ffffff' } );
        });
        
        console.log( stars );
    };
    
    this.moveSun = function () {
        sun.x += sun.speedX;
        sun.y += sun.speedY;
        
        if ( sun.x <= 0 + sun.radius || sun.x >= 1200 - sun.radius ) sun.speedX *= -1;
        if ( sun.y <= 0 + sun.radius || sun.y >=  800 - sun.radius ) sun.speedY *= -1;
    };
    
    this.drawSun = function () {
        cnt.drawCircle( sun.x, sun.y, sun.radius, "#ffffaa" );
    };
    
    this.drawStars = function () {
        var x, y, r;
        var starsLeft = 0;
        stars.forEach(function ( star ) {
            r = Math.sqrt( (sun.x-star.x)*(sun.x-star.x) + (sun.y-star.y)*(sun.y-star.y) );
            
            x = star.x + 500 * (star.x - sun.x) / r / r;
            y = star.y + 500 * (star.y - sun.y) / r / r;
            
    //        console.log( x - star.x );
            r = Math.sqrt( (sun.x-x)*(sun.x-x) + (sun.y-y)*(sun.y-y) );
            
            if ( r < sun.radius ) star.color = "#000000";
            if ( star.color === "#ffffff" ) starsLeft++;
            
            
            cnt.drawCircle( x, y, 2, star.color );
            cnt.drawCircle( star.x, star.y, 1, "#ff0000" );
        });
        
        if ( ! starsLeft ) alert("You win!");
        else console.log( starsLeft );
    };
      
    this.move = function () {
        cnt.clear();
        cnt.fillRect( 0, 0, 1200, 800);

        sky.moveSun();
        sky.drawSun();
        
        sky.drawStars();        
    }
}

$(document).ready(function () {
    var sky = new Sky();
    
    sky.setSun(300, 400);
    sky.setSunSpeed(0, 0);
    
    var stars = [
        [200, 400],
        [100, 300],
        [500, 200],
        [400, 500]
    ];
    
    for ( var i = 0; i < 200; i++ ) {
        stars.push( 
            [
                Math.round( Math.random() * 1200 ), 
                Math.round( Math.random() *  800 )
            ]
        );
    }
    
    sky.setStars( stars );
    
    var step = setInterval(sky.move, 10);
});