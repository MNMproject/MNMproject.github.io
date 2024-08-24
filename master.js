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
let masiveSudoku;
let tempCell;
let mistake = false;
let mistakeCount;
let maxMistake;
let masQuantityAllNumbers;
let checkWinner;
let masIntForChange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let masLatinLettersForChange = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
let masCyrillicLettersForChange = ['', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З'];
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
    cleanCell("containerSudoku");
    cleanCell("blockNumber");
    document.getElementById("mistakeBlock").style.display = 'block';
    document.getElementById("showMistakeCount").textContent = mistakeCount;
    document.getElementById("showMaxMistakeCount").textContent = maxMistake;
    masiveSudoku = sudoku.getMas(sudoku);
    getQuantityAllNumbers();
    getSelectSudoku(document.getElementById("sudokuSelector").value);
    document.getElementById("subokuBlock").style.display = 'block';
}

function cleanCell(params) {
    while (document.getElementById(params).firstChild) {
        document.getElementById(params).removeChild(document.getElementById(params).firstChild);
    }
}

function getSelectSudoku(params) {
    switch (params) {
        case "numbers":
            sudokuCreater(masiveSudoku[0]);
            createNumberBlock(masIntForChange);
            break;

        case "cyrillicLetters":
            invertMassiv(masiveSudoku, masCyrillicLettersForChange);
            sudokuCreater(masiveSudoku[0]);
            createNumberBlock(masCyrillicLettersForChange);
            break;

        case "latinLetters":
            invertMassiv(masiveSudoku, masLatinLettersForChange);
            sudokuCreater(masiveSudoku[0]);
            createNumberBlock(masLatinLettersForChange);
            break;
    }

}

function invertMassiv(mas, letterMassiv) {
    invertInLetterMasive(mas[0], letterMassiv);
    invertInLetterMasive(mas[1], letterMassiv);
}

function invertInLetterMasive(mas, letterMassiv) {
    mas.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            mas[rowIndex][columnIndex] = letterMassiv[cell];
        });
    });
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
    masiveSudoku[0].forEach((row) => {
        row.forEach((cell) => {
            if (cell != 0) {
                masQuantityAllNumbers[cell - 1] -= 1;
            }
        });
    });
}

function createNumberBlock(mas) {
    for (i = 1; i < size + 1; i++) {
        if (masQuantityAllNumbers[i - 1] > 0) {
            const topElement = document.createElement('div');
            topElement.classList.add('cell_number_top');
            topElement.id = "cell_number_top" + i;
            topElement.textContent = masQuantityAllNumbers[i - 1];
            const bottomElement = document.createElement('div');
            bottomElement.classList.add('cell_number_bottom');
            bottomElement.id = i + "cell_number_bottom";
            bottomElement.textContent = mas[i];
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

function createLetterBlock(mas) {
    for (i = 1; i < size + 1; i++) {
        if (masQuantityAllNumbers[i - 1] > 0) {
            const topElement = document.createElement('div');
            topElement.classList.add('cell_number_top');
            topElement.id = "cell_number_top" + i;
            topElement.textContent = masQuantityAllNumbers[i - 1];
            const bottomElement = document.createElement('div');
            bottomElement.classList.add('cell_number_bottom');
            bottomElement.id = i + "cell_number_bottom";
            bottomElement.textContent = mas[i];
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
        if (tempCell != null && e.target != tempCell) { tempCell.style.backgroundColor = rootStyles.getPropertyValue('--color-main-cell'); }
        tempCell = e.target;
        checkNumberForMatch(tempCell);
    }
    if (e.target.className == "cell_number_bottom" && tempCell != null && tempCell.textContent == "") {
        tempCell.textContent = e.target.textContent;
        mistake = checkCorrectAnswer(tempCell, e.target);
    }
})

function checkCorrectAnswer(cell, number) {
    if (masiveSudoku[1][cell.getAttribute("ID_Cell")[0]][cell.getAttribute("ID_Cell")[1]] != cell.textContent) {
        cell.style.backgroundColor = rootStyles.getPropertyValue('--color-mistake');
        mistakeCount++;
        document.getElementById("showMistakeCount").textContent = mistakeCount;
        return true;
    } else {
        masiveSudoku[0][cell.getAttribute("ID_Cell")[0]][cell.getAttribute("ID_Cell")[1]] = cell.textContent;
        cell.style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect');
        document.getElementById("cell_number_top" + number.id[0]).textContent = masQuantityAllNumbers[number.id[0] - 1] - 1;
        masQuantityAllNumbers[number.id[0] - 1] = masQuantityAllNumbers[number.id[0] - 1] - 1;
        if (masQuantityAllNumbers[number.id[0] - 1] == 0) {
            document.getElementById("cell_number_block" + number.id[0]).style.display = 'none';
            checkWinner--;
        }
        checkNumberForMatch(cell);
        if (checkAllFillHorizontal(cell) == size) {
            successIlluminationHorizontal(cell);
        }
        if (checkAllFillVertical(cell) == size) {
            successIlluminationVertical(cell);
        }
        if (checkWinner == 0) {
            winnerllumination();
            document.getElementById("winnerBlock").style.display = 'block';
        }
        return false;
    }
}

function checkNumberForMatch(params) {
    masiveSudoku[0].forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            document.getElementById(rowIndex + "" + columnIndex).style.backgroundColor = rootStyles.getPropertyValue('--color-main-cell');
            if (cell == params.textContent && params.textContent != "") {
                document.getElementById(rowIndex + "" + columnIndex).style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect');
            } else if (params.textContent == "") {
                document.getElementById(params.getAttribute("ID_Cell")[0] + ""
                    + params.getAttribute("ID_Cell")[1]).style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect');
            }
        });
    });
}

function checkAllFillHorizontal(params) {
    let count = 0;
    masiveSudoku[0][params.getAttribute("ID_Cell")[0]].forEach((cell) => {
        if (cell != 0) {
            count++;
        }
    });
    return count;
}

function checkAllFillVertical(params) {
    let count = 0;
    masiveSudoku[0].forEach((row) => {
        if (row[params.getAttribute("ID_Cell")[1]] != 0) {
            count++;
        }
    });
    return count;
}

function successIlluminationHorizontal(params) {
    for (let i = 0; i < size; i++) {
        document.getElementById(params.getAttribute("ID_Cell")[0] + i).style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect');
    }
}

function successIlluminationVertical(params) {
    for (let i = 0; i < size; i++) {
        document.getElementById(i + params.getAttribute("ID_Cell")[1]).style.backgroundColor = rootStyles.getPropertyValue('--color-for-slect');
    }
}

function winnerllumination() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            document.getElementById(i + "" + j).style.backgroundColor = rootStyles.getPropertyValue('--color-winner');
        }
    }
}
