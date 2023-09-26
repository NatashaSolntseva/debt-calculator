document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".slider");
  const outputValue = document.getElementById("value");
  const outputTerm = document.getElementById("term");
  const borrowValue = document.getElementById("borrowValue");
  const termValue = document.getElementById("termValue");
  const borrowingSum = document.getElementById("borrowing");
  const depositRadio = document.getElementById("deposit");
  const cashRadio = document.getElementById("cash");
  const percentText = document.querySelector(".form__text-percent");
  const monthlyPayment = document.querySelector(".form__sum-total");
  const toRepayElement = document.getElementById("torepay");

  function updateSliderProgress(slider) {
    const maxVal = slider.getAttribute("max");
    const minVal = slider.getAttribute("min");
    const val = ((slider.value - minVal) / (maxVal - minVal)) * 100 + "%";
    return val;
  }

  function updateValueElements() {
    const formattedValue = parseFloat(borrowValue.value).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
      }
    );

    outputTerm.innerHTML = termValue.value;
    outputValue.innerHTML = formattedValue;
    borrowingSum.innerHTML = formattedValue;
  }

  function initializeSliders() {
    sliders.forEach((sliderContainer) => {
      const slider = sliderContainer.querySelector(".slider__bar");
      const progress = sliderContainer.querySelector(".slider__progress");

      slider.addEventListener("input", () => {
        const val = updateSliderProgress(slider);
        progress.style.width = val;
      });

      customSlider(slider);
    });
  }

  function customSlider(slider) {
    const val = updateSliderProgress(slider);
    const progress = slider.parentNode.querySelector(".slider__progress");
    progress.style.width = val;
  }

  function calculatePercent() {
    let basePercent = 4.95;
    if (cashRadio.checked) {
      basePercent -= 0.5;
    }
    return basePercent / 100;
  }

  function calculateMonthlyPayment() {
    const principal = parseFloat(borrowValue.value);
    const interestRateYearly = calculatePercent();
    const interestRateMonth = interestRateYearly / 12;
    const months = parseFloat(termValue.value * 12);
    const monthlyInterest = Math.pow(1 + interestRateMonth, months);
    const monthlyPaymentAmount =
      (principal * interestRateMonth * monthlyInterest) / (monthlyInterest - 1);

    return "£" + monthlyPaymentAmount.toFixed(2);
  }

  function calculateToRepay() {
    const monthlyPaymentValue = parseFloat(
      monthlyPayment.textContent.replace("£", "").replace(",", "")
    ); // Get the value of the monthly payment and convert it to a number
    const numberOfMonths = parseFloat(termValue.value * 12);
    const toRepay = monthlyPaymentValue * numberOfMonths;

    return "£" + toRepay.toFixed(2);
  }

  function setDefaultPercent() {
    percentText.textContent = (calculatePercent() * 100).toFixed(2) + "%";
  }

  function updateMonthlyPayment() {
    monthlyPayment.textContent = calculateMonthlyPayment();
  }

  function updateToRepay() {
    toRepayElement.textContent = calculateToRepay();
  }

  function handleRadioChange() {
    setDefaultPercent();
    updateMonthlyPayment();
    updateToRepay();
  }

  // Set default values on the page
  setDefaultPercent();
  initializeSliders();
  updateValueElements();

  // Radio button state change event handlers
  depositRadio.addEventListener("change", handleRadioChange);
  cashRadio.addEventListener("change", handleRadioChange);

  // Input value change event handlers
  borrowValue.addEventListener("input", () => {
    updateValueElements();
    updateMonthlyPayment();
    updateToRepay();
  });
  termValue.addEventListener("input", () => {
    updateValueElements();
    updateMonthlyPayment();
    updateToRepay();
  });

  // Updating the monthly payment on page load
  updateMonthlyPayment();

  // Updating the total amount to repay on page load
  updateToRepay();
});
