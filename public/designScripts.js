let lastClickedSide = null;
let lastClickedRow = null;
let previouslyClicked = false;
function boxClicked(boxSide,boxIndex) {
    if (previouslyClicked) {
        if (boxIndex !== lastClickedRow || boxSide !== lastClickedRow) {
            // var x=new XMLHttpRequest();
            // x.open("patch", "/boatDesignSwap");
            // x.send({"pos1Row": lastClickedRow, "pos1Side": lastClickedSide, "pos2Row": boxIndex, "pos2Side": boxSide});

            const options = { 
                method: 'PATCH',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({"pos1Row": lastClickedRow, "pos1Side": lastClickedSide, "pos2Row": boxIndex, "pos2Side": boxSide})
              }    
              
              fetch(window.location.href+"&type=swap", options)
                .then(response => {
                   if (response.ok) {
                       console.log(response.json());
                     } else {
                        throw new Error('Something went wrong ...');
                     }
                })

        }
    } else {
        lastClickedSide = boxSide;
        lastClickedRow = boxIndex;
        previouslyClicked = true;
    }
}