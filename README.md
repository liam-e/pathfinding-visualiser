# Pathfinding visualiser

A simple visualiser using vanilla JavaScript with TypeScript, and SVG, using the Model-View-Controller and Pub/Sub patterns.

## Motivation

I wanted to build an app to demonstrate and compare different pathfinding algorithms visually, with full interactivity. I chose to make this a web app using JavaScript, as the app can run in a web browser and can manipulate objects in the app without having to reload the page. However, I wanted to see if I could implement dynamic functionality without the use of external libraries such as React, firstly for my own learning, and secondly because I feel it would have added unneeded complexity for a project of this size. I did however decide to incorporate TypeScript into the project for its powerful type-safety.

The pathfinding squares are drawn simply using an SVG object, where the squares can be drawn as rectangles. The find-path animation is played asynchronously, before the full path has been found.

## Installation

Make sure you have [TypeScript](https://www.typescriptlang.org/download) installed.

Clone the project

```sh
git clone https://github.com/liam-e/pathfinding-visualiser.git
cd pathfinding-visualiser/
```

Run the TypeScipt compiler

```sh
npx tsc
```

Create a simple http server

```
python3 -m http.server 8080
```

## To-do

- [x] Move start/goal points by mouse dragging
- [ ] Change grid size based on window size
- [ ] Handle "no path exists" case
- [x] Path length info
- [ ] Computation time info
- [x] No diagonals mode
- [ ] Add more pathfinding algorithms
- [ ] Selector to adjust animation speed
- [ ] Random maze generator
