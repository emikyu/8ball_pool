# Eight-Ball Pool

## 1. Background and Overview

Eight-ball pool is the most popular form of billiards, played on a six-pocket table. Players play the game using a cue stick to hit and move balls across the table and pocketing them.

Eight-ball pool typically consists of two players, with them taking turns hitting either striped or solid balls into pockets. The game ends when one player hits all balls of their pattern type & ultimately hit a black eight ball into a pocket at the end.

The game begins with 15 colored balls numbered 1-15 (7 solid, 7 striped, and 8-ball) arranged in a triangle, with an additional white cue ball on the opposite side of the pool table. Each turn, the current player will attempt to use the cue ball to hit balls of their color into one of the six pockets.

## 2. Functionality and MVPs

With this Eight-Ball Pool game simulator, users will be able to:

* Start a new two-player game / reset an existing game table
* Maneuver the cue stick around the pool table to aim at balls through the cue ball
* Hit balls around the table once the cue stick is released, potentially landing balls in pockets
* Take turns according to a simplified version of eight-ball pool rules until one player wins by pocketing the eight ball (after hitting all balls of their marking into pockets)

In addition, the following will be included:

* A "How to Play" instructions modal explaining the rules of the game
* A production README

## 3. Wireframes

The eight-ball pool simulator will be on a single screen with the game controls (start/reset), pool table, cue stick, links to the repo and my online presence sites, and the "How to Play" modal.

The cue stick will be movable via mouse moment, where clicking the mouse indicates shooting at the cue ball with the stick.

Below the pool table, the screen will display the balls already pocketed by either of the players.

![8ball pool wireframe](/final_wireframe.png)

## 4. Architecture and Technology

The project will be implemented with:
* JavaScript for the overall gaming logic
* CanvasHTML for graphics and animation rendering
* Webpack as the JS module bundler

In addition to the entry file, there will be the following scripts to support the project:
* ball.js: The script will house the constructor and update functions for Ball objects. Each Ball will contain a number (1-15, null), color, marking (striped, solid, null), and a canvas position.

* table.js: The script will keep track of the state of the game. The Table object will hold an array of Balls. It will be responsible for checking and updating the position of each Ball, once the player hits the cue ball during their turn.

* game.js: The script will contain the connection between user interaction and the effects on the Table and Balls, including logic for rendering canvasHTML elements to the DOM.

## 5. Implementation Timeline

### Day 1
Set up webpack and Node modules. Write rudimentary entry files and skeletons for supporting scripts. Review canvasHTML to brush up on knowledge & animation loops.

### Day 2
Build out Ball object completely (constructor & update functions). Build out table.js enough to display the starting state of the pool table (triangle formation and cue ball). Connect table.js with game.js to initialize/reset the Table depending on user control. Review physics knowledge to understand how hitting the cue ball would affect the changes in the state of the Table (taking into account direction, speed, and friction). Start implementing backend Table logic to update the position of the balls over time, once the cue ball has been hit.

### Day 3
Complete the backend Table logic for how its state changes over time & updates to the Ball objects array, based on a given shot angle / speed / direction to the cue ball. Implement game.js gameplay logic to enable players to take turns & interpret user interaction (moving the cue stick). Incorporate Table logic into game.js rendering.

### Day 4
Wrap up any to-do's carried over from the prior days. Style front end of the game to a polished state. Add "How to Play" modal.

## 6. Bonus Features

Potential features to explore in the future:
* Incorporate in more complex game logic to more closely align to eight-ball pool rules (e.g., dealing with scratches)
* Leverage web sockets to enable players to play live on two devices (vs. on taking turns on same device)
* Add alternative game modes for other billiard-type games (e.g., snooker)
