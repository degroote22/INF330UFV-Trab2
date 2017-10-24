import { arraysEqual } from "./helpers";

type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

type TNode = {
  board: Board;
  children: TNode[];
  father?: TNode;
};

type Solution = {
  length: number;
  finalBoard: Board;
  steps: Board[];
};

const makeChildrenMoving = (node: TNode, from: Cell, to: Cell): TNode => {
  const board = node.board;
  const newBoard = board.slice() as Board;
  const aux = newBoard[from];
  newBoard[from] = newBoard[to];
  newBoard[to] = aux;
  return { board: newBoard, children: [], father: node };
};

const getChildren = (node: TNode, restriction: boolean): TNode[] => {
  // get all possible children
  const indexOfEmpty = node.board.indexOf(0);
  let children: TNode[] = [];
  if (indexOfEmpty === 4) {
    // Centro
    children = [
      makeChildrenMoving(node, 1, 4),
      makeChildrenMoving(node, 3, 4),
      makeChildrenMoving(node, 5, 4),
      makeChildrenMoving(node, 7, 4)
    ];
  } else if (indexOfEmpty % 2 === 0) {
    //cantos
    if (indexOfEmpty === 0) {
      // Canto esquerdo superior
      children = [
        makeChildrenMoving(node, 1, 0),
        makeChildrenMoving(node, 3, 0)
      ];
    } else if (indexOfEmpty === 2) {
      // Canto direito superior
      children = [
        makeChildrenMoving(node, 1, 2),
        makeChildrenMoving(node, 5, 2)
      ];
    } else if (indexOfEmpty === 6) {
      // Canto esquerdo inferior
      children = [
        makeChildrenMoving(node, 3, 6),
        makeChildrenMoving(node, 7, 6)
      ];
    } else if (indexOfEmpty === 8) {
      // Canto direito inferior
      children = [
        makeChildrenMoving(node, 5, 8),
        makeChildrenMoving(node, 7, 8)
      ];
    }
  } else {
    //cima, baixo, esquerda, direita
    if (indexOfEmpty === 1) {
      // Cima
      children = [
        makeChildrenMoving(node, 0, 1),
        makeChildrenMoving(node, 2, 1),
        makeChildrenMoving(node, 4, 1)
      ];
    } else if (indexOfEmpty === 3) {
      // Esquerda
      children = [
        makeChildrenMoving(node, 0, 3),
        makeChildrenMoving(node, 4, 3),
        makeChildrenMoving(node, 6, 3)
      ];
    } else if (indexOfEmpty === 5) {
      // Direita
      children = [
        makeChildrenMoving(node, 2, 5),
        makeChildrenMoving(node, 4, 5),
        makeChildrenMoving(node, 8, 5)
      ];
    } else if (indexOfEmpty === 7) {
      // Baixo
      children = [
        makeChildrenMoving(node, 4, 7),
        makeChildrenMoving(node, 6, 7),
        makeChildrenMoving(node, 8, 7)
      ];
    }
  }

  if (restriction) {
    // A linha nao pode somar 13
    children = children.filter(child => {
      return (
        child.board[0] + child.board[1] + child.board[2] !== 13 &&
        child.board[3] + child.board[4] + child.board[5] !== 13 &&
        child.board[6] + child.board[7] + child.board[8] !== 13
      );
    });
  }

  // Remover algum estado se esse estado é "seu pai"
  // para evitar loops.
  children = children.filter(child => {
    let n = node;
    while (n.father) {
      if (arraysEqual(n.board, child.board)) {
        return false;
      }
      n = n.father;
    }
    if (arraysEqual(n.board, child.board)) {
      return false;
    }
    return true;
  });

  return children;
};

const isSolved = (node: TNode): boolean => {
  const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  return arraysEqual(node.board, solvedBoard);
};

const makeNewSolution = (node: TNode): Solution => {
  let steps: Board[] = [];
  let n = node;
  while (n.father) {
    steps = [n.board, ...steps];
    n = n.father;
  }
  steps = [n.board, ...steps];
  return {
    length: steps.length - 1,
    finalBoard: node.board,
    steps
  };
};

const getSolution = (initialNode: TNode, restriction: boolean): Solution => {
  let queue: TNode[] = [initialNode];
  while (queue.length !== 0) {
    let node = queue.shift();
    if (!isSolved(node)) {
      //Não é solução
      node.children = getChildren(node, restriction);
      node.children.forEach(n => queue.push(n));
    } else {
      //É solução
      return makeNewSolution(node);
    }
  }
  throw Error("Solução não encontrada!");
};

const initialBoard: Board = [1, 3, 0, 4, 2, 5, 7, 8, 6];

let initialNode: TNode = {
  board: initialBoard,
  children: []
};

console.log(getSolution(initialNode, true));
