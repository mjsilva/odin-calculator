const allClear = () => {
  document.querySelector(".results").innerHTML = "";
  document.querySelector(".operation").innerHTML = "";
};

const clearLastDigit = () => {
  const el = document.querySelector(".results");
  el.innerHTML = el.innerHTML.substring(0, el.innerHTML.length - 1);
};
const handleNumberKeys = (number) => {
  const el = document.querySelector(".results");
  el.innerHTML += number;
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
  }
  console.log(e.currentTarget.innerHTML);
};
[...document.querySelectorAll(".key")].forEach((el) => {
  el.addEventListener("click", handleKeyClick);
});
