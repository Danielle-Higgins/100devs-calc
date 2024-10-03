/**
 * creating a calculator project using OOP
 */

class Calculator {
  // private properties
  #firstNum;
  #secondNum;
  #operator;
  #answer;
  #displayValues;

  // when constructor is called we...
  constructor(displayScreen, allClear, del, decimal, equal, btns) {
    // grab the display/buttons
    this.display = document.getElementById(displayScreen);
    this.allClearBtn = document.getElementById(allClear);
    this.deleteBtn = document.getElementById(del);
    this.decimalBtn = document.getElementById(decimal);
    this.equalBtn = document.getElementById(equal);
    this.buttons = document.querySelectorAll(`.${btns}`);

    // set up initial values for the first num, second num, operator, displayValues
    this.#firstNum = "";
    this.#secondNum = "";
    this.#operator = "";
    this.#answer = 0;
    this.#displayValues = "";

    // set up event listeners
    this.allClearBtn.addEventListener("click", () => {
      this.clear();
      this.updateDisplay();
    });

    this.deleteBtn.addEventListener("click", () => {
      this.remove();
      this.updateDisplay();
    });

    this.decimalBtn.addEventListener("click", (e) => {
      this.append(e);
      this.updateDisplay();
    });

    this.equalBtn.addEventListener("click", () => {
      // pressing equal before entering any values for the numbers can cause issues
      if (this.#firstNum === "" || this.#secondNum === "") return;

      this.#answer = this.calculate(
        this.#firstNum,
        this.#operator,
        this.#secondNum
      );

      // show answer in input
      this.display.value = this.#answer;

      this.#displayValues = this.#answer;
      this.#firstNum = this.#answer; // set firstNum for future calculations
      this.#secondNum = ""; // reset
      this.#operator = ""; //reset

      this.decimalBtn.disabled = false;
    });

    this.buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.append(e);
        this.updateDisplay();
      });
    });
  }

  // set up the calculations manually

  addition(num1, num2) {
    let result = parseFloat(num1) + parseFloat(num2);
    if (result % 1 !== 0) result = result.toFixed(2);
    return result;
  }

  subtraction(num1, num2) {
    let result = parseFloat(num1) - parseFloat(num2);
    if (result % 1 !== 0) result = result.toFixed(2);
    return result;
  }

  multiplication(num1, num2) {
    let result = parseFloat(num1) * parseFloat(num2);
    if (result % 1 !== 0) result = result.toFixed(2);
    return result;
  }

  division(num1, num2) {
    let result = parseFloat(num1) / parseFloat(num2);
    // division by zero
    if (result === Infinity) {
      this.#displayValues = "Not a number";
      return;
    }
    if (result % 1 !== 0) result = result.toFixed(2);
    return result;
  }

  percent(num1, num2) {
    return num1 / 100;
  }

  // does the calculations
  calculate(num1, sign, num2) {
    let result = 0;

    switch (sign) {
      case "+":
        result = this.addition(num1, num2);
        break;
      case "-":
        result = this.subtraction(num1, num2);
        break;
      case "*":
        result = this.multiplication(num1, num2);
        break;
      case "/":
        result = this.division(num1, num2);
        break;
      case "%":
        result = this.percent(num1);
        break;
    }

    return result;
  }

  clear() {
    this.decimalBtn.disabled = false;
    this.#firstNum = "";
    this.#operator = "";
    this.#secondNum = "";
    this.#displayValues = "";
    this.#answer = 0;
  }

  // remove last character from displayValues
  remove() {
    if (this.#displayValues[this.#displayValues.length - 1] === ".")
      this.decimalBtn.disabled = false;
    this.#displayValues = this.#displayValues.slice(0, -1);
  }

  append(e) {
    this.#displayValues += e.target.textContent;
    this.updateDisplay(); // update display with new value
  }

  updateDisplay() {
    if (this.#displayValues === "") this.display.value = 0;
    else {
      this.display.value = this.#displayValues;
      const array = this.splitExpression(this.#displayValues);
      this.#firstNum = array[0];
      this.#operator = array[1];
      this.#secondNum = array[2];
    }

    const currentInput =
      this.#operator === "" ? this.#firstNum : this.#secondNum;
    if (currentInput.includes(".")) {
      this.decimalBtn.disabled = true;
    } else {
      this.decimalBtn.disabled = false;
    }
  }

  // split expression into an array of 3 elements
  splitExpression(expression) {
    let firstNumber = "";
    let operator = "";
    let secondNumber = "";
    let operatorFound = false;

    for (let char of expression) {
      if ("+-*/%".includes(char)) {
        operator = char;
        operatorFound = true;
      } else {
        if (operatorFound) {
          secondNumber += char;
        } else {
          firstNumber += char;
        }
      }
    }

    return [firstNumber, operator, secondNumber];
  }
}

// we initialize the object using the constructor, passing in the IDs
const calc = new Calculator(
  "display",
  "all-clear",
  "delete",
  "decimal",
  "equal",
  "click-buttons"
);
