const allClear = () => {
  document.querySelector(".results").innerHTML = "";
  document.querySelector(".operation").innerHTML = "";
};

const clearLastDigit = () => {
  const el = document.querySelector(".results");
  el.innerHTML = el.innerHTML.substring(0, el.innerHTML.length - 1);
};

// even binding
const handleKeyClick = (e) => {
  e.stopPropagation();
  switch (e.currentTarget.innerHTML) {
    case "AC":
      allClear();
      break;
    case "⌫":
      clearLastDigit();
      break;
  }
  console.log(e.currentTarget.innerHTML);
};
[...document.querySelectorAll(".key")].forEach((el) => {
  el.addEventListener("click", handleKeyClick);
});
