function addArtwork(){
    /*
    let n = document.getElementById("name").value;
    let a = document.getElementById("artist").value;
    let y = document.getElementById("year").value;
    let c = document.getElementById("category").value;
    let m = document.getElementById("medium").value;
    let d = document.getElementById("description").value;
    let i = document.getElementById("imageURL").value;
    */
    let newArtwork = {
        name: document.getElementById("name").value,
        year: document.getElementById("year").value,
        category: document.getElementById("category").value,
        medium: document.getElementById("medium").value,
        description: document.getElementById("description").value,
        image: document.getElementById("imageURL").value,
    }

    //send object to server
    fetch(`http://localhost:3000/addartwork`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newArtwork)
    })
    .then((response) => {
        window.alert("Successfully posted");
    })
    .catch((error) => console.log(err));

}

function addWorkshop(){
    let workshop = {
        name: document.getElementById("workshopName").value
    }

    //send object to server
    fetch(`http://localhost:3000/addworkshop`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(workshop)
    })
    .then((response) => {
    })
    .catch((error) => console.log(err));
}

document.getElementById("addButton").addEventListener("click", addArtwork);
document.getElementById("addWorkshop").addEventListener("click", addWorkshop);

