class Sudoku {
    constructor(size, difficulty) {
        this.size = size;
        this.difficulty = difficulty;
        const SRNd = Math.sqrt(size);
        this.SRN = Math.floor(SRNd);
        this.sudokuMassive = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
        this.sudokuAnswerMassive = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    }

    fillValues() {
        this.fillDiagonal();
        this.fillRemaining(0, this.SRN);
        this.removeKDigits();
    }

    fillDiagonal() {
        for (let i = 0; i < this.size; i += this.SRN) {
            this.fillBox(i, i);
        }
    }

    unUsedInBox(rowStart, colStart, num) {
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                if (this.sudokuMassive[rowStart + i][colStart + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    fillBox(row, col) {
        let num = 0;
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                while (true) {
                    num = this.randomGenerator(this.size);
                    if (this.unUsedInBox(row, col, num)) {
                        break;
                    }
                }
                this.sudokuMassive[row + i][col + j] = num;
                this.sudokuAnswerMassive[row + i][col + j] = num;
            }
        }
    }

    randomGenerator(num) {
        return Math.floor(Math.random() * num + 1);
    }

    checkIfSafe(i, j, num) {
        return (
            this.unUsedInRow(i, num) &&
            this.unUsedInCol(j, num) &&
            this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num)
        );
    }

    unUsedInRow(i, num) {
        for (let j = 0; j < this.size; j++) {
            if (this.sudokuMassive[i][j] === num) {
                return false;
            }
        }
        return true;
    }

    unUsedInCol(j, num) {
        for (let i = 0; i < this.size; i++) {
            if (this.sudokuMassive[i][j] === num) {
                return false;
            }
        }
        return true;
    }

    fillRemaining(i, j) {
        if (i === this.size - 1 && j === this.size) {
            return true;
        }

        if (j === this.size) {
            i += 1;
            j = 0;
        }

        if (this.sudokuMassive[i][j] !== 0) {
            return this.fillRemaining(i, j + 1);
        }

        for (let num = 1; num <= this.size; num++) {
            if (this.checkIfSafe(i, j, num)) {
                this.sudokuMassive[i][j] = num;
                this.sudokuAnswerMassive[i][j] = num;
                if (this.fillRemaining(i, j + 1)) {
                    return true;
                }
                this.sudokuMassive[i][j] = 0;
            }
        }
        return false;
    }

    removeKDigits() {
        let count = this.difficulty;
        while (count !== 0) {
            let i = Math.floor(Math.random() * this.size);
            let j = Math.floor(Math.random() * this.size);
            if (this.sudokuMassive[i][j] !== 0) {
                count--;
                this.sudokuMassive[i][j] = 0;
            }
        }
        return;
    }

    getMas(parametr) {
        parametr.fillValues();
        return [this.sudokuMassive, this.sudokuAnswerMassive];
    }
}

const rootStyles = getComputedStyle(document.querySelector(':root'));
let size = 9;
let difficulty = 10;
let sudoku;
let tempCell;
let mistake = false;
let mistakeCount;
let maxMistake;
let masQuantityAllNumbers;
let checkWinner;

function checkCustomDifficulty() {
    difficulty = document.getElementById("customDifficulty").value;
}

function clickStartGame() {
    checkCustomDifficulty();
    masQuantityAllNumbers = [9, 9, 9, 9, 9, 9, 9, 9, 9];
    mistakeCount = 0;
    maxMistake = 3;
    checkWinner = 0
    document.getElementById("winnerBlock").style.display = 'none';
    sudoku = new Sudoku(size, difficulty);
    while (document.getElementById("containerSudoku").firstChild) {
        document.getElementById("containerSudoku").removeChild(document.getElementById("containerSudoku").firstChild);
    }
    while (document.getElementById("blockNumber").firstChild) {
        document.getElementById("blockNumber").removeChild(document.getElementById("blockNumber").firstChild);
    }
    document.getElementById("mistakeBlock").style.display = 'block';
    document.getElementById("showMistakeCount").textContent = mistakeCount;
    document.getElementById("showMaxMistakeCount").textContent = maxMistake;
    sudoku.getMas(sudoku);
    getQuantityAllNumbers();
    document.getElementById("subokuBlock").style.display = 'block';
    sudokuCreater(sudoku.sudokuMassive);
    createNumberBlock()
}

function sudokuCreater(sudokuMas) {
    sudokuMas.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        if (rowIndex == 3 || rowIndex == 6) {
            rowElement.classList.add('row_2');
        } else {
            rowElement.classList.add('row');
        }
        row.forEach((cell, columnIndex) => {
            const cellElement = document.createElement('div');
            if (columnIndex == 3 || columnIndex == 6) {
                cellElement.classList.add('cell_2');
            } else {
                cellElement.classList.add('cell');
            }
            cellElement.textContent = cell !== 0 ? cell : '';
            cellElement.id = rowIndex + "" + columnIndex;
            cellElement.setAttribute("ID_Cell", rowIndex + "" + columnIndex);
            rowElement.appendChild(cellElement);
        });
        containerSudoku.appendChild(rowElement);
    });
}

function getQuantityAllNumbers() {
    sudoku.sudokuMassive.forEach((row) => {
        row.forEach((cell) => {
            if (cell != 0) {
                masQuantityAllNumbers[cell - 1] -= 1;
            }
        });
    });
}

function createNumberBlock() {
    for (i = 1; i < 10; i++) {
        if (masQuantityAllNumbers[i - 1] > 0) {
            const topElement = document.createElement('div');
            topElement.classList.add('cell_number_top');
            topElement.id = "cell_number_top" + i;
            topElement.textContent = masQuantityAllNumbers[i - 1];
            const bottomElement = document.createElement('div');
            bottomElement.classList.add('cell_number_bottom');
            bottomElement.textContent = i;
            const element = document.createElement('div');
            element.classList.add('cell_number_block');
            element.id = "cell_number_block" + i;
            element.prepend(topElement);
            element.append(bottomElement);
            blockNumber.append(element);
            checkWinner++;
        }
    }
}

document.addEventListener("click", function (e) {
    if (mistake) {
        tempCell.textContent = "";
        mistake = false;
    }
    if (e.target.className == "cell_number_bottom" && tempCell != null && tempCell.textContent != "") {
        checkNumberForMatch(e.target);
    }
    if (e.target.className == "cell" || e.target.className == "cell_2") {
        if (tempCell != null && e.target != tempCell) {tempCell.style.backgroundColor = rootStyles.getPropertyValue('--color-main-cell');}
        tempCell = e.target;
        checkNumberForMatch(tempCell);
    }
    if (e.target.className == "cell_number_bottom" && tempCell != null && tempCell.textContent == "") {
        tempCell.textContent = e.target.textContent;
        mistake = checkCorrectAnswer(tempCell);
    }
})

function checkCorrectAnswer(params) {
    if (sudoku.sudokuAnswerMassive[params.getAttribute("ID_Cell")[0]][params.getAttribute("ID_Cell")[1]] != params.textContent) {
        params.style.backgroundColor = rootStyles.getPropertyValue('--color-mistake');
        mistakeCount++;
        document.getElementById("showMistakeCount").textContent = mistakeCount;
        return true;
    } else {
        sudoku.sudokuMassive[params.getAttribute("ID_Cell")[0]][params.getAttribute("ID_Cell")[1]] = params.textContent;
        params.style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect');
        document.getElementById("cell_number_top" + params.textContent).textContent = masQuantityAllNumbers[params.textContent - 1] - 1;
        masQuantityAllNumbers[params.textContent - 1] = masQuantityAllNumbers[params.textContent - 1] - 1;
        if (masQuantityAllNumbers[params.textContent - 1] == 0) {
            document.getElementById("cell_number_block" + params.textContent).style.display = 'none';
            checkWinner--;
        }
        checkNumberForMatch(params);
        if(checkAllFillHorizontal(params) == size){
            successIlluminationHorizontal(params);
        }
        if(checkAllFillVertical(params) == size){
            successIlluminationVertical(params);
        }
        if(checkWinner == 0){
           winnerllumination();
           document.getElementById("winnerBlock").style.display = 'block';
        }
        return false;
    }
}

function checkNumberForMatch(params) {
    sudoku.sudokuMassive.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            document.getElementById(rowIndex + "" + columnIndex).style.backgroundColor = rootStyles.getPropertyValue('--color-main-cell');
            if (cell == params.textContent && params.textContent != "") {
                document.getElementById(rowIndex + "" + columnIndex).style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect');
            } else if (params.textContent == "") { document.getElementById(params.getAttribute("ID_Cell")[0] + "" 
                + params.getAttribute("ID_Cell")[1]).style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect'); }
        });
    });
}

function checkAllFillHorizontal(params) {
    let count = 0;
    sudoku.sudokuMassive[params.getAttribute("ID_Cell")[0]].forEach((cell) => {
        if(cell != 0){
            count++;
        }
    });
    return count;
}

function checkAllFillVertical(params) {
    let count = 0;
    sudoku.sudokuMassive.forEach((row) => {
       if(row[params.getAttribute("ID_Cell")[1]] != 0){
        count++;
       }
    });
    return count;
}

function successIlluminationHorizontal(params) {
    for (let i = 0; i< size; i++) {
        document.getElementById(params.getAttribute("ID_Cell")[0]+i).style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect');
    }
}

function successIlluminationVertical(params) {
    for (let i = 0; i< size; i++) {
        document.getElementById(i+params.getAttribute("ID_Cell")[1]).style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect');
    }
}

function winnerllumination() {
    for (let i = 0; i < size; i++) {
       for (let j = 0; j < size; j++) {
        document.getElementById(i+""+j).style.backgroundColor = rootStyles.getPropertyValue('--color-winner');
       } 
    }
}
