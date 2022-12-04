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

let globalOperationsStack = [];

const calculate = (operationStack) => {
  // clone operationStack to avoid mutation
  const localOperationsStack = [...operationStack];

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
    return calculate(localOperationsStack);
  }

  // return the remaining value
  return localOperationsStack.pop();
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

const processCalculatorLogic = (userInputValue) => {
  // no more than one operation symbol
  // if an operation symbol already exists replace the last one
  const lastValue = globalOperationsStack.slice(-1)[0];
  const currentValueIsAnOperation = MATHS_OPERATIONS.includes(userInputValue);
  const lastValueWasAnOperation = MATHS_OPERATIONS.includes(lastValue);
  let valueToInsert = userInputValue;

  // REPLACE SYMBOL IF PREVIOUS EXISTS
  // remove last value and replace it with the new one if
  // last value is an operation symbol
  // example: if a user previously clicked on "+" and then on "*"
  // "+" should be replaced by "*"
  if (lastValueWasAnOperation && currentValueIsAnOperation) {
    globalOperationsStack.pop();
    valueToInsert = userInputValue;
  }
  // APPEND NUMBER TO STACK
  // if value is a number and last value was a number too instead of adding
  // a new index on the array just append the new number to old number
  else if (!lastValueWasAnOperation && !currentValueIsAnOperation) {
    valueToInsert = globalOperationsStack.length
      ? globalOperationsStack.pop() + userInputValue
      : userInputValue;
  }

  updateOperationsStackAndVisor(valueToInsert);
  if (
    globalOperationsStack.length > 1 &&
    globalOperationsStack.length % 2 !== 0
  ) {
    updateResultVisor(calculate(globalOperationsStack));
  }
};

const updateResultVisor = (value) => {
  const el = document.querySelector(".result");
  el.innerHTML = value;
};

const updateOperationsStackAndVisor = (value) => {
  globalOperationsStack.push(value);
  updateVisorResultsElementBaseOnOperationStack();
};

const updateVisorResultsElementBaseOnOperationStack = () => {
  const el = document.querySelector(".operation");
  el.innerHTML = globalOperationsStack.join("");
};

const allClear = () => {
  document.querySelector(".operation").innerHTML = "";
  document.querySelector(".result").innerHTML = "";
  globalOperationsStack = [];
};

const clearLastDigit = () => {
  const el = document.querySelector(".operation");
  if (!el.innerHTML.length) {
    return;
  }
  el.innerHTML = el.innerHTML.substring(0, el.innerHTML.length - 1);

  const lastValue = globalOperationsStack.pop();
  const lastValueMinusLastChar = lastValue.substring(0, lastValue.length - 1);

  if (lastValueMinusLastChar) {
    globalOperationsStack.push(lastValueMinusLastChar);
    updateResultVisor(calculate(globalOperationsStack));
  }
};

// even binding
const handleKeyClick = (e) => {
  e.stopPropagation();
  const keyValue = e.currentTarget.innerHTML;

  if (!keyValue) {
    return;
  }

  switch (true) {
    case keyValue === "AC":
      allClear();
      break;
    case keyValue === "⌫":
      clearLastDigit();
      break;
    case keyValue === "=":
      const val = calculate(globalOperationsStack);
      allClear();
      updateOperationsStackAndVisor(val);
      break;
    default:
      processCalculatorLogic(keyValue);
  }
};
[...document.querySelectorAll(".key")].forEach((el) => {
  el.addEventListener("click", handleKeyClick);
});
