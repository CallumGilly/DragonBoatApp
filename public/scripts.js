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

function toggleMembership() {
    document.getElementById(`MembershipNumber`).readOnly = !document.getElementById(`MembershipNumber`).readOnly;
    document.getElementById(`MembershipExpiration`).readOnly = !document.getElementById(`MembershipExpiration`).readOnly;
}

function validateSignup() {
    if (document.getElementById(`password`).value !== document.getElementById(`password`).value) {return false;}
    return true;
}