const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn =document.querySelector("[data-copy]");
const copyMsg =document.querySelector("[data-copyMsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numberscheck=document.querySelector("#numbers");
const symbolscheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols ='~!@#$%^&*()_+=-{}[]|\;:/.,?><';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// console.log("working");
//set passwordLength
setIndicator("#ccc");
function handleSlider(){
    lengthDisplay.innerText=passwordLength;
    inputSlider.value=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min)) +min;
}
// console.log(getRndInteger(2,12));

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowercase()
{
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUppercase()
{
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const rand=getRndInteger(0,symbols.length);
    return symbols.charAt(rand);
}

function shufflePasssword(array){
    //Fisher yates method to shuffle array
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>{
        str=str+el;
    })
    return str;
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercasecheck.checked)
        hasUpper=true;
    if(lowercasecheck.checked)
        hasLower=true;
    if(numberscheck.checked)
        hasNum=true;
    if(symbolscheck.checked)
        hasSym=true;

    if(hasUpper && hasLower&& (hasNum || hasSym) &&passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if((hasLower|| hasUpper) && (hasNum || hasSym)&& passwordLength>=6)
    {
        setIndicator("0ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);

}

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    //special case
    // console.log("checkcount="+checkCount);
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})

//password generate krne wala function
generateBtn.addEventListener('click',()=>{
    if(checkCount <=0)
        return;
    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //creating new password
    password="";
    // console.log("starting generation function");
    // if(uppercasecheck.checked){
    //     password=password+generateUppercase();
    // }
    // if(lowercasecheck.checked){
    //     password=password+generateLowercase();
    // }
    // if(numberscheck.checked){
    //     password=password+generateRandomNumber();
    // }
    // if(symbolscheck.checked){
    //     password=password+generateSymbol();
    // }

    let funcArr=[];
    if(uppercasecheck.checked)
        funcArr.push(generateUppercase);
    if(lowercasecheck.checked)
        funcArr.push(generateLowercase);
    if(numberscheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolscheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++)
    {
        password =password+funcArr[i]();
    }
    // console.log("compusory addition done");
    //remaining addition 
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password=password+funcArr[randIndex]();
    }
    // console.log("remaining addition done");
    //shuffle the password
    password=shufflePasssword(Array.from(password));
    // console.log("shuffle done");
    //show in UI
    passwordDisplay.value=password;
    // calulating strength
    calcStrength();
    // console.log("display done");
});