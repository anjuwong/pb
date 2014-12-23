
var Board = function(r,c) {
    var me = this;
    me.w = c;
    me.h = r;
    me.b = [];
    me.time = 5;
    for(var i = 0; i < r*c; i++) {
        me.b.push(0);
    }
    me.pos = [0,0];
    me.color = []
    me.color.push("rgb(236,51,30)");
    me.color.push("rgb(57,192,23)");
    me.color.push("rgb(21,144,226)");
    me.color.push("rgb(172,61,228)");
    me.color.push("rgb(255,213,0)");
    me.color.push("rgb(245,117,236)");
    me.n = me.color.length;
    me.move_pos = function(direction) {
        /* Moves the cursor in direction */
        var r = me.pos[0];
        var c = me.pos[1];
        var newr = r+direction[0];
        var newc = c+direction[1];
        if (me.at(newr,newc) != null) {
            me.pos = [newr,newc];
        }
    }
    me.move = function(direction) {
        /* Makes a move in direction */
        var r = me.pos[0];
        var c = me.pos[1];
        var newr = r+direction[0];
        var newc = c+direction[1];
        var tmp = me.b[r*me.w+c]
        var val = me.at(newr,newc)
        if (val != null) {
            me.b[r*me.w+c] = val;
            me.b[newr*me.w+newc] = tmp;
            fillPos((newc+c)/2,(newr+r)/2,"rgb(156,156,156)");
            me.pos = [newr,newc];
        }
    }
    me.fill = function() {
        for (var r = 0; r < me.h; r++) {
            for (var c = 0; c < me.w; c++) {
                var rp = r;
                if (me.b[r*me.w+c] == 0) {
                    while (rp > 0 && me.b[(rp-1)*me.w+c] != 0) {
                        me.b[rp*me.w+c] = me.b[(rp-1)*me.w+c];
                        me.b[(rp-1)*me.w+c] = 0;
                        rp -= 1;
                    }
                }
            }
        }
        var hadFill = false;
        /* Fill in random orbs */
        for (var r = 0; r < me.h; r++) {
            for (var c = 0; c < me.w; c++) {
                if (me.b[r*me.w+c] == 0) {
                    hadFill = true;
                    me.b[r*me.w+c] = Math.floor((Math.random() * me.n)+1);
                }
            }
        }
        me.display();

        /* If hadFill is false, nothing was filled */
        if (!hadFill)
            return false;
        me.match();
        return true;
    }
    me.at = function(r,c) {
        if (c < 0 || c > me.w-1)
            return null;
        if (r < 0 || r > me.h-1)
            return null;
        return me.b[r*me.w+c]
    }
    me.match = function() {
        var toClear = [];
        for (var r = 0; r < me.h; r++) 
        {
            for (var c = 0; c < me.w; c++) 
            {
                var h0 = me.at(r,c);
                var v0 = h0;
                var h1 = me.at(r,c+1);
                var h2 = me.at(r,c+2);
                var v1 = me.at(r+1,c);
                var v2 = me.at(r+2,c);
                if (h0 != null && h0 == h1 && h1 == h2)
                {
                    toClear.push([r,c]);
                    toClear.push([r,c+1]);
                    toClear.push([r,c+2]);
                }
                if (v0 != null && v0 == v1 && v1 == v2)
                {
                    toClear.push([r,c]);
                    toClear.push([r+1,c]);
                    toClear.push([r+2,c]);
                }
            }    
        }
        var len = toClear.length;
        for (var t = 0; t < len; t++)
        {
            me.b[toClear[t][0]*me.w+toClear[t][1]] = 0;
        }
        me.fill();
        me.time = 5;
        clearInterval(me.timer);
    }
    me.display = function() {
        var canvas = document.getElementById("bcanvas");
        if (canvas.getContext) {
            var context = canvas.getContext('2d');
            context.fillStyle = "rgb(156,256,256)";;
            context.fillRect(0,0,canvas.width,canvas.height);
            if (me.holding)
                context.fillStyle = "rgb(10,10,10)";
            else
                context.fillStyle = "rgb(156,156,156)";
            context.fillRect(30*me.pos[1],30*me.pos[0],30,30);
            context.fillRect(2.5,152.5,175,25);
        } else {
            document.write("No support!");
        }
        
        for (var r = 0; r < me.h; r++) {
            //var s = "";
            for (var c = 0; c < me.w; c++) {
                if(me.b[me.w*r+c] == 0) {
                    fillPos(c,r,"rgb(156,156,156)");
                }
                else {
                    fillPos(c,r,me.color[me.b[me.w*r+c]-1]);
                }//s = s + (me.b[me.w*r+c]).toString();
            }
        }
        fillTimer(me.time);
    }
    me.start_timer = function() {
        me.timer = setInterval(function() {
            me.time -= 1;
            fillTimer(me.time);
            if (me.time == 0) {
                me.time = 5;
                me.holding = false;
                me.match();
            }
        },1000);
    }
    me.holding = false;
    me.fill();
}

function fillPos(x,y,c) {
    var canvas = document.getElementById("bcanvas");
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillStyle = c;
        context.fillRect(2.5+30*x,2.5+30*y,25,25);
    } else {
        document.write("No support!");
    }
}
function fillTimer(t) {
    /* Timer has max 5 seconds */
    var canvas = document.getElementById("bcanvas");
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillStyle = "rgb(156,156,156)";
        context.fillRect(2.5,152.5,170*(5-t)/5,25);
    } else {
        document.write("No support!");
    }
}
function startGame(r,c) {
    var b = new Board(r,c);
    var UP = [-1,0];
    var RIGHT = [0,1];
    var DOWN = [1,0];
    var LEFT = [0,-1];
    var turns = 0;
    var first_move_done = false;
    document.onkeydown = function (e) {
        if (e.keyCode == '38') {
            if (b.holding)
                b.move(UP);
            else
                b.move_pos(UP);

            if (b.holding && !first_move_done) {
                first_move_done = true;
                b.start_timer();
            }
            turns++;
            b.display();
        }
        else if (e.keyCode == '40') {
            if (b.holding)
                b.move(DOWN);
            else
                b.move_pos(DOWN);
            if (b.holding && !first_move_done) {
                first_move_done = true;
                b.start_timer();
            }
            turns++;
            b.display();
        }
        else if (e.keyCode == '37') {
            if (b.holding)
                b.move(LEFT);
            else
                b.move_pos(LEFT);
            if (b.holding && !first_move_done) {
                first_move_done = true;
                b.start_timer();
            }
            turns++;
            b.display();
        }
        else if (e.keyCode == '39') {
            if (b.holding)
                b.move(RIGHT);
            else
                b.move_pos(RIGHT);
            if (b.holding && !first_move_done) {
                first_move_done = true;
                b.start_timer();
            }
            turns++;
            b.display();
        }
        if (e.keyCode == '32') {
            if (b.holding) {
                b.match();
                b.holding = false;
                first_move_done = false;
            }
            else {
                b.holding = true;
                first_move_done = false;
                b.match();
            }
            b.display();
            turns = 0;
        }
        if (e.shiftKey == true) {
            if (b.holding) {
                b.match();
                b.holding = false;
                first_move_done = false;
            }
            else {
                b.holding = true;
                first_move_done = false;
                b.match();
            }
            b.display();
            turns = 0;
        }
    }
    
}

