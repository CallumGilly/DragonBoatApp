let lastClickedSide = null;
let lastClickedRow = null;
let previouslyClicked = false;
function boxClicked(boxSide,boxIndex) {
    console.log(boxIndex + boxSide)
    if (previouslyClicked) {

    } else {
        lastClickedSide = boxSide;
        lastClickedRow = boxIndex;
    }
}