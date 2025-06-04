import { Board, Shape } from "../node_modules/@penpot/plugin-types/index";

penpot.ui.open("Android XML Exporter", "", {
  width: 500,
  height: 600,
});

penpot.on("selectionchange", () => {
  const selection = penpot.selection;

  // Find the first selected board
  const board = selection.find((shape) => shape.type === "board");
  if (!board) {
    console.warn("No board selected");
    return;
  }

  // Get its immediate children
  const children = board.children || [];

  penpot.ui.sendMessage({
    type: "selection",
    board: board,
    children: children,
  });
});

// const boards = penpot.currentPage.findShapes({ type: "board" });

// console.log(boards);

// const board = boards[0];

// console.log(board);

// const children = board.children;

// console.log(children);

// penpot.on("selectionchange", () => {

//   penpot.ui.sendMessage({
//     type: "selection",
//     board: board,
//     children: children,
//   });
// });

// penpot.ui.sendMessage({
//   type: "selection",
//   board: board,
//   children: children,
// });
console.log("🔔 Sending selection to plugin UI...");

// const currentPage = penpot.currentPage.findShapes({ type: "board" });
// console.log(currentPage);

// const board = penpot.currentPage.findShapes({ type: "board" })[1];
// function listBoardChildren(board: Board): void {
//   console.log(
//     `Board: ${board.name} (ID: ${board.id}) has ${board.children.length} children.`
//   );

//   board.children.forEach((child, index) => {
//     console.log(`Child ${index + 1}:`);
//     console.log(`  ID: ${child.id}`);
//     console.log(`  Type: ${child.type}`);
//     console.log(`  Name: ${child.name}`);
//     console.log(`  Position: (${child.x}, ${child.y})`);
//     console.log(`  Size: ${child.width}x${child.height}`);
//   });
// }

// listBoardChildren(board);

// // send all the children of the current selection
// const selectedBoard = penpot.selection.find((s) => s.type === "board");
// if (!selectedBoard) {
//   console.error("No board selected!");
// } else {
//   const allShapes = penpot.currentPage?.findShapes() || [];

//   const getShapesInsideBoard = (board: Shape, shapes: Shape[]): Shape[] => {
//     return shapes.filter((shape) => {
//       return (
//         shape.boardX >= board.boardX &&
//         shape.boardY >= board.boardY &&
//         shape.boardX + shape.width <= board.boardX + board.width &&
//         shape.boardY + shape.height <= board.boardY + board.height
//       );
//     });
//   };

//   const shapesInBoard = getShapesInsideBoard(selectedBoard, allShapes);

//   // Send current selection once on load
//   penpot.ui.sendMessage({ type: "selection", data: shapesInBoard });
// }

// Also keep updating on changes
// penpot.on("selectionchange", () => {
//   penpot.ui.sendMessage({ type: "selection", data: penpot.selection });
// });
