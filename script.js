const BASE_URL = "https://api.frankfurter.app/latest?";
const CURRENCY_LIST = "https://api.frankfurter.app/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const reset = document.querySelector("#reset");

let currencyOptions = async () => {
let res = await fetch(CURRENCY_LIST);
let allData = await res.json();
console.log(allData);
let countryCodes = Object.keys(allData);
console.log(countryCodes);

for(let select of dropdowns) {
   for(currCode of countryCodes) {
   let newOption = document.createElement("option");
   newOption.innerText = currCode;
   newOption.value = currCode;
   if(select.name === "from" && currCode === "USD") {
    newOption.selected = "selected";
   } else if(select.name === "to" && currCode === "INR") {
    newOption.selected = "selected";
   }
   select.append(newOption);
}
select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
});
}
}
currencyOptions();

const  updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if(amtVal === "" || amtVal < 1){
        amtVal = 1;
        amount.value = "1";
    }
    if(isNaN(amtVal)){
        alert("Invalid Input!");
    }
reset.addEventListener("click", () => {
    amtVal = ""; 
})
    let finalAmount;
    try{
    const URL = `${BASE_URL}from=${fromCurr.value}&to=${toCurr.value}`;
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data.rates[toCurr.value];
    console.log(data);
    finalAmount = (amtVal*rate).toFixed(2);

    } catch(err) {
        let res1 = await fetch(`${BASE_URL}from=USD&to=${fromCurr.value}`);
        let data1 = await res1.json();
        let usdToFrom = data1.rates[fromCurr.value];
        let fromToUSD = 1/usdToFrom;

        
        let res2 = await fetch(`${BASE_URL}from=USD&to=${toCurr.value}`);
        let data2 = await res2.json();
        let usdToTarget = data1.rates[toCurr.value];
        console.log(usdToTarget);
        
        
        finalAmount = (amtVal*fromToUSD*usdToTarget).toFixed(2);

    }
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
});
