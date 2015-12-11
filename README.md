# Snake

[Live](http://www.jimmyzeng.info/snake)

## About
An implementation of the classic game Snake using jQuery, CSS, and Javascript.

## Instructions
  Grey snake is controlled with arrow keys, orange snake (player 2) is controlled with WASD. Try to collect apples, and avoid hitting the walls or snakes.

## Features
* Front end implemented using jQuery and DOM manipulation.
* window.localStorage is used to store local high-score between sessions.
* Detects head-on snake collisions and declares no winner by checking the direction each snake is moving on collision
* Avoids snake turning backwards on itself by only allowing one direction input per movement frame.
* Smart rendering only redraws head and tail of snake to simulate movement.


## Todo
* Scoring for both players in 1 on 1 mode
* Additional competitive modes (collect most apples in a certain time period)


## Credits
© Jimmy Zeng 2015
