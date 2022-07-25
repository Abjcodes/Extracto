//Inserting the text into the text editor
document.addEventListener('DOMContentLoaded', function() {
      navigator.clipboard
                    .readText()
                    .then(
                        cliptext =>
                            (document.getElementById('clipboard-paste').innerText = cliptext),
                            err => console.log(err)
                    );
    document.getElementById("clipboard-paste").addEventListener("input", function() {
    //tldr: implement auto-copy
    }, false);

let storeBtn = document.querySelector('.store_items');
let txtTitle = document.querySelector('.main-title');
let txtContent = document.querySelector('#clipboard-paste');

cardDisplay();

storeBtn.addEventListener('click', () => {
let savedText = {
        title: txtTitle.innerText,
        content: txtContent.value
    };
SaveDataToLocalStorage(savedText);

//toast msg
var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
})


let cards = document.querySelectorAll('.cards');
cards.forEach((card) => {
    card.addEventListener('click', onClick, false);
})
function onClick(e) {
    var card = e.currentTarget;
    txtTitle.innerHTML = card.querySelector('.title').innerHTML;
    txtContent.innerHTML = card.querySelector('.text-body').innerHTML;

}

let addNoteBtn = document.querySelector('.add-note-btn');
addNoteBtn.addEventListener('click', () =>{
 txtTitle.innerHTML = "Add title";
 txtContent.value = "Add text";
})



})


    /*let addButton=document.querySelector('#add-note-btn');
    addButton.addEventListener('click',()=>{
        document.getElementById('main-title').textContent="Enter Title";
        document.getElementById('clipboard-paste').textContent="Enter Title";
        console.log("Hi");

    })*/

//Setting attributes for downloading the text

//Save to localStorage code
function SaveDataToLocalStorage(data)
{
    var a = [];
    // Parse the serialized data back into an aray of objects
    a = JSON.parse(localStorage.getItem('data')) || [];
    // Push the new data (whether it be an object or anything else) onto the array
    a.push(data);
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('data', JSON.stringify(a));

    data = JSON.parse(localStorage.getItem('data'));
    cardBuilder(data.at(-1).title, data.at(-1).content);
}
//Cardbuilder function
function cardBuilder(title, content) {
    var storedData = [];
    storedData = JSON.parse(localStorage.getItem('data'));
    console.log(storedData);
    var cards = document.createElement("div");
    cards.setAttribute("class", "cards");
    var cardTitle = document.createElement("h3");
    cardTitle.setAttribute("class", "title");
    var cardCreatedTime = document.createElement("p");
    cardCreatedTime.setAttribute("class", "time");
    var cardContent = document.createElement("p");
    cardContent.setAttribute("class", "text-body");
    const delBtn = document.createElement("button");
    delBtn.textContent = "Remove";
    delBtn.setAttribute("class","delBtn")

    var today = new Date();

    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var dateTime ="Last edited: "+ date+' '+time;
    //Adding contents
    cardTitle.innerHTML = title;
    cardCreatedTime.innerHTML = dateTime;
    cardContent.innerHTML = content;
    
    //Appending elements
    cards.append(cardTitle);
    cards.append(cardCreatedTime);
    cards.append(cardContent);
    cards.append(delBtn);

    document.querySelector('.card-container').append(cards);
    delBtn.addEventListener("click", () => {
        cards.parentNode.removeChild(cards);
        storedData = storedData.filter(item => item.content != content);
        localStorage.setItem('data', JSON.stringify(storedData));
    })

}

function cardDisplay() {
    if(localStorage.getItem('data') != null) {
        data = JSON.parse(localStorage.getItem('data'));
        data.forEach((item) => {
            cardBuilder(item.title, item.content);
        })
    
    }
}
//Download button
const fname='convtxt.txt'
function downloadFile(txtcontent){
const element=document.createElement('a');
const blob=new Blob([txtcontent],{type:'plain/text'});
const fileUrl=URL.createObjectURL(blob);
element.setAttribute('href',fileUrl);
element.setAttribute('download',fname);
element.style.display='none';
document.body.appendChild(element);
element.click();
};
window.onload=()=>{
document.getElementById('download').addEventListener('click', e=>{
const txtcontent=document.getElementById('clipboard-paste').textContent;
if(txtcontent){
    downloadFile(txtcontent);
}
});
};


