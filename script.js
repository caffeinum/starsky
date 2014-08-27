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
    
    this.drawImage = function (img, cx,cy,cw,ch, x,y,w,h) {
        cnt.drawImage(img,cx,cy,cw,ch,x,y,w,h);
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
        sun.radius = 50;
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
        /*
        if ( sun.x <= 0 + sun.radius || sun.x >= 1200 - sun.radius ) sun.speedX *= -1;
        if ( sun.y <= 0 + sun.radius || sun.y >=  800 - sun.radius ) sun.speedY *= -1;
        */
        
        if ( sun.x <=    0 ) sun.x += 1200;
        if ( sun.x >= 1200 ) sun.x -= 1200;
        
        if ( sun.y <=   0 ) sun.y += 800;
        if ( sun.y >= 800 ) sun.y -= 800;
    };
    
    this.drawSun = function () {
        cnt.drawCircle( sun.x, sun.y, sun.radius, "#ffffaa" );
        
        if ( sun.x <=    0 + sun.radius )
        cnt.drawCircle( sun.x + 1200, sun.y, sun.radius, "#ffffaa" ); 
        if ( sun.x >= 1200 - sun.radius ) 
        cnt.drawCircle( sun.x - 1200, sun.y, sun.radius, "#ffffaa" );
        
        if ( sun.y <=   0 + sun.radius ) 
        cnt.drawCircle( sun.x, sun.y + 800, sun.radius, "#ffffaa" );
        if ( sun.y >= 800 - sun.radius ) 
        cnt.drawCircle( sun.x, sun.y - 800, sun.radius, "#ffffaa" );
    };
    
    this.drawStars = function () {
        var x, y, r;
        stars.forEach(function ( star ) {
            //red dot where star should be
            cnt.drawCircle( star.x, star.y, 1, "#ff0000" );
            
            //distance from the center of the sun to the star
            r = Math.sqrt( (sun.x-star.x)*(sun.x-star.x) + (sun.y-star.y)*(sun.y-star.y) );
            
            //easter egg
            if ( r === 0 ) sky.startNyanCat();

            //effect when star becomes invisible because its light is blocked by sun disk
            if ( r < 10 ) return;
            
            //new coordinates: r = r + 500 / r (vectors)
            x = star.x + 1000 * (star.x - sun.x) / r / r;
            y = star.y + 1000 * (star.y - sun.y) / r / r;
            
            //draw star where we see it
            cnt.drawCircle( x, y, 2, star.color );
        });
    };
      
      
    this.drawNyan = function() {};
    
    this.startNyanCat = function () {
        var x = -200, y = 600;
        
        var img_obj = {
            'source': null,
            'current': 0,
            'total_frames': 6,
            'width': 142,
            'height': 87
        };
        
        var img = new Image();
        var rainbow = new Image();
        
        img.onload = function () {
            img_obj.source = img;
        };
        
        rainbow.src = 'img/rainbow.png';
        img.src = 'img/nyan.png';
        
        this.drawNyan = function () {
            x += 1;
            
            cnt.drawImage(rainbow, Math.floor(img_obj.current/3 % 2) * 40, 0, 160, 104, x - 1 * img_obj.width, y - img_obj.height/2, img_obj.width, img_obj.height);
            cnt.drawImage(rainbow, Math.floor(img_obj.current/3 % 2) * 40, 0, 160, 104, x - 2 * img_obj.width, y - img_obj.height/2, img_obj.width, img_obj.height);
            cnt.drawImage(rainbow, Math.floor(img_obj.current/3 % 2) * 40, 0, 160, 104, x - 3 * img_obj.width, y - img_obj.height/2, img_obj.width, img_obj.height);
            cnt.drawImage(rainbow, Math.floor(img_obj.current/3 % 2) * 40, 0, 160, 104, x - 4 * img_obj.width, y - img_obj.height/2, img_obj.width, img_obj.height);
            
            if (img_obj.source !== null)
                cnt.drawImage(img_obj.source,
                    Math.floor(img_obj.current) * img_obj.width, 0,
                    img_obj.width, img_obj.height,
                    x - img_obj.width/2, y - img_obj.height/2,
                    img_obj.width, img_obj.height);

            img_obj.current = (img_obj.current + .1) % img_obj.total_frames;
        };
    }; 
     
    this.move = function () {
        cnt.clear();
        cnt.fillRect( 0, 0, 1200, 800);

        sky.moveSun();
        sky.drawSun();
        
        sky.drawStars();
        
        sky.drawNyan();
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
    
    //sky.startNyanCat();
    
    var step = setInterval(sky.move, 10);
});