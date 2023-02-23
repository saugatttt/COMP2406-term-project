function togglePatronArtist(){
    //send req to server to toggle patron/artist on the account
    fetch('http://localhost:3000/toggleArtistPatron', {
        method: 'PUT',
    })
    .then((response) => {
        location.href='http://localhost:3000/account';
    })
    .catch((error) => console.log(err));

    window.location.reload();
}

function logoutUser(){
    //send req to server to logout the user -> session must end
    fetch('http://localhost:3000/logoutUser', {
        method: 'PUT',
    })
    .then((response) => {
        location.href='http://localhost:3000/account'
    })
    .catch((error) => console.log(err));
}

document.getElementById("patronArtistToggle").addEventListener("click", togglePatronArtist);
document.getElementById("logoutButton").addEventListener("click", logoutUser);
