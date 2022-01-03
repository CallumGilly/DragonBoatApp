let lastClickedSide = null;
let lastClickedRow = null;
let previouslyClicked = false;
function boxClicked(boxSide, boxIndex) {
  if (previouslyClicked) {
    if (boxIndex !== lastClickedRow || boxSide !== lastClickedRow) {

      const options = {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "pos1Row": lastClickedRow, "pos1Side": lastClickedSide, "pos2Row": boxIndex, "pos2Side": boxSide, "boat": boat })
      }

      fetch(window.location.href + "&type=swap", options)
        .then(response => {
          console.log(response);
          return response.json();
        }).then(data => {
          // Work with JSON data here
          if (data.swapStatus = "OK") {
            window.location.reload();
          }
        }).catch(err => {
          // Do something for an error here
          console.log("Error Reading data " + err);
        });
        lastClickedRow = null;
        lastClickedSide = null;
        previouslyClicked = false;
}
    } else {
  lastClickedSide = boxSide;
  lastClickedRow = boxIndex;
  previouslyClicked = true;
}
}