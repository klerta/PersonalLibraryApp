let book;
class Book {
    constructor(_id, _title, _authors, _description, _coverUrl, _genre) {
        this.id = _id;
        this.title = _title;
        this.authors = _authors;
        this.description = _description;
        this.coverUrl = _coverUrl;
        this.genre = _genre;
    }
}

class Author {
    constructor(_fullname) {
        this.fullName = _fullname;
    }
}

function readFunction1(event) {
    $("#addBookModal").show();

    $("#closeAddModalSpn").click(function () {
        $("#addBookModal").hide();
    });
}

function readFunction2(event) {
    $("#addAuthorModal").show();

    $("#closeAddAuthorModalSpn").click(function () {
        $("#addAuthorModal").hide();
    });
}

function editFunction(event) {
    $("#editBookModal").show();

    $("#closeEditBookModalSpn").click(function () {
        $("#editBookModal").hide();
    });
}

function deleteFunction(event) {
    $("#deleteBookModal").show();

    $("#closeDeleteBookModalSpn").click(function () {
        $("#deleteBookModal").hide();
    });
}


// // //Add event to Add Book button
document.addEventListener('DOMContentLoaded', (event) => {

    const addButton = document.getElementById("addBookBtn");
    addButton.addEventListener('click', readFunction1)

})

//Add event to Add Author button
document.addEventListener('DOMContentLoaded', (event) => {

    const addButton = document.getElementById("addAuthorBtn");
    addButton.addEventListener('click', readFunction2)

})



var books = [];

console.log('Books (before request) = ', books);

//Request books data from the api endpoint
const settings = {
    async: true,
    crossDomain: true,
    url: 'https://localhost:44320/api/Books/get-all-books',
    method: 'GET',
    headers: {
        'content-type': 'application/json'
    }
};

$.ajax(settings).done(function (response) {

    books = response;

    
    console.log('Books (after request response) = ', books);

    populateGrid();
});
document.getElementById("myGrid").innerHTML = " ";

function populateGrid() {
    $.each(books, function (index, book) {

        //decode the token
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = parseJwt(token);
        var _userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
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

    const isAdmin = _userRole === 'Admin';
    const isUser = _userRole === 'User';

        const item = `<div class="grid-item">
                    <div class="img-container">
                        <img class="image" src="${book.coverUrl}">
                        <div class="middle">
                            <div class="text">${book.description}</div>
                        </div>
                    </div>
                    <div class="attr" id="">${book.title} <br> ${book.authorNames.join(', ')} <br>${book.genreTitle} </div>
                    <div>
                    
                    ${isUser ? `<button class ="glow-on-hover" type="button" name="readBtn" id="readBtn" data-read-id="${book.bookId}">Read Me</button>` : ''}
                    <div class="button-container" id="editDelete">
                        ${isAdmin ? `<button class ="glow-on-hover" type="button" name="editBtn" id="editBtn" data-edit-id="${book.bookId}">Edit</button>` : ''}
                        ${isAdmin ? `<button class ="glow-on-hover" type="button" name="deleteBtn" id="deleteBtn" data-delete-id="${book.bookId}">Delete</button>` : ''}    
                    </div>
                    </div>
                </div>`;

        document.getElementById("myGrid").innerHTML += item;

    });
}



//this function makes the form function as it should
async function handleSubmit(_title, _authors, _description, _genre, _image) {
    // Convert author IDs to integers
    const authorIds = _authors.map(authorId => parseInt(authorId, 10));

    // Check if the author-title combination already exists
    const authorTitleExists = await checkAuthorTitleCombination(_authors[0], _title);

    if (authorTitleExists) {
        alert('This book already exists in the library with the selected author.');
        return;
    }

    // Create Object
    var newBook = {

        title: _title,
        authorIds: authorIds, // Update to match the server's expected format
        description: _description,
        genreId: parseInt(_genre, 10), // Convert genre ID to integer
        coverUrl: _image
    };

    //Request orders data from the api endpoint
    const settings = {
        async: false,
        crossDomain: true,
        url: 'https://localhost:44320/api/Books/add-book-with-authors',
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(newBook)
    };
    console.log(newBook);
debugger
    $.ajax(settings).done(function (response) {
        console.log(response);
        alert('Book added to json file');   
    });
}
async function checkAuthorTitleCombination(authorId, title) {
    const checkSettings = {
      async: true,
      crossDomain: true,
      url: `https://localhost:44320/api/Books/check-author-title?authorId=${authorId}&title=${title}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    };
  
    return new Promise((resolve, reject) => {
      $.ajax(checkSettings).done(function (response) {
        resolve(response.exists);
      }).fail(function (jqXHR, textStatus, errorThrown) {
        reject(new Error(textStatus + ': ' + errorThrown));
      });
    });
  }
  

$(document).ready(function () {
    $("#submitBtn").click(function () {
        // Get values from form fields
        var title = $("#bookTitle").val();

        // Authors are selected using checkboxes, so retrieve them differently
        var authors = [];
        $("#authorsDropdown input:checked").each(function () {
            authors.push($(this).val());
        });

        var description = $("#description").val();
        var genre = $("#genre").val(); // Get the selected genre
        var imageurl = $("#image").val();

        // Call the handleSubmit function with the form values
        handleSubmit(title, authors, description, genre, imageurl);
        $("#addBookModal").hide();
        //location.reload();

    });
})



//add functionality to read me button
const gridBody = document.getElementById("myGrid");

$(gridBody).on('click', "#readBtn", function () {
    const _bookId = $(this).data('read-id');

    //decode the token
    const token = localStorage.getItem('token');


    if (token) {
        const decodedToken = parseJwt(token);
        var _userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

        // Check if the user-book combination already exists
        const checkSettings = {
            async: true,
            crossDomain: true,
            url: `https://localhost:44320/api/UserBooks/check-combination?bookId=${_bookId}&userId=${_userId}`,
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        };

        $.ajax(checkSettings).done(function (response) {
            if (response.exists) {
                alert('You have already added this book to your personal library.');
                return;
            }

            // If the combination doesn't exist, add the book
            var newUserBook = {
                bookId: _bookId,
                userId: _userId
            };

            const addSettings = {
                async: true,
                crossDomain: true,
                url: 'https://localhost:44320/api/UserBooks/add-book-user?bookId=' + newUserBook.bookId + '&userId=' + newUserBook.userId,
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
            };


            $.ajax(addSettings).done(function (response) {
                alert('Book added to wishing list.');
            });

            $("#readModal").show();
        });
    }
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }

    
});

$("#closeReadSpn").click(function () {
    $("#readModal").hide();
});


// START OF EDIT

//add functionality to edit button
$(gridBody).on('click', "#editBtn", function(){
    bookId = $(this).data('-id');
    book = books.find(n => n.id == bookId);
    
    populateEditForm(book);
    $("#editBookModal").show();
    
    function populateEditForm(book){
        $("#editBookTitle").val(book.title);
        $("#editDescription").val(book.description);
        $("#editGenre option[value='" + book.genreId + "']").prop("selected", true); // Set the selected genre
        $("#editBookCoverUrl").val(book.coverUrl);
        $("#editBookId").val(book.bookId); // Store the bookId in a hidden input field, to access it from the submit edit button

        setTimeout(() => {
            // Clear the previous selection
            $("#editAuthorDropdown input[type='checkbox']").prop("checked", false);
    
            // Mark the corresponding checkboxes as checked
            if (book && book.authors) {
                book.authors.forEach(authorId => {
                  $("#editAuthorDropdown input[value='" + authorId + "']").prop("checked", true);
                });
              }
        }, 0);
    
        
    }
})

$("#closeEditModalSpn").click(function(){
    $("#editBookModal").hide();
});

//form functionality for EDIT
function handleEditSubmit(_id, _title, _authors, _description, _genre, _image) {
    // Convert author IDs to integers
    const authorIds = _authors.map(authorId => parseInt(authorId, 10));

    // Create Object
    updatedBook = {
        title: _title,
        authorIds: authorIds, // Update to match the server's expected format
        description: _description,
        genreId: parseInt(_genre, 10), //Convert genre ID to integer
        coverUrl: _image
    };

    //Request data from the api endpoint
    var settings = {
        async: true,
        crossDomain: true,
        url: `https://localhost:44320/api/Books/update-book-by-id/${_id}`,
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(updatedBook)
    };
    console.log(updatedBook);

    $.ajax(settings).done(function (response) {
        console.log("response",response);
        if(response)
        {
            alert('Book updated successfully');
        }
        else{
            alert("Update failed");
        }
    });
}

$(document).ready(function () {
    $("#submitEditBtn").click(function (e) {
      e.preventDefault(); // Prevent the default form submission behavior
  
      var id = $("#editBookId").val(); // Get the bookId from the hidden input field
      // Get values from form fields
      var title = $("#editBookTitle").val();
  
      var authors = [];
      $("#editAuthorDropdown input:checked").each(function () {
        authors.push($(this).val());
      });
  
      var description = $("#editDescription").val();
      var genre = $("#editGenre").val(); // Get the selected genre
      var imageurl = $("#editBookCoverUrl").val();
  
      // Call the handleEditSubmit function with the form values
      handleEditSubmit(id, title, authors, description, genre, imageurl, function () {
        $("#editBookModal").hide();
        location.reload();
      });
    });
  })

// END OF EDIT

// START OF DELETE
//add functionality to delete button
$(gridBody).on('click', "#deleteBtn", function(){
    
        bookId = $(this).data('delete-id');
        $("#deleteBookModal").show();
      
});

// Add a click event listener to the confirm button
$("#confirmDeleteBtn").click(function () {
    // Call the API to delete the book, like handlesubmit
    const settings = {
      async: false,
      crossDomain: true,
      url: `https://localhost:44320/api/Books/delete-a-book-by-id/${bookId}`,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    };

    $.ajax(settings).done(function (response) {
     if(response)
     {
      alert("Book is deleted");
     }
     else{
      alert("This book can not be deleted");
     }
      // Hide the confirmation modal
      $("#deleteBookModal").hide();
    });
  });
  
  // Add a click event listener to the cancel button
  $("#cancelDeleteBtn").click(function () {
    // Close the confirmation modal
    $("#deleteBookModal").hide();
  });

  $("#closeDeleteBookModalSpn").click(function(){
    $("#deleteBookModal").hide();
  });
// END OF DELETE

// Search function

function searchBooks() {
    var title = $('#searchTitle').val();

    $.ajax({
        url: `https://localhost:44320/api/Books/search-book-by-title/${title}`,
        type: 'GET', // Change to GET
        success: function (books) {
            //displaySearchResults(books);
            if (books.length > 0) {
                var successMessage = `YAY!! \nThe book '${books[0].title}' you are searching is in our library.`;
                alert(successMessage);
            } else {
                alert("YAY!! \nThe book you are searching for is not in our library.");
            }
        },
        error: function (error) {
            alert("Error 404!!!\nWe don't have this book :(");
            console.error('Error searching books:', error.responseText);
        }
    });
}

 document.addEventListener('DOMContentLoaded', (event) => {
    
     const searchButton = document.getElementById("searchBtn");
    // event.preventDefault();
     searchButton.addEventListener('click', searchBooks);


 });

//  function displaySearchResults(books) {
//     // Clear the existing results
//     $('#searchResults').empty();

//     // Iterate through the books and display each one
//     books.forEach(book => {
//         $('#searchResults').append(`
//             <div class="search-result">
//                 <h3>${book.title}</h3>
//                 <p>${book.authorIds.map(authorId => _authors.find(author => author.id === authorId).name).join(', ')}</p>
//                 <p>${book.description}</p>
//                 <p>${book.genre.name}</p>
//                 <img src="${book.coverUrl}" alt="${book.title}" width="150">
//             </div>
//         `);
//     });
// }



//Image preview in the form

function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    const url = input.value.trim();

    if (url) {
        preview.src = url;
        preview.style.display = 'block';
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
}

//add author dropdown to add a book form
document.addEventListener('DOMContentLoaded', function () {
    // Fetch authors from your API endpoint
    fetch('https://localhost:44320/get-all-authors')
        .then(response => response.json())
        .then(authors => {
            const authorsDropdown = document.getElementById('authorsDropdown');

            // Create checkboxes for each author
            authors.forEach(author => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'authors';
                checkbox.value = author.authorId;
                const label = document.createElement('label');
                label.appendChild(document.createTextNode(author.fullName)); // Use the author's name or another property

                const authorDiv = document.createElement('div');
                authorDiv.appendChild(checkbox);
                authorDiv.appendChild(label);

                authorsDropdown.appendChild(authorDiv);
            });
        })
        .catch(error => console.error('Error fetching authors:', error));
});

function toggleAuthorsDropdown() {
    const authorsDropdown = document.getElementById('authorsDropdown');
    authorsDropdown.style.display = (authorsDropdown.style.display === 'none' || authorsDropdown.style.display === '') ? 'block' : 'none';
}

//add genre dropdown

document.addEventListener('DOMContentLoaded', function () {
    // Fetch genres from your API endpoint
    fetch('https://localhost:44320/api/Genres/get-all-genres')
        .then(response => response.json())
        .then(genres => {
            const genreDropdown = document.getElementById('genre');

            // Dynamically populate the dropdown options
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.genreId;  // Set the value
                option.text = genre.genreTitle;   // Set the displayed text
                genreDropdown.add(option);
            });
        })
        .catch(error => console.error('Error fetching genres:', error));
});

//add author dropdown to EDIT a book form
document.addEventListener('DOMContentLoaded', function () {
    // Fetch authors from your API endpoint
    fetch('https://localhost:44320/get-all-authors')
        .then(response => response.json())
        .then(authors => {
            const authorsDropdown = document.getElementById('editAuthorDropdown');

            // Create checkboxes for each author
            authors.forEach(author => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'authors';
                checkbox.value = author.authorId;
                const label = document.createElement('label');
                label.appendChild(document.createTextNode(author.fullName)); // Use the author's name or another property

                const authorDiv = document.createElement('div');
                authorDiv.appendChild(checkbox);
                authorDiv.appendChild(label);

                authorsDropdown.appendChild(authorDiv);
            });

            // Populate the edit form after adding the checkboxes
            if (book) {
                populateEditForm(book);
            }
        })
        .catch(error => console.error('Error fetching authors:', error));
});

function toggleEditAuthorsDropdown() {
    const authorsDropdown = document.getElementById('editAuthorDropdown');
    authorsDropdown.style.display = (authorsDropdown.style.display === 'none' || authorsDropdown.style.display === '') ? 'block' : 'none';
}

//add EDIT genre dropdown

document.addEventListener('DOMContentLoaded', function () {
    // Fetch genres from your API endpoint
    fetch('https://localhost:44320/api/Genres/get-all-genres')
      .then(response => response.json())
      .then(genres => {
        console.log("Genres:", genres);
        if (genres) {
          const genreDropdown = document.getElementById('editGenre');
  
          // Dynamically populate the dropdown options
          genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.genreId;  // Set the value
            option.text = genre.genreTitle;   // Set the displayed text
            genreDropdown.add(option);
          });
        }
      })
      .catch(error => console.error('Error fetching genres:', error));
  });


// Event listener for the form submission
document.getElementById('bookForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the selected genre value
    const selectedGenre = document.getElementById('genre').value;

});

//add authors by form

function handleAuthorSubmit(_fullname) {
    // Create Object
    var newAuthor = {
        fullName: _fullname
    };

    //Request orders data from the api endpoint
    const settings = {
        async: false,
        crossDomain: true,
        url: 'https://localhost:44320/add-author',
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(newAuthor)
    };
    console.log(newAuthor);

    $.ajax(settings).done(function (response) {
        alert('Author added to json file');
    });


}

$(document).ready(function () {
    $("#submitAuthorBtn").click(function () {
        // Get values from form fields
        var fullName = $("#fullName").val();



        // Call the handleSubmit function with the form values
        handleAuthorSubmit(fullName);
        $("#addAuthorModal").hide();


    });
})

//update nav

function updateNavigation(userRole) {
    const adminProfileLink = document.getElementById('adminProfileLink');
    const userProfileLink = document.getElementById('userProfileLink');
    const homeLink = document.getElementById('homeLink');
    const addBookBtn = document.getElementById('addBookBtn');
    const addAuthorBtn = document.getElementById('addAuthorBtn');

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
            addBookBtn.style.display = 'none';
            addAuthorBtn.style.display = 'none';
        }
    
   
};

//get token

const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = parseJwt(token);
        var _userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log(_userRole);
    }

    updateNavigation(_userRole);

    // Function to decode a JWT token
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
    



