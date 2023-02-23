function followArtist(){
    //get artwork name
    let artistName = document.getElementById('artistName').innerHTML;

    //send to server
    fetch(`http://localhost:3000/follow/${artistName}`, {
        method: 'PUT',
       // headers: {'Content-Type': 'application/json'},
    })
    .then((response) => {
    })
    .catch((error) => console.log(err));

    window.location.reload();
}

function enrollToWorkshop(){
    //get artist name
    //get workshop name
    let enroll = {
        artist: document.getElementById('artistName').innerHTML,
        workshop: document.getElementById('workshopName').innerHTML
    }

    //send to server
    fetch(`http://localhost:3000/enroll`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(enroll)
    })
    .then((response) => {
    })
    .catch((error) => console.log(err));
}

document.getElementById("followButton").addEventListener("click", followArtist);
document.getElementById("enrollBtn").addEventListener("click", enrollToWorkshop);

