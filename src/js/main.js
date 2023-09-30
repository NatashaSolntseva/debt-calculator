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
  const datePickerInput = document.getElementById("datePicker");
  const today = new Date();
  const threeMonthsFromToday = new Date(today);

  function updateSliderProgress(slider) {
    const maxVal = slider.getAttribute("max");
    const minVal = slider.getAttribute("min");
    const val = ((slider.value - minVal) / (maxVal - minVal)) * 100 + "%";
    return val;
  }

  function formatCurrency(value) {
    return parseFloat(value).toLocaleString("en-US", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    });
  }

  function updateValueElements() {
    const formattedBorrowValue = formatCurrency(borrowValue.value);

    outputTerm.innerHTML = termValue.value;
    outputValue.innerHTML = formattedBorrowValue;
    borrowingSum.innerHTML = formattedBorrowValue;

    const formattedMonthlyPayment = formatCurrency(calculateMonthlyPayment());
    const formattedToRepay = formatCurrency(calculateToRepay());

    monthlyPayment.textContent = formattedMonthlyPayment;
    toRepayElement.textContent = formattedToRepay;
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
    threeMonthsFromToday.setMonth(today.getMonth() + 3);
    const selectedDate = new Date(datePickerInput.value);
    if (selectedDate > threeMonthsFromToday) {
      basePercent += 1.85;
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

    return monthlyPaymentAmount.toFixed(2);
  }

  function calculateToRepay() {
    const monthlyPaymentValue = parseFloat(
      monthlyPayment.textContent.replace("£", "").replace(",", "")
    );
    const numberOfMonths = parseFloat(termValue.value * 12);
    const toRepay = monthlyPaymentValue * numberOfMonths;

    return toRepay.toFixed(2);
  }

  function setDefaultPercent() {
    percentText.textContent = (calculatePercent() * 100).toFixed(2) + "%";
  }

  function updateMonthlyPayment() {
    monthlyPayment.textContent = formatCurrency(calculateMonthlyPayment());
  }

  function updateToRepay() {
    toRepayElement.textContent = formatCurrency(calculateToRepay());
  }

  function handleRadioChange() {
    setDefaultPercent();
    updateMonthlyPayment();
    updateToRepay();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const borrowValueData = borrowValue.value;
    const termValueData = termValue.value;
    const datePickerData = datePickerInput.value;
    const depositRadioData = depositRadio.checked;
    const cashRadioData = cashRadio.checked;

    const formData = {
      borrowValue: borrowValueData,
      termValue: termValueData,
      datePicker: datePickerData,
      depositRadio: depositRadioData,
      cashRadio: cashRadioData,
    };

    console.log("Form Data:", formData);
  }

  const form = document.querySelector(".form");
  form.addEventListener("submit", handleSubmit);

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

  // Add an input event listener to the datePickerInput to calculate percent
  datePickerInput.addEventListener("input", () => {
    setDefaultPercent();
  });

  flatpickr(".flatpickr", {
    wrap: true,
    defaultDate: "today",
    minDate: "today",
    disableMobile: "true",
  });
});
