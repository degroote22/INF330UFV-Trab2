"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
const helpers_1 = require("./helpers");
const makeChildrenMoving = (node, from, to) => {
    // Cria-se um clone do tabuleiro
    const newBoard = node.board.slice();
    // Faz o swap
    const aux = newBoard[from];
    newBoard[from] = newBoard[to];
    newBoard[to] = aux;
    // Retorna na forma de Nodo da arvore
    return { board: newBoard, father: node };
};
const getChildren = (node, restriction) => {
    const indexOfEmpty = node.board.indexOf(0);
    let children = [];
    if (indexOfEmpty === 4) {
        // Centro
        children = [
            makeChildrenMoving(node, 1, 4),
            makeChildrenMoving(node, 3, 4),
            makeChildrenMoving(node, 5, 4),
            makeChildrenMoving(node, 7, 4)
        ];
    }
    else if (indexOfEmpty % 2 === 0) {
        //cantos
        if (indexOfEmpty === 0) {
            // Canto esquerdo superior
            children = [
                makeChildrenMoving(node, 1, 0),
                makeChildrenMoving(node, 3, 0)
            ];
        }
        else if (indexOfEmpty === 2) {
            // Canto direito superior
            children = [
                makeChildrenMoving(node, 1, 2),
                makeChildrenMoving(node, 5, 2)
            ];
        }
        else if (indexOfEmpty === 6) {
            // Canto esquerdo inferior
            children = [
                makeChildrenMoving(node, 3, 6),
                makeChildrenMoving(node, 7, 6)
            ];
        }
        else if (indexOfEmpty === 8) {
            // Canto direito inferior
            children = [
                makeChildrenMoving(node, 5, 8),
                makeChildrenMoving(node, 7, 8)
            ];
        }
    }
    else {
        //cima, baixo, esquerda, direita
        if (indexOfEmpty === 1) {
            // Cima
            children = [
                makeChildrenMoving(node, 0, 1),
                makeChildrenMoving(node, 2, 1),
                makeChildrenMoving(node, 4, 1)
            ];
        }
        else if (indexOfEmpty === 3) {
            // Esquerda
            children = [
                makeChildrenMoving(node, 0, 3),
                makeChildrenMoving(node, 4, 3),
                makeChildrenMoving(node, 6, 3)
            ];
        }
        else if (indexOfEmpty === 5) {
            // Direita
            children = [
                makeChildrenMoving(node, 2, 5),
                makeChildrenMoving(node, 4, 5),
                makeChildrenMoving(node, 8, 5)
            ];
        }
        else if (indexOfEmpty === 7) {
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
            return (child.board[0] + child.board[1] + child.board[2] !== 13 &&
                child.board[3] + child.board[4] + child.board[5] !== 13 &&
                child.board[6] + child.board[7] + child.board[8] !== 13);
        });
    }
    // Remover algum estado se esse estado é "seu pai"
    // para evitar loops.
    children = children.filter(child => {
        let n = node;
        while (n.father) {
            if (helpers_1.arraysEqual(n.board, child.board)) {
                return false;
            }
            n = n.father;
        }
        if (helpers_1.arraysEqual(n.board, child.board)) {
            return false;
        }
        return true;
    });
    return children;
};
const isSolved = (node) => {
    // Para ver se esta solucionado fazemos uma comparacao
    // entre o array que temos e o esperado.
    const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    return helpers_1.arraysEqual(node.board, solvedBoard);
};
const makeNewSolution = (node) => {
    let steps = [];
    let n = node;
    // Enquanto houver um nodo pai adiciona-se ele a lista
    // de passos.
    while (n.father) {
        steps = [n.board, ...steps];
        n = n.father;
    }
    // O ultimo nodo nao tem pai mas precisa ser adicionado tambem.
    steps = [n.board, ...steps];
    // Retorna o valor em formato de solucao
    return {
        length: steps.length - 1,
        finalBoard: node.board,
        steps
    };
};
let attemptCount = 0;
const getSolution = (initialNode, restriction) => {
    // Um array implementa a estrutura de dados fila.
    let queue = [initialNode];
    while (queue.length !== 0) {
        // Pega o primeiro valor da fila e remove ele da fila.
        let node = queue.shift();
        attemptCount++;
        if (!isSolved(node)) {
            // Não é solução. Portanto geramos todos os nodos filhos deste nodo
            // e os colocamos no final da fila.
            getChildren(node, restriction).forEach(n => queue.push(n));
        }
        else {
            // É solução, basta seguir os Nodos pais e contar quantos ate chegar
            // no nodo inicial para saber os passos.
            return makeNewSolution(node);
        }
    }
    // Se o programa limpou a fila significa que todas as possibilidades
    // foram testadas e nenhuma serviu, portanto o problema nao tem solucao.
    throw Error("Solução não encontrada!");
};
let initialBoard;
const rl = readline.createInterface({
    input: fs.createReadStream(process.argv[2])
});
let initialTime = Date.now();
rl.on("line", (line) => {
    initialBoard = line.split(", ").map(s => parseInt(s, 10));
});
rl.on("close", () => {
    let initialNode = {
        board: initialBoard
    };
    const solution = getSolution(initialNode, true);
    console.log("Foram testadas " + attemptCount + " possibilidades.");
    console.log("Resolvido em " + solution.length + " passos.");
    console.log(solution.steps
        .map((sol, index) => index === 0
        ? "Inicio: " + JSON.stringify(sol)
        : "Passo " + index + ": " + JSON.stringify(sol))
        .join("\n"));
    console.log("Estado final: " + JSON.stringify(solution.finalBoard));
    console.log("Resolvido em " + (Date.now() - initialTime) / 1000 + " segundos.");
});
//# sourceMappingURL=index.js.map