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

console.log('Books (before request) = ', books);

//Request books data from the api endpoint
const settings = {
    async: true,
    crossDomain: true,
    url: 'https://localhost:44320/api/UserBooks/get-all-books?status=' + 0 + '&userId=' + _userId,
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
                    <div>
                    <button class ="glow-on-hover" type="button" name="startReadBtn" id="startReadBtn" data-read-id="${book.bookId}">Start Reading</button>    
                    </div>
                </div>`;
        
                document.getElementById("myGrid").innerHTML += item;
        
    });
}


//make the button start reading functional

const gridBody = document.getElementById("myGrid");

$(gridBody).on('click', "#startReadBtn", function(){
    const _bookId = $(this).data('read-id');
   
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://localhost:44320/api/UserBooks/update-user-book?bookId=' + _bookId + '&userId=' + _userId,
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        
    };
    
    $.ajax(settings).done(function (response) {
        alert('Book added to reading');
    });
    
    // $("#book-name").text(book.title);

$("#readModal").show();
})


$("#closeReadSpn").click(function(){
    $("#readModal").hide();
    location.reload();
});


// Search function

function search(){

    const test = document.getElementById("inputId").value;
    const book1=test.toLowerCase();
    
    const book = filteredBooks.find(n=> n.title.toLowerCase()==book1);
    if(book){
        alert("YAY!! \n You have' "+book.title+" ' in your wishing list.");
    }
    else{
        alert("Error 404!!!\nHahaha Just kidding :) \nYou don't have this book in your wishing list.");
    }
}

document.addEventListener('DOMContentLoaded',(event)=>{

    const searchButton = document.getElementById("searchBtn");
    searchButton.addEventListener('click',search);

    
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

//get role from token

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
