"use strict";
import "../styles/index.scss";

import {arrayForInputs, tarifs} from "../scripts/constants";
import {
    generateCheckbox,
    generateHTML,
    getTotal,
    generateTransaction,
    generateTitle,
} from "../scripts/generators";

// CONTAINERS FOR DATA
let payments = [];
let payment = {};
console.log("payments->", payments);

// LEFT ASIDE
const companies = document.getElementById("companies");
const meters = document.getElementById("meters");

// PAYMENTS
const previousPayment = document.getElementById("previous");
const paymentOnDate = document.getElementById("payment");
const currentPayment = document.getElementById("current");
const paymentsUL = document.querySelector(".form__summary-list"); //insertAdjacentHTML

// FOR SAVED PAYMENTS
const containerSavedPayments = document.getElementById("payments");
const checkboxSavedPayments = containerSavedPayments.getElementsByTagName(
    "input"
); //HTML Collection -- insertAdjacentHTML

// TRANSACTIONS
const containerTransactions = document.querySelector(".transactions__list"); //insertAdjacentHTML

// BUTTONS
const savePaymentBtn = document.getElementById("btn-save-payment");
const resetPaymentBtn = document.getElementById("btn-reset-payments");
const payBtn = document.getElementById("btn-pay");

getPaymentsFromLocalStrg();

companies.onclick = (event) => {
    const childrenContainer = companies.querySelectorAll("div");

    if (
        event.target.classList.contains("left__company") ||
        event.target.classList.contains("taxes") ||
        event.target.classList.contains("left__company-desc")
    ) {
        childrenContainer.forEach(
            (element) => (element.style.backgroundColor = "transparent")
        );

        const id = event.target.dataset.id;
        const element = document.querySelector(`[data-id=${id}]`);

        element.style = "background-color: orange;";
        payment.id = id;
    } else {
        childrenContainer.forEach(
            (element) => (element.style.backgroundColor = "transparent")
        );
    }
};

savePaymentBtn.onclick = (event) => {
    //console.log('savePaymentBtn->', savePaymentBtn);

    event.preventDefault();

    if (
        payment.id &&
        payment.current &&
        payment.previous &&
        payment.current - payment.previous >= 0
    ) {
        payment.meterId = meters.value;
        payment.amount = Number(
            (payment.current - payment.previous) *
            tarifs[payment.id]
        );

        payments.push(Object.assign({}, payment));
        showTotal();
        showCheckboxes();
        clearPaymentProps();

        previousPayment.value = "";
        paymentOnDate.value = "";
        currentPayment.value = "";
    }

    checkboxSavedPayments.forEach((el) => {
        // console.log('checkboxSavedPayments->', checkboxSavedPayments);

        if (el.name === payment.id) {
            el.checked = true;
        }
        return el;
    });

    saveToLocalStorage();
};

resetPaymentBtn.onclick = () => {
    //console.log('resetPaymentBtn->', resetPaymentBtn);

    getCheckedInputs();
    clearPaymentProps();
    payments.length = 0;
    paymentsUL.innerHTML = null;
    containerSavedPayments.innerHTML = null;
    containerTransactions.innerHTML = null;
    removeFromLocalStorage();
};

previousPayment.onchange = (event) => {
    setEventValue("previous",event);
};

paymentOnDate.onchange = (event) => {
    setEventValue("OnDate",event);
};

currentPayment.onchange = (event) => {
    setEventValue("current",event);
};

payBtn.onclick = (event) => {
    //console.log('payBtn->', payBtn);

    event.preventDefault();

    if (payments.length) {
        const arrWithCheckedInputs = getCheckedInputs();
        //console.log('arrWithCheckedInputs->', arrWithCheckedInputs);

        const arrForPay = payments.filter((el) =>
            arrWithCheckedInputs.includes(el.id)
        );
        //console.log('arrForPay->', arrForPay);

        payments = payments.filter((el) => !arrWithCheckedInputs.includes(el.id));
        console.log("payments->", payments);

        if (arrForPay.length) {
            (function () {
                for (let el in arrForPay) {
                    setTimeout(() => {
                        console.log(`${arrForPay[el].id.toUpperCase()} Payment paid`);
                        showTransactions(arrForPay[el].id.toUpperCase());
                    }, (Number(el) + 1) * 1000);
                }
            })();
        }
        showTotal();
        showCheckboxes();
    }
    saveToLocalStorage();
};

function clearPaymentProps() {
    payment.current = "";
    payment.previous = "";
    payment.amount = "";
};

function setEventValue(name,e) {
    payment[name] = Number(e.target.value);
}

function showTotal() {
    paymentsUL.innerHTML = null;
    let paymentsHTML = payments.map((item) => generateHTML(item)).join("");


    const total = payments.reduce((prev, acum) => prev + acum.amount, 0);

    paymentsHTML += getTotal(total.toFixed(2));

    paymentsUL.insertAdjacentHTML("afterbegin", paymentsHTML); //  paymentsUL
}

function showCheckboxes() {
    const filteredArr = arrayForInputs.filter((baseEl) =>
        payments.some((crossEl) => crossEl["id"] === baseEl["name"])
    );
    //console.log('filteredArr->', filteredArr);

    const checkBoxesHTML = filteredArr.map((el) => generateCheckbox(el)).join("");

    containerSavedPayments.innerHTML = null;
    containerSavedPayments.insertAdjacentHTML("afterbegin", checkBoxesHTML); //containerSavedPayments
}

function getCheckedInputs() {
    const arrInputs = Array.from(checkboxSavedPayments);

    const arrCheckedInputs=[];
    arrInputs.forEach((el) => {

        if (el.checked) {
           arrCheckedInputs.push(el.name);
        }
    });
    
    return arrCheckedInputs;
}

function showTransactions(name) {
    const transactionHTML = generateTransaction(name);

    containerTransactions.insertAdjacentHTML("afterbegin", transactionHTML); // containerTransactions
}

// LOCAL STORAGE
function getPaymentsFromLocalStrg() {
    const dataFromLocalSt = JSON.parse(localStorage.getItem("payments"));

    if (dataFromLocalSt && dataFromLocalSt.length) {
        payments = dataFromLocalSt;
        showTotal();
        showCheckboxes();
    }
}

function saveToLocalStorage() {
    localStorage.setItem("payments", JSON.stringify(payments));
}

function removeFromLocalStorage() {
    localStorage.removeItem("payments");
}
