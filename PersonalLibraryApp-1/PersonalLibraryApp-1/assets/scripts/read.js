//populate to be read 
//decode token
const token = localStorage.getItem('token'); // Replace 'yourTokenKey' with the actual key you used to store the token

if (token) {
  // Decode the token
  const decodedToken = parseJwt(token);

  // Access the claims from the decoded token
  var _userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']; // Example: accessing the 'sub' claim (subject)

  // Use the claims as needed
  //console.log('User ID:', _userId);
}

// Function to decode a JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}



var books = [];

//Request books data from the api endpoint
const settings = {
    async: true,
    crossDomain: true,
    url: 'https://localhost:44320/api/UserBooks/get-all-books?status=' + 1 + '&userId=' + _userId,
    method: 'GET',
    headers: {
        'content-type': 'application/json'
    }
};

$.ajax(settings).done(function (response) {
    console.log(response);

    books = response;

    console.log('Books (after request response) = ', books);

    populateGrid();
});
document.getElementById("myGrid").innerHTML=" ";

function populateGrid(){
    $.each(books, function(index, book){
        const item = `<div class="grid-item">
                    <div class="img-container">
                        <img class="image" src="${book.coverUrl}">
                        <div class="middle">
                            <div class="text">${book.description}</div>
                        </div>
                    </div>
                    <div class="attr" id="">${book.title} <br> ${book.authorNames.join(', ')} <br>${book.genreTitle} </div>
                    <!-- <div
                         class="RadialProgress"
                         role="progressbar"
                         aria-valuenow="0"
                         aria-valuemin="0"
                         aria-valuemax="100"
                       > </div> -->
                        <input class=sliding type="range" value="0" min="0" max="100" />
                
                </div>`;
        
                document.getElementById("myGrid").innerHTML += item;
        
    });
}




//progress bar
// const controller = document.querySelector('input[type=range]');
// const radialProgress = document.querySelector('.RadialProgress');

// const setProgress = (progress) => {
//   const value = `${progress}%`;
//   radialProgress.style.setProperty('--progress', value)
//   radialProgress.innerHTML = value
//   radialProgress.setAttribute('aria-valuenow', value)
// }

// setProgress(controller.value)
// controller.oninput = () => {
//   setProgress(controller.value)
// }


// Search function

function search() {

    const test = document.getElementById("inputId").value;
    const book1 = test.toLowerCase();

    const book = filteredBooks.find(n => n.title.toLowerCase() == book1); //iterate on filteredBooks array now
    if (book) {
        alert("YAY!! \n You have ' " + book.title + " ' in your reading list.");
    }
    else {
        alert("Error 404!!!\nHahaha Just kidding :) \nYou don't have this book in your reading list.");
    }
}

document.addEventListener('DOMContentLoaded', (event) => {

    const searchButton = document.getElementById("searchBtn");
    searchButton.addEventListener('click', search);


});

//update nav

function updateNavigation(userRole) {
    const adminProfileLink = document.getElementById('adminProfileLink');
    const userProfileLink = document.getElementById('userProfileLink');
    const homeLink = document.getElementById('homeLink');
    console.log("admin",adminProfileLink);
    console.log("user",userProfileLink);

    
        if (userRole === 'Admin') {
            // If the user is an admin, show the admin link
            adminProfileLink.parentElement.style.display = 'block';
            userProfileLink.style.display = 'none';
            homeLink.style.display = 'none';
        } else {
            // If the user is not an admin, hide the admin link
            adminProfileLink.style.display = 'none';
            userProfileLink.parentElement.style.display = 'block';
            homeLink.style.display = 'none';
        }
    
   
};

//get token


    if (token) {
        const decodedToken = parseJwt(token);
        var _userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log(_userRole);
    }
    // Function to decode a JWT token
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

updateNavigation(_userRole);