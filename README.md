# Pathfinding visualiser

An interactive pathfinding algorithm visualiser using vanilla JavaScript/TypeScript.

This web app demonstrates and compares different pathfinding algorithms visually, with full interactivity. I chose to make this a web app using JavaScript, as it can run in a web browser and manipulate objects in the app without having to reload the page. However, I wanted to see if I could implement dynamic functionality without the use of external libraries such as React. I decided this firstly for my own learning and secondly because I felt it would have added unneeded complexity for a project of this size. However, I did decide to incorporate TypeScript into the project for its powerful type safety.

The project adheres to the Model-View-Controller and Publish-Subscribe patterns. MVC allows for a nice separation of concerns, resulting in cleaner code. Additionally, the Publish-Subscribe pattern lets objects receive messages to allow them to respond in real-time while keeping things loosely coupled.

The pathfinding squares are drawn simply using an SVG object, where the squares can be drawn as rectangles. The app uses incremental rendering, where the find-path animation plays before the full path has been found.

## Installation

Make sure [TypeScript](https://www.typescriptlang.org/download) is installed.

Clone the project

```sh
git clone https://github.com/liam-e/pathfinding-visualiser.git
cd pathfinding-visualiser/
```

Run the TypeScript compiler

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
