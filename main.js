let operationsStack = [];
const MATHS_OPERATIONS = ["+", "-", "×", "÷"];

const allClear = () => {
  document.querySelector(".operation").innerHTML = "";
  document.querySelector(".result").innerHTML = "";
  operationsStack = [];
};

const calculateAndUpdateResult = () => {};

const processCalculatorLogic = (userOperationValue) => {
  // no more than one operation symbol
  // if an operation symbol already exists replace the last one
  const lastValue = operationsStack.slice(-1)[0];
  const currentValueIsAnOperation =
    MATHS_OPERATIONS.includes(userOperationValue);
  const lastValueWasAnOperation = MATHS_OPERATIONS.includes(lastValue);
  let valueToInsert = userOperationValue;

  // REPLACE SYMBOL IF PREVIOUS EXISTS
  // remove last value and replace it with the new one if
  // last value is an operation symbol
  // example: if a user previously clicked on "+" and then on "*"
  // "+" should be replaced by "*"
  if (lastValueWasAnOperation && currentValueIsAnOperation) {
    operationsStack.pop();
    valueToInsert = userOperationValue;
    updateOperationsStackAndVisor(valueToInsert);
    return;
  }

  // APPEND NUMBER TO STACK
  // if value is a number and last value was a number too instead of adding
  // a new index on the array just append the new number to old number
  if (!lastValueWasAnOperation && !currentValueIsAnOperation) {
    valueToInsert = operationsStack.length
      ? operationsStack.pop() + userOperationValue
      : userOperationValue;
    updateOperationsStackAndVisor(valueToInsert);
    return;
  }

  updateOperationsStackAndVisor(valueToInsert);
};

const updateOperationsStackAndVisor = (value) => {
  operationsStack.push(value);
  updateVisorResultsElementBaseOnOperationStack();
  console.log("operationsStack", operationsStack);
};

const updateVisorResultsElementBaseOnOperationStack = () => {
  const el = document.querySelector(".operation");
  el.innerHTML = operationsStack.join("");
};

const clearLastDigit = () => {
  const el = document.querySelector(".operation");
  el.innerHTML = el.innerHTML.substring(0, el.innerHTML.length - 1);
  operationsStack.pop();
};
const handleNumberKeys = (number) => {
  processCalculatorLogic(number);
};
const handleMathsOperation = (operationSymbol) => {
  processCalculatorLogic(operationSymbol);
};
// even binding
const handleKeyClick = (e) => {
  e.stopPropagation();
  const keyValue = e.currentTarget.innerHTML;
  const operation = e.currentTarget.classList.contains("operational");

  switch (true) {
    case keyValue === "AC":
      allClear();
      break;
    case keyValue === "⌫":
      clearLastDigit();
      break;
    case operation === false: // it's a number
      handleNumberKeys(keyValue);
      break;
    case MATHS_OPERATIONS.includes(keyValue): // it's mathematical operation
      handleMathsOperation(keyValue);
      break;
  }
  console.log("e.currentTarget.innerHTML", e.currentTarget.innerHTML);
};
[...document.querySelectorAll(".key")].forEach((el) => {
  el.addEventListener("click", handleKeyClick);
});
