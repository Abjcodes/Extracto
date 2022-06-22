document.addEventListener('DOMContentLoaded', function() {
      navigator.clipboard
                    .readText()
                    .then(
                        cliptext =>
                            (document.getElementById('clipboard-paste').innerText = cliptext),
                            err => console.log(err)
                    );
    document.getElementById("clipboard-paste").addEventListener("input", function() {
    //to implrment auto-copy
    }, false);
})
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
    document.getElementById('download').addEventListener('click',e=>{
    const txtcontent=document.getElementById('clipboard-paste').innerText;
    if(txtcontent){
        downloadFile(txtcontent);
    }
    });
};