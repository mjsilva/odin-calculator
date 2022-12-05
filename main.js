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

  // handle duplicated decimal point
  const currentValueIsDecimalPoint = userInputValue === ".";
  const lastValueContainsDecimalPoint = lastValue && lastValue.includes(".");
  if (
    currentValueIsDecimalPoint &&
    (lastValueContainsDecimalPoint || lastValueWasAnOperation)
  ) {
    return;
  }

  // REPLACE MATH SYMBOL IF PREVIOUS EXISTS
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

  // check for odd number of elements that means there's even pairs of numbers
  // with operation in the middle
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
  reduceFontSizeToFit(value, el);
};

const updateOperationsStackAndVisor = (value) => {
  globalOperationsStack.push(value);
  updateVisorResultsElementBaseOnOperationStack();
};

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getCssStyle(element, prop) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el = document.body) {
  const fontWeight = getCssStyle(el, "font-weight") || "normal";
  const fontSize = getCssStyle(el, "font-size") || "16px";
  const fontFamily = getCssStyle(el, "font-family") || "Times New Roman";

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

const reduceFontSizeToFit = (text, element, factorPercentage = 8) => {
  const textWidth = getTextWidth(element.innerHTML, getCanvasFont(element));
  const fontSize = window
    .getComputedStyle(element, null)
    .getPropertyValue("font-size");

  if (textWidth + 10 > element.offsetWidth) {
    const newFontSize =
      parseFloat(fontSize) - parseFloat(fontSize) * (factorPercentage / 100);
    element.style.fontSize = newFontSize + "px";
  }
};

const updateVisorResultsElementBaseOnOperationStack = () => {
  const el = document.querySelector(".operation");
  el.innerHTML = globalOperationsStack.join("");
  reduceFontSizeToFit(el.innerHTML, el, 20);
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
