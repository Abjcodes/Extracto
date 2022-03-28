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