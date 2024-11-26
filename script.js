let fields = [
  null, null, null,
  null, null, null,
  null, null, null
];

let currentPlayer = 'circle';
let scores = { circle: 0, cross: 0 };
let gameOver = false;

function init() {
  render();
  updateScore();
  gameOver = false;
}

function render() {
  const contentDiv = document.getElementById('content');
  let tableHTML = '<table>';

  for (let i = 0; i < 3; i++) {
    tableHTML += '<tr>';
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;

      if (fields[index] === 'circle') {
        tableHTML += `<td>${generateCircleSVG()}</td>`;
      } else if (fields[index] === 'cross') {
        tableHTML += `<td>${generateCrossSVG()}</td>`;
      } else {
        tableHTML += `<td onclick="handleCellClick(${index}, this)"></td>`;
      }
    }
    tableHTML += '</tr>';
  }

  tableHTML += '</table>';
  contentDiv.innerHTML = tableHTML;
  blockInputDuringGameOver();
}
function handleCellClick(index, cell) {
  if (gameOver || fields[index]) return;

  fields[index] = currentPlayer;

  if (currentPlayer === 'circle') {
    cell.innerHTML = generateCircleSVG();
  } else {
    cell.innerHTML = generateCrossSVG();
  }

  cell.onclick = null;
  currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

  checkGameOver();
  updateScore();
}

function checkGameOver() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      renderWinningLine(pattern);
      updateScore(fields[a]);
      
      gameOver = true;
      setTimeout(resetGame, 3000);

      return;
    }
  }

  if (!fields.includes(null)) {
    gameOver = true;
    setTimeout(resetGame, 3000);
  }
}

function renderWinningLine(pattern) {
  const rows = document.querySelectorAll('tr');
  const cells = Array.from(rows).flatMap(row => Array.from(row.querySelectorAll('td')));


  pattern.forEach(index => {
    cells[index].style.backgroundColor = '#fff';
  });

  const [a, b, c] = pattern;
  const lineX = (cells[a].offsetLeft + cells[c].offsetLeft + cells[b].offsetLeft) / 3;
  const lineY = (cells[a].offsetTop + cells[c].offsetTop + cells[b].offsetTop) / 3;
}

function blockInputDuringGameOver() {
  if (gameOver) {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
      cell.onclick = null;
    });
  }
}

function updateScore(winner) {
  if (winner) {
    scores[winner] += 1;
  }

  const scoreDiv = document.getElementById('score');
  scoreDiv.innerHTML = `
    <h2>Punktestand</h2>
    <p>Kreis: ${scores.circle}</p> <br>
    <p>Kreuz: ${scores.cross}</p> <br>
    <p>Aktueller Spieler: ${currentPlayer === 'circle' ? 'Kreis' : 'Kreuz'}</p>
  `;
}

function resetGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  gameOver = false;
  render();
}

function generateCircleSVG() {
  return `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="35" cy="35" r="30"
        fill="none"
        stroke="#00B0EF"
        stroke-width="5"
        stroke-dasharray="188.4" 
        stroke-dashoffset="188.4"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="188.4" 
          to="0"
          dur="400ms"
          repeatCount="1"
          fill="freeze"
        />
      </circle>
    </svg>
  `;
}

function generateCrossSVG() {
  return `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
      <line
        x1="15" y1="15" x2="55" y2="55"
        stroke="#FFC000"
        stroke-width="5"
        stroke-linecap="round"
        stroke-dasharray="56.57" 
        stroke-dashoffset="56.57"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="56.57"
          to="0"
          dur="0.125s"
          begin="0s"
          repeatCount="1"
          fill="freeze"
        />
      </line>
      <line
        x1="15" y1="55" x2="55" y2="15"
        stroke="#FFC000"
        stroke-width="5"
        stroke-linecap="round"
        stroke-dasharray="56.57"
        stroke-dashoffset="56.57"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="56.57"
          to="0"
          dur="0.125s"
          begin="0.125s"
          repeatCount="1"
          fill="freeze"
        />
      </line>
    </svg>
  `;
}

init();