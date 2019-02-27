# TetriJs
Knockoff Tetris in Javascript

This project is just an excuse to become a little more familiar with javascript. 
It's a poor man's copy of tetris, written entirely in javascript and rendered to a canvas. 

no block holding, no scores, no win or lose condition. very bare bones. 

arrow keys and spacebar for controls

## Future Improvements
Code organization is rough overall, due to a combination of being unfamiliar with the language and being unfamiliar with Tetris design. 
Currently most functionality is put into a 'Piece' class, which contains the game board and operates based on boundaries set there. 

Pieces were organized as a 2D array, along with a base position on the board overall. 
This made sense, to fit with the thought that Tetris really just operates on a grid, 
but it lead to a lot of repeated iteration and calculated offsets. 

In the future I would probably avoid doing it the same way, to hopefully write some more legible code. 
