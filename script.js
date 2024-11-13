const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()-_=+[]{}\\|;:",./<>';
const copyMsg = document.querySelector("[data-copyMsg]");

// default value :
let pass = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// starting mea circle color grey hai 
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setindicator(color) {
    indicator.style.backgroundColor = color;
    // shadow add karna hea yaha par
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123)); // Use getRndInteger to get a random lowercase letter
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91)); // Use getRndInteger to get a random uppercase letter
}

// symbols keliye 
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}   

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // Check if the relevant checkboxes are checked
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    // Use the global passwordLength directly
    if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 8) {
        setindicator("#0f0"); // Green for strong
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setindicator("#ff0"); // Yellow for medium
    } else {
        setindicator("#f00"); // Red for weak
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
   
    copyMsg.classList.add("active");

    setTimeout(() => { 
        copyMsg.classList.remove("active");
    }, 2000);
}

// fisher yates method
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap array[i] with array[j]
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++; // Correct the increment here
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox) => { // Changed this line
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    // no password generate as no option selected
    if (checkCount == 0) 
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // lets start joruney to generate a new password
    // remove old password
    console.log("Starting the Journey");

    password = "";

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }

    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }

    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }

    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for (i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory Addition Done");

    // remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex: " + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining Addition Done");

    // shuffle the password 
    password = shufflePassword(Array.from(password));
    console.log("Shuffling Done");
    
    // show in ui
    passwordDisplay.value = password;
    console.log("UI Addition Done");

    // calculate strength (color)
    calcStrength();
});
