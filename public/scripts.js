const { sessionToBoat } = require("../boat");

//Check if a cookie exists, hide the sign out option if it does not
if (document.cookie.substr(0,8) == "username") {
    document.getElementById(`signOut`).hidden = false;
    document.getElementById(`memberArea`).hidden = false;
    document.getElementById(`login`). hidden = true;
} else {
    document.getElementById(`signOut`).hidden = true;
    document.getElementById(`memberArea`).hidden = true;
    document.getElementById(`login`). hidden = false;
}

function signOut() {
    // Delete cookies if the sign out button is pressed
    document.cookie = "username=;expires=" + new Date(0).toUTCString();
}

function toggleWeight() {
    document.getElementById(`weight`).readOnly = !document.getElementById(`weight`).readOnly;
    document.getElementById(`weight`).required = !document.getElementById(`weight`).required;
}

function toggleMembership() {
    document.getElementById(`MembershipNumber`).readOnly = !document.getElementById(`MembershipNumber`).readOnly;
    document.getElementById(`MembershipExpiration`).readOnly = !document.getElementById(`MembershipExpiration`).readOnly;
    document.getElementById(`MembershipNumber`).required = !document.getElementById(`MembershipNumber`).required;
    document.getElementById(`MembershipExpiration`).required = !document.getElementById(`MembershipExpiration`).required;
}

function validateSignup() {
    if (document.getElementById(`password`).value !== document.getElementById(`password`).value) {return false;}
    return true;
}

function linkBoat() {
    const params = new URLSearchParams(window.location.search);
    const options = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"sessionID": params.get("sessionID"), "selectedBoat": document.forms[0].boatID.value})
      }
    
      fetch(window.location.href + "&type=setBoat", options)
        .then(response => {
          console.log("Response" + response);
          return response.json();
        }).then(data => {
          // Work with JSON data here
          console.log(data);
          if (data.setStatus = "OK") {
            window.location.reload();
          }
        }).catch(err => {
          // Do something for an error here
          console.log("Error Reading data " + err);
        });
}