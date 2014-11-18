var Board = function(r,c) {
    this.w = c;
    this.h = r;
    this.b = [];
    for(var i = 0; i < r*c; i++) {
        this.b.push(0);
    }
    this.pos = [0,0];
    this.color = []
    this.color.push("rgb(236,51,30)");
    this.color.push("rgb(57,192,23)");
    this.color.push("rgb(21,144,226)");
    this.color.push("rgb(172,61,228)");
    this.color.push("rgb(255,213,0)");
    this.color.push("rgb(245,117,236)");
    this.n = this.color.length;
    this.holding = false;
    this.fill();
}

Board.prototype.move_pos = function(direction) {
    var r = this.pos[0];
    var c = this.pos[1];
    var newr = r+direction[0];
    var newc = c+direction[1];
    if (this.at(newr,newc) != null) {
        this.pos = [newr,newc];
    }
}
Board.prototype.move = function(direction) {
    var r = this.pos[0];
    var c = this.pos[1];
    var newr = r+direction[0];
    var newc = c+direction[1];
    var tmp = this.b[r*this.w+c]
    var val = this.at(newr,newc)
    if (val != null) {
        this.b[r*this.w+c] = val;
        this.b[newr*this.w+newc] = tmp;
        this.pos = [newr,newc];
    }
}

Board.prototype.fill = function() {
    this.display();
    for (var r = 0; r < this.h; r++) {
        for (var c = 0; c < this.w; c++) {
            var rp = r;
            if (this.b[r*this.w+c] == 0) {
                while (rp > 0 && this.b[(rp-1)*this.w+c] != 0) {
                    this.b[rp*this.w+c] = this.b[(rp-1)*this.w+c];
                    this.b[(rp-1)*this.w+c] = 0;
                    rp -= 1;
                }
            }
        }
    }
    this.display();
    var hadFill = false;
    for (var r = 0; r < this.h; r++) {
        for (var c = 0; c < this.w; c++) {
            if (this.b[r*this.w+c] == 0) {
                hadFill = true;
                this.b[r*this.w+c] = Math.floor((Math.random() * this.n)+1);
            }
        }
    }

    /* If hadFill is false, nothing was filled */
    if (!hadFill)
        return false;
    this.match();
    return true;
}

Board.prototype.at = function(r,c) {
    if (c < 0 || c > this.w-1)
        return null;
    if (r < 0 || r > this.h-1)
        return null;
    /* var s = x.toString()+","+y.toString()+":"+(this.b[y*this.w+x]).toString()
    console.log(s);
    */
    return this.b[r*this.w+c]
}

Board.prototype.match = function() {
    var toClear = [];
    for (var r = 0; r < this.h; r++) 
    {
        for (var c = 0; c < this.w; c++) 
        {
            var h0 = this.at(r,c);
            var v0 = h0;
            var h1 = this.at(r,c+1);
            var h2 = this.at(r,c+2);
            var v1 = this.at(r+1,c);
            var v2 = this.at(r+2,c);
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
            /*else {
                console.log("Nothing to drop");
                if (v0 != null && v1 != null && v2 != null) {
                    console.log("("+r.toString()+","+c.toString()+")");
                    console.log(v0);
                    console.log(v1);
                    console.log(v2);
                }
            }*/
        }    
    }
    var len = toClear.length;
    for (var t = 0; t < len; t++)
    {
        this.b[toClear[t][0]*this.w+toClear[t][1]] = 0;
    }
    this.fill();
}

Board.prototype.display = function() {
    var canvas = document.getElementById("bcanvas");
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillStyle = "rgb(156,256,256)";;
        context.fillRect(0,0,canvas.width,canvas.height);
        if (this.holding)
            context.fillStyle = "rgb(10,10,10)";
        else
            context.fillStyle = "rgb(156,156,156)";
        context.fillRect(30*this.pos[1],30*this.pos[0],30,30);
    } else {
        document.write("No support!");
    }
    
    for (var r = 0; r < this.h; r++) {
        //var s = "";
        for (var c = 0; c < this.w; c++) {
            fillPos(c,r,this.color[this.b[this.w*r+c]-1]);
            //s = s + (this.b[this.w*r+c]).toString();
        }
        //console.log(s);
    }
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

function startGame(r,c) {
    var b = new Board(r,c);
    var UP = [-1,0];
    var RIGHT = [0,1];
    var DOWN = [1,0];
    var LEFT = [0,-1];
    var turns = 0;
    document.onkeydown = function (e) {
        if (e.keyCode == '38') {
            if (b.holding)
                b.move(UP);
            else
                b.move_pos(UP);
            turns++;
            b.display();
        }
        else if (e.keyCode == '40') {
            if (b.holding)
                b.move(DOWN);
            else
                b.move_pos(DOWN);
            turns++;
            b.display();
        }
        else if (e.keyCode == '37') {
            if (b.holding)
                b.move(LEFT);
            else
                b.move_pos(LEFT);
            turns++;
            b.display();
        }
        else if (e.keyCode == '39') {
            if (b.holding)
                b.move(RIGHT);
            else
                b.move_pos(RIGHT);
            turns++;
            b.display();
        }
        if (e.keyCode == '32') {
            if (b.holding) {
                b.match();
                b.holding = false;
            }
            else
                b.holding = true;
            b.display();
            turns = 0;
        }
        if (e.shiftKey == true) {
            b.holding = true;
            b.display();
        }
    }
    
}

