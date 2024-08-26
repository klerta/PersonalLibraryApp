
//get quote api
//$(document).ready(function () {
//     // Attach click event to the button
//     $('#get-quote-btn').click(function () {
//         getRandomQuote();  
//     });

//     // Fetch a random quote on page load
//     getRandomQuote();
// });

// function getRandomQuote() {
//     const quoteText = $('#quote-text');
//     const quoteAuthor = $('#quote-author');

//     // Replace with your own RapidAPI key
//     const rapidApiKey = '1c2009a03cmsh6edfee567d177efp1bfdfajsn6709842c555e';

//     const settings = {
//         url: 'https://andruxnet-random-famous-quotes.p.rapidapi.com/',
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': rapidApiKey,
//             'X-RapidAPI-Host': 'andruxnet-random-famous-quotes.p.rapidapi.com',
//             'Content-Type': 'application/json'
//         },
//         success: function (data) {
//             const quote = data[0].quote; // Assuming data is an array
//             const author = data[0].author;

//             // Display the quote and author in the HTML
//             quoteText.text(`"${quote}"`);
//             quoteAuthor.text(`- ${author}`);
//         },
//         // Display errors
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.error('Error fetching quote:', textStatus, errorThrown);
//             quoteText.text('Failed to fetch quote. Please check the console for details.');
//             quoteAuthor.text('');
//         }
//     };

//     // Make the AJAX request
//     $.ajax(settings)
//         .done(function (response) {
//             console.log(response);
//         })
//         .fail(function (jqXHR, textStatus, errorThrown) {
//             console.error('AJAX request failed:', textStatus, errorThrown);
//             quoteText.text('Failed to fetch quote. Please check the console for details.');
//             quoteAuthor.text('');
//         });
// }


//on home page

function ShowLogin(){
    const authLink = document.getElementById('authLink');
        console.log(authLink);
        
        
            if (localStorage.getItem('token')) {
                authLink.innerHTML = '<a href="#" id="logoutLink">Log Out</a>';
                $('#logoutLink').click(function() {
                    localStorage.removeItem('token');
                    window.location.href = 'index.html';
                });
            } else {
                authLink.innerHTML = '<a href="login.html">Log In</a>';
            }
        
};

ShowLogin();

        