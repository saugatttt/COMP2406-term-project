function refreshResults(){
    //get info from the text fields
    let n = document.getElementById("name").value;
    let a = document.getElementById("artist").value;
    let c = document.getElementById("category").value;

     //create xmlhttpReq
    const sendSearchParams = new XMLHttpRequest;
    sendSearchParams.onload = function(){
        //do something with what you got
        let arr = JSON.parse(this.responseText);

        console.log(arr);

        let resultOutput = document.getElementById("results");

        
        //first destroy child elements if they exist
        while(resultOutput.firstChild){
            resultOutput.removeChild(resultOutput.lastChild);
        }
        
        let newText = document.createElement('p');
        let string = '<ul>';
        arr.forEach(elem => {
            console.log(elem.name)
            string += `<li><a href = /artwork/${elem.id}>${elem.name}</a></li>`
        }); 
        string+= '</ul>';
        newText.innerHTML = string;
        resultOutput.appendChild(newText);
        
       
    }
    sendSearchParams.open("get", `/artwork?artist=${a}&name=${n}&category=${c}`);
    sendSearchParams.send();
}

document.getElementById("refresh").addEventListener("click", refreshResults);
