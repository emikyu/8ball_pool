# Eight-Ball Pool

## 1. Background and Overview

Eight-ball pool is the most popular form of billiards, played on a six-pocket table. Players play the game using a cue stick to hit and move balls across the table and pocketing them.

Eight-ball pool typically consists of two players, with them taking turns hitting either striped or solid balls into pockets. The game ends when one player hits all balls of their pattern type & ultimately hit a black eight ball into a pocket at the end.

The game begins with 15 colored balls numbered 1-15 (7 solid, 7 striped, and 8-ball) arranged in a triangle, with an additional white cue ball on the opposite side of the pool table. Each turn, the current player attempts to use the cue ball to hit balls of their color into one of the six pockets.

See the gif below for a demonstration of the gameplay mechanics.

[TODO: ADD DEMO GIF]

## 2. Functionality and MVPs

With this Eight-Ball Pool game simulator, users are able to:

* Start a new two-player game / reset an existing game table
* Maneuver the cue stick around the pool table to aim at balls through the cue ball
* Hit balls around the table once the cue stick is released, potentially landing balls in pockets
* Take turns according to a simplified version of eight-ball pool rules until one player wins by pocketing the eight ball (after hitting all balls of their marking into pockets)

In addition, the following are included:

* A "How to Play" instructions modal explaining the rules of the game
* A production README

## 3. Wireframes

The eight-ball pool simulator is on a single screen with the restart button, pool table, cue stick, links to the repo and my online presence sites, and the "How to Play" modal (question mark button).

The cue stick is movable via mouse moment, where clicking the mouse indicates shooting at the cue ball with the stick.

Below the pool table, the screen displays the balls already pocketed by either of the players.

![8ball pool wireframe](/final_wireframe.png)

## 4. Architecture and Technology

The project is implemented with:
* JavaScript for the overall gaming logic
* HTML5 Canvas for graphics and animation rendering
* Webpack as the JS module bundler

In addition to the entry file, the following scripts are employed to support the game implementation:
* ball.js: The script houses the constructor and animation functions for Ball objects. Each Ball has the following properties: a number (1-15, null), color, marking (striped, solid, null), velocity, and canvas position.

* table.js: The script houses the constructor and animation functions for the Table object, which is the main backdrop for the game.

* game.js: The script contains the connection between user interaction and the effects on the Table and Balls, including logic for rendering HTML5 Canvas elements to the DOM. It also tracks the state of the game and holds an array of Ball objects. It is be responsible for checking and updating the position of each Ball, once the player hits the cue ball during their turn.

## 5. Implementation Timeline

### Day 1
- Set up webpack and Node modules
- Wrote rudimentary entry files and skeletons for supporting scripts
- Reviewed HTML5 Canvas to brush up on knowledge & animation loops.

### Day 2
- Built out Ball object completely (constructor & update functions)
- Built out table.js enough to display the starting state of the pool table (triangle formation and cue ball)
- Connected table.js with game.js to reset the game depending on user control
- Reviewed physics knowledge to understand how hitting the cue ball would affect the changes in the state of the Game (taking into account direction, speed, and friction)
- Started implementing backend Game logic to update the position of the balls over time, once the cue ball has been hit.

### Day 3
- Completed the backend Game logic for how its state changes over time & updates to the Ball objects array, based on a given shot angle / speed / direction to the cue ball
- Implemented gameplay logic to enable players to take turns & interpret user interaction (moving the cue stick)
- Incorporate gameplay logic into visual rendering

### Day 4
- Wrapped up remaining refinements carried over from the prior days
- Styled front end of the game to a polished state
- Added "How to Play" modal

## 6. Bonus Features

Potential features to explore in the future:
* Incorporate in more complex game logic to more closely align to eight-ball pool rules (e.g., dealing with scratches)
* Leverage web sockets to enable players to play live on two devices (vs. on taking turns on same device)
* Add alternative game modes for other billiard-type games (e.g., snooker)
