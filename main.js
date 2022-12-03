const OPERATION_ADDITION_SYMBOL = "+";
const OPERATION_SUBTRACTION_SYMBOL = "-";
const OPERATION_MULTIPLICATION_SYMBOL = "×";
const OPERATION_DIVISION_SYMBOL = "÷";
const MATHS_OPERATIONS = [
  OPERATION_ADDITION_SYMBOL,
  OPERATION_SUBTRACTION_SYMBOL,
  OPERATION_MULTIPLICATION_SYMBOL,
  OPERATION_DIVISION_SYMBOL,
];
const MATHS_OPERATIONS_PRIORITY = [
  OPERATION_MULTIPLICATION_SYMBOL,
  OPERATION_DIVISION_SYMBOL,
];

let operationsStack = [];

const calculate = (localOperationsStack) => {
  for (const [index, value] of localOperationsStack.entries()) {
    if (!MATHS_OPERATIONS.includes(value)) {
      continue;
    }

    // if this operation is not a priority operation and there's still
    // some priority operations in localOperationsStack move on
    if (
      localOperationsStack.some((v) => MATHS_OPERATIONS_PRIORITY.includes(v)) &&
      !MATHS_OPERATIONS_PRIORITY.includes(value)
    ) {
      continue;
    }

    const operationResult = calculateOperation(
      localOperationsStack[index - 1],
      localOperationsStack[index + 1],
      value
    );

    // index - 1 because we want the splice to start from the value before operation
    // example if we have ["2", "+", "5"] we want the splice to start from "2" not "+"
    localOperationsStack.splice(index - 1, 3, operationResult);
    break;
  }

  if (localOperationsStack.length > 1) {
    calculate(localOperationsStack);
  }

  return localOperationsStack;
};

const calculateOperation = (num1, num2, operation) => {
  switch (operation) {
    case OPERATION_MULTIPLICATION_SYMBOL:
      return +num1 * +num2;
    case OPERATION_DIVISION_SYMBOL:
      return +num1 / +num2;
    case OPERATION_ADDITION_SYMBOL:
      return +num1 + +num2;
    case OPERATION_SUBTRACTION_SYMBOL:
      return +num1 - +num2;
  }
};

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

const allClear = () => {
  document.querySelector(".operation").innerHTML = "";
  document.querySelector(".result").innerHTML = "";
  operationsStack = [];
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
    case keyValue === "=":
      calculate(operationsStack);
      break;
  }
  console.log("e.currentTarget.innerHTML", e.currentTarget.innerHTML);
};
[...document.querySelectorAll(".key")].forEach((el) => {
  el.addEventListener("click", handleKeyClick);
});
