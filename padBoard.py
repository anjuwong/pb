#!/usr/bin/python

# INITIAL DRAFT OF GAME
#   NO SUPPORT FOR "DROPPING" AFTER MATCHING

from sets import Set
import random
import sys,tty,termios

UP          = (0,-1)
RIGHT       = (1,0)
DOWN        = (0,1)
LEFT        = (-1,0)
UPRIGHT     = (1,-1)
DOWNRIGHT   = (1,1)
DOWNLEFT    = (-1,1)
UPLEFT      = (-1,-1)

class Board:
    def __init__(self,w,h):
        self.w = w
        self.h = h
        self.b = [0 for i in range(w*h)]
        self.pos = (0,0)
        self.n = 4
        self.fill()

    def fill(self):
        hadFill = False
        for r in range(self.h):
            for c in range(self.w):
                if self.b[r*self.w+c] == 0:
                    hadFill = True
                    self.b[r*self.w+c] = random.randrange(1,self.n+1)
        if not hadFill:
            return False

        self.match()
        self.fill()
        return True
        

    def match(self):
        # matches the orbs
        toClear = Set()
        for r in range(self.h):
            for c in range(self.w):
                v0 = h0 = self.at(r,c)
                v1 = self.at(r,c+1)
                v2 = self.at(r,c+2)
                h1 = self.at(r+1,c)
                h2 = self.at(r+2,c)
                if not v0 == None and v0 == v1 and v1 == v2:
                    toClear.add((r,c))
                    toClear.add((r,c+1))
                    toClear.add((r,c+2))
                if not h0 == None and h0 == h1 and h1 == h2:
                    toClear.add((r,c))
                    toClear.add((r+1,c))
                    toClear.add((r+2,c))
        for t in toClear:
            self.b[t[1]*self.w+t[0]] = 0
        self.fill()

    def display(self):
        for r in range(self.h):
            print [self.b[self.w*r+c] for c in range(self.w)]

    def at(self,x,y):
        if x < 0 or x > self.w-1:
            return None
        if y < 0 or y > self.h-1:
            return None
        return self.b[y*self.w+x]

    def move(self,direction):
        # right is increasing x for (x,y)
        # tmp = b[self.pos[1]*self.w+self.pos[0]]
        if not (direction == UP or \
                direction == RIGHT or \
                direction == DOWN or \
                direction == LEFT or \
                direction == UPRIGHT or \
                direction == DOWNRIGHT or \
                direction == DOWNLEFT or \
                direction == UPLEFT):
            return
        x = self.pos[0]
        y = self.pos[1]
        newx = self.pos[0]+direction[0]
        newy = self.pos[1]+direction[1]
        tmp = self.b[y*self.w+x]
        val = self.at(newx,newy)
        if not val == None:
            self.b[y*self.w+x] = val
            self.b[newy*self.w+newx] = tmp
            self.pos = (newx, newy)
        return

class Game:
    def __init__(self,w,h):
        self.board = Board(w,h)
        self.turn = 0
    def play(self):
        # get player move until timeout or break
        # match + fill
        inkey = _Getch()
        while(not self.finished()):
            while (1):
                k = inkey()
                if k!= '':
                    break
            if k == '\x1b[A':
                self.board.move(UP)
            elif k == '\x1b[B':
                self.board.move(DOWN)
            elif k == '\x1b[C':
                self.board.move(RIGHT)
            elif k == '\x1b[D':
                self.board.move(LEFT)
            else:
                continue
            
            

        return

    def finished(self):
        self.turn -= 1
        if self.turn == 10:
            return True
        else:
            return False

class _Getch:
    def __call__(self):
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(3)
        finally:
            termios.tcsetattr(fd,termios.TCSADRAIN,old_settings)
        return ch

def main():
    print "This is padBoard"
    g = Game(6,5)
    g.board.display()
    g.play()

if __name__ == '__main__':
    main()
