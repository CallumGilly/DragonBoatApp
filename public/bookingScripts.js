function sessionClicked(sessionID) {
    document.forms[0].sessionID.value = sessionID;
    document.getElementById("sessionPanel").hidden=false;
    //Get list of paddlers in that session
    const options = {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"sessionID": sessionID })
      }
      fetch(window.location.href, options)
        .then(response => {
          return response.json();
        }).then(data => {
          // Work with JSON data here
          for(var index = document.getElementById("paddlerTable").rows.length - 1; index > 0 ; index--) {
            // document.getElementById("paddlerTable").deleteRow(1);
            document.getElementById("paddlerTable").deleteRow(index);
          }
          if (data.sessionData.length !== 0) {
            try {            
              document.getElementById("description").innerHTML = data.sessionData[0].Description;
            } catch {
              document.getElementById("description").innerHTML = ""
            }
            try {
              document.getElementById("helmName").innerHTML = data.sessionData[0].helm;
            } catch {
              document.getElementById("helmName").innerHTML = ""
            }
            document.getElementById("totalSeats").innerHTML = data.sessionData[0].boatSize;
            
            document.forms[0].submit.disabled = false;

            for(var index = 0; index < data.sessionData.length; index++) {
              // Find a <table> element with id="myTable":
              var table = document.getElementById("paddlerTable");
  
              // Create an empty <tr> element and add it to the 1st position of the table:
              var row = table.insertRow(1);
  
              // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              // Add some text to the new cells:
              cell1.innerHTML = data.sessionData[index].firstName;
              cell2.innerHTML = data.sessionData[index].lastName;
              if (data.sessionData[index].username == data.username) {
                document.forms[0].submit.disabled = true;
                cell3.innerHTML = `<button type="button" onClick="remFromSession('` + data.username + `')" class="btn btn-outline-danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path></svg></button>`
              }
            }
          } else {
            //Empty boat data.sessionData if no data can be collected
            document.getElementById("description").innerHTML = "N/A"
            document.getElementById("helmName").innerHTML = "N/A"
            document.getElementById("totalSeats").innerHTML = "N/A";
          }
          
        }).catch(err => {
          // Do something for an error here
          console.log("Error Reading data " + err);
        });
}

function remFromSession(username) {
  const sessionID = document.forms[0].sessionID.value;
  const options = {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"sessionID": sessionID, "username": username})
  }
  fetch(window.location.href, options)
    .then(response => {
      window.location.reload();
    })
}