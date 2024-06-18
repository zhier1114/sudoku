// 建立空盤
let board = Array.from({ length: 9 }, () => Array(9).fill(0));
let boardWithHoles = Array.from({ length: 9 }, () => Array(9).fill(0));

// 檢查數字有無符合規則
function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) {
      return false;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) {
      return false;
    }
  }
  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
}

// 生成數字
function generateNumber() {
  for (let row = 0; row < 9; row++) {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let col = 0; col < 9; col++) {
      let num;
      let validNums = nums.filter((n) => isValid(board, row, col, n));

      if (validNums.length === 0) {
        console.log("重新生成棋盤");
        board = Array.from({ length: 9 }, () => Array(9).fill(0));
        row = -1;
        break;
      }

      let randomIndex = Math.floor(Math.random() * validNums.length);
      num = validNums[randomIndex];
      board[row][col] = num;

      nums = nums.filter((n) => n !== num);
    }
  }
  //   console.log(board);
}

// 挖洞
function removeNumbers(difficulty) {
  boardWithHoles = board.slice().map((row) => row.slice());
  let holes;
  if (difficulty === "easy") {
    holes = 40; // 剩41格
  } else if (difficulty === "medium") {
    holes = 47; // 剩34格
  } else if (difficulty === "hard") {
    holes = 53; // 剩28格
  }
  while (holes > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (boardWithHoles[row][col] !== undefined) {
      boardWithHoles[row][col] = undefined;
      holes--;
    }
  }
}

// 做出9x9表格
function displayBoard() {
  let table = document.getElementById("board");
  table.innerHTML = "";
  for (let row = 0; row < 9; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 9; col++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.classList.add("inputNum");
      input.maxLength = 1;
      input.dataset.row = row;
      input.dataset.col = col;
      if (boardWithHoles[row][col] !== undefined) {
        input.value = boardWithHoles[row][col];
        input.classList.add("filled");
        input.disabled = true;
        td.appendChild(input);
      } else {
        input.classList.add("myAnswers");
      }
      td.appendChild(input);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  let inputNum = document.querySelectorAll(".inputNum");
  inputNum.forEach((input) => {
    input.addEventListener("input", () => {
      if (!/^\d$/.test(input.value)) {
        input.value = ""; // 清空非數字輸入
        return;
      }
      const row = parseInt(input.dataset.row);
      const col = parseInt(input.dataset.col);
      boardWithHoles[row][col] = parseInt(input.value);

      checkIfComplete();
    });
  });
}

// 檢查完成
function checkIfComplete() {
  let count = 0;
  let correct = false;
  let inputs = Array.from(document.querySelectorAll(".myAnswers"));
  inputs.forEach((input) => {
    if (input.value === "") {
      count++;
    }
  });
  if (count === 0) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (boardWithHoles[row][col] !== board[row][col]) {
          correct = false;
          document.getElementById("failContainer").style.display = "flex";
          setTimeout(() => {
            document.getElementById("successContainer").style.display = "none";
            document.getElementById("failContainer").style.display = "none";
          }, 3000);
          break;
        } else {
          correct = true;
        }
      }
    }
  }
  if (correct) {
    document.getElementById("successContainer").style.display = "flex";
    clearInterval(intervalId);
    document.getElementById("showTime2").innerHTML = `${time}`;
  }
}

function startGame() {
  const difficulty = document.querySelector(
    'input[name="difficulty"]:checked'
  ).value;
  document.getElementById("failContainer").style.display = "none";
  document.getElementById("successContainer").style.display = "none";
  document.getElementById("checkInfoContainer").style.display = "none";
  generateNumber();
  removeNumbers(difficulty);
  displayBoard();
  time = 0;
  document.getElementById("showTime").innerHTML = `${time}`;
  clearInterval(intervalId);
  intervalId = setInterval(timer, 1000);
}

window.onload = () => {
  startGame();
};

document.getElementById("newGame").addEventListener("click", startGame);

function checkAnswer() {
  let allCorrect = true;
  let inputs = Array.from(document.querySelectorAll(".myAnswers")).filter(
    (input) => input.value !== ""
  );
  inputs.forEach((input) => {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    if (boardWithHoles[row][col] !== board[row][col]) {
      document.getElementById("checkInfoContainer").style.display = "none";
      document.getElementById("failContainer").style.display = "flex";
      setTimeout(() => {
        document.getElementById("failContainer").style.display = "none";
      }, 3000);
      //   console.log(`Incorrect value at row ${row + 1}, col ${col + 1}`);
      allCorrect = false;
    }
  });
  if (allCorrect) {
    document.getElementById("failContainer").style.display = "none";
    document.getElementById("checkInfoContainer").style.display = "flex";
    document.getElementById("checkInfoContainer").innerHTML += "全部正確！";
    setTimeout(() => {
      document.getElementById("checkInfoContainer").style.display = "none";
      document.getElementById("checkInfoContainer").innerHTML = "";
    }, 3000);
    console.log(`全部正確`);
  }
}

document.getElementById("check").addEventListener("click", checkAnswer);

let time = 0;
let intervalId;
function timer() {
  time++;
  document.getElementById("showTime").innerHTML = time;
}
