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

const getChildren = (node: TNode): TNode[] => {
  // get all possible children
  const indexOfEmpty = node.board.indexOf(0);
  // if (
  //   indexOfEmpty === 0 ||
  //   indexOfEmpty === 2 ||
  //   indexOfEmpty === 6 ||
  //   indexOfEmpty === 8
  // ) {
  //   //nos cantos
  // }

  // if (
  //   indexOfEmpty === 1 ||
  //   indexOfEmpty === 3 ||
  //   indexOfEmpty === 5 ||
  //   indexOfEmpty === 7
  // ) {
  // }
  let children: TNode[] = [];
  if (indexOfEmpty === 4) {
    //meio
  } else if (indexOfEmpty % 2 === 0) {
    //cantos
  } else {
    //cima, baixo, esquerda, direita
  }

  // remove any if it is a father
  return children;
};

const isSolved = (node: TNode): boolean => {
  const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  return arraysEqual(node.board, solvedBoard);
};

const getSolutionLength = (node: TNode): number => {
  let l = 1;
  let n = node;
  while (n.father) {
    l++;
    n = n.father;
  }
  return l;
};

const makeNewSolution = (node: TNode, length: number): Solution => {
  let steps: Board[] = [];
  let n = node;
  while (n.father) {
    steps = [n.board, ...steps];
    n = n.father;
  }
  steps = [n.board, ...steps];
  return {
    length,
    finalBoard: node.board,
    steps
  };
};

const initialBoard: Board = [1, 3, 0, 4, 2, 5, 6, 8, 6];

let initialNode: TNode = {
  board: initialBoard,
  children: []
};

let queue: TNode[] = [initialNode];

let solution: Solution = {
  length: 0,
  finalBoard: initialBoard,
  steps: []
};

while (queue.length !== 0) {
  let node = queue.shift();
  if (!isSolved(node)) {
    //Não é solução
    node.children = getChildren(node);
    node.children.forEach(n => queue.push(n));
  } else {
    //É solução
    const newSolutionLength = getSolutionLength(node);
    if (newSolutionLength < solution.length || solution.length === 0) {
      solution = makeNewSolution(node, newSolutionLength);
    }
  }
}

console.log(solution);
