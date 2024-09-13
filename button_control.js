function clickSelectButtonSudoky() {
    document.getElementById("aboutAppMainView").style.display = 'none';
    document.getElementById("sudokuMainView").style.display = 'block';
    document.getElementById("selectButtonAboutApp").className = 'noneSelectColorButton';
    document.getElementById("selectButtonSudoky").className = 'selectColorButton';
}

function clickSelectButtonAboutApp() {
    document.getElementById("aboutAppMainView").style.display = 'block';
    document.getElementById("sudokuMainView").style.display = 'none';
    document.getElementById("selectButtonAboutApp").className = 'selectColorButton';
    document.getElementById("selectButtonSudoky").className = 'noneSelectColorButton';
}
