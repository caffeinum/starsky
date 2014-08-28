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
    
    this.drawText = function (text) {
        cnt.font = "36px Verdana";
        cnt.fillStyle = "#ffffff";
        cnt.fillText(text, 500,400);
    };
    
    this.drawLine = function (x1, y1, x2, y2, color) {
        
        cnt.strokeStyle = color || "#ffffff";
        
        cnt.beginPath();
        cnt.moveTo(x1, y1);
        cnt.lineTo(x2, y2);
        cnt.stroke();
        return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
    };
    
    this.moveTo = function (x, y, color) {
        
        cnt.strokeStyle = color || "#ffffff";
        
        cnt.beginPath();
        cnt.moveTo(x, y);
    };
    this.lineTo = function (x, y) {
        cnt.lineTo(x, y);
    };
    this.stroke = function () {
        cnt.stroke();
    };
    this.arc = function (x,y,x1,y1,x2,y2,radius) {
        cnt.beginPath();
        cnt.moveTo(x,y);
        cnt.arcTo(x1,y1,x2,y2,radius);
        cnt.stroke();
    };
}

function Sky() {
    var cnt = new CanvasWrapper("sky");
    var sun = {x:0,y:0};
    var stars = [];
    var sky = this;
    
    this.setSun = function ( x, y, isCrazy ) {
            if ( isCrazy === 'crazy' ) {
                sun.isCrazy = true;
                console.log('crazyness!');
            } else {
                sun.isCrazy = false;
            }
        
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
    
    this.getStars = function (n) {
        
        var stars = [];

        for ( var i = 0; i < n; i++ ) {
            stars.push( 
                [
                    Math.round( Math.random() * 1200 ), 
                    Math.round( Math.random() *  800 )
                ]
            );
        }
        
        return stars;
    };
    
    this.setStars = function ( starsArray ) {
        stars = [];
        
        if ( typeof starsArray === "number" )
            starsArray = this.getStars(starsArray);
        
        starsArray.forEach(function (star) {
            stars.push( { x: star[0], y: star[1], color: '#ffffff' } );
        });
        
        console.log( stars );
    };
    
    this.moveSun = function () {
        sun.x += sun.speedX;
        sun.y += sun.speedY;

        if ( sun.x <= -1200 + sun.radius || sun.x >= 2400 - sun.radius ) sun.speedX *= -1;
        if ( sun.y <=  -800 + sun.radius || sun.y >= 1600 - sun.radius ) sun.speedY *= -1;
    };
    
    this.drawSun = function () {
        cnt.drawCircle( sun.x, sun.y, sun.radius, "#ffffaa" );
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
        //this.setStars( 0 );
        //this.setSun(600, 400, 'crazy');
        //this.setSunSpeed(20, 20);
        
        var img_obj = {
            'source': null,
            'current': 0,
            'total_frames': 6,
            'width': 142,
            'height': 87
        };
        
        var x = -img_obj.width, y = 600;
        
        var img = new Image();
        var rainbow = new Image();
        
        img.onload = function () {
            img_obj.source = img;
        };
        
        rainbow.src = 'img/rainbow.png';
        img.src = 'img/nyan.png';
        
        /*var audio = new Audio('Nyan_cat.ogg');
        audio.loop = true;
        audio.play();*/
        
        var finish = function () {
            sky.drawNyan = function () {};
            //sky.start(600, 400, 200, 50);
        };
        
        this.drawNyan = function () {
            x += 2;
            
            cnt.drawImage(rainbow, Math.floor(img_obj.current/3 % 2) * 40, 0, 160, 104, x - 4 * img_obj.width, y - img_obj.height/2, img_obj.width, img_obj.height);
            cnt.drawImage(rainbow, Math.floor(img_obj.current/3 % 2) * 40, 0, 160, 104, x - 3 * img_obj.width, y - img_obj.height/2, img_obj.width, img_obj.height);
            cnt.drawImage(rainbow, Math.floor(img_obj.current/3 % 2) * 40, 0, 160, 104, x - 2 * img_obj.width, y - img_obj.height/2, img_obj.width, img_obj.height);
            cnt.drawImage(rainbow, Math.floor(img_obj.current/3 % 2) * 40, 0, 160, 104, x - 1 * img_obj.width, y - img_obj.height/2, img_obj.width, img_obj.height);
            
            if (img_obj.source !== null)
                cnt.drawImage(img_obj.source,
                    Math.floor(img_obj.current) * img_obj.width, 0,
                    img_obj.width, img_obj.height,
                    x - img_obj.width/2, y - img_obj.height/2,
                    img_obj.width, img_obj.height);

            img_obj.current = (img_obj.current + .1) % img_obj.total_frames;
            
            // stop Nyan
            if ( x > 1200 + 4 * img_obj.width )
            {
                finish();
            }
        };
    }; 
     
    this.draw = function () {
        cnt.clear();
        cnt.fillRect( 0, 0, 1200, 800);

        sky.moveSun();
        sky.drawSun();
        
        sky.drawStars();
        
        sky.drawNyan();
    };
    
    this.start = function (sunX, sunY, starsN, fps) {
        
        
        sky.setSun(sunX, sunY);
        sky.setSunSpeed(0, 0);
        
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
        
        sky.setStars( starsN );

        //sky.startNyanCat();

        var step = setInterval(this.draw, Math.round(1000 / fps));
    };
}

function Scheme (canvasId) {
    var scheme = this;
    var cnt = new CanvasWrapper( canvasId );
    var sun = {}, star = {};
    
    this.setSun = function ( x, y ) {
        sun.x = x; sun.y = y;
        sun.speed = 0;
        sun.radius = 50;
        console.log( sun );
    };
    this.setStar = function ( x, y ) {
        star.x = x; star.y = y;
    };
    
    this.setSunSpeed = function ( speed ) {
        sun.speed = speed;
    };
    
    this.moveSun = function () {
        sun.x += sun.speed;
    };
    
    this.drawSun = function () {
        cnt.drawCircle( sun.x, sun.y, sun.radius, "#ffffaa" );
    };
    this.drawStar = function () {
        var x, y, r;
        cnt.drawCircle( star.x, star.y, 1, "#ff0000" );
            
        //distance from the center of the sun to the star
        //r = Math.sqrt( (sun.x-star.x)*(sun.x-star.x) + (sun.y-star.y)*(sun.y-star.y) );
        r = star.x - sun.x;
        //effect when star becomes invisible because its light is blocked by sun disk
        

        //new coordinates: r = r + 500 / r (vectors)
        x = star.x + 3000 / r;
//        y = star.y + 1000 * (star.y - sun.y) / r / r;

        //draw star where we see it
        cnt.drawCircle( x, star.y, 2, "#ffffff" );
        
        if ( Math.abs(r) > 20 )
            cnt.drawLine( 600, 600, x, star.y, "#ffffff" );
    };
    this.draw = function () {
        cnt.clear();
        cnt.fillRect( 0, 0, 1200, 800);

        cnt.drawCircle(600,600,5,"#0000ff");
        
        scheme.moveSun();
        scheme.drawSun();
        
        scheme.drawStar();
        
    };
    this.start = function ( fps ) {
        scheme.setSun(600, 400);
        scheme.setStar(600, 0);
        
        cnt.canvas.addEventListener('click', function (event) {
            if ( event.offsetX && event.offsetY )
                scheme.setSunSpeed( (event.offsetX - sun.x) / 100 );
        });

        cnt.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            if ( event.offsetX && event.offsetY )
                scheme.setSun( event.offsetX, sun.y );
            return false;
        });
        
         var step = setInterval(this.draw, Math.round(1000 / fps));
    };
}
$(document).ready(function () {
    var sky = new Sky();
    sky.start(300, 400, 200, 100);
    
    var exp = new Scheme('explain');
    exp.start( 50 );
});