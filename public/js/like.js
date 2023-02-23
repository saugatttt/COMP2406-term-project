function likePost(){
    let art = document.getElementById('artworkID').innerHTML;

    //send to server
    fetch(`http://localhost:3000/like/${art}`, {
        method: 'PUT',
       // headers: {'Content-Type': 'application/json'},
    })
    .then((response) => {
    })
    .catch((error) => console.log(err));

    window.location.reload();
}

function sendReview(){
    let review = {
        text: document.getElementById("userReview").value,
        artwork: document.getElementById('artworkID').innerHTML
    }

    //send to server
    fetch(`http://localhost:3000/review`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
    })
    .then((response) => {
    })
    .catch((error) => console.log(err));

    window.location.reload();

}

document.getElementById("likeButton").addEventListener("click", likePost);
document.getElementById("sendReview").addEventListener("click", sendReview);