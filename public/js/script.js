const toggleDropdown = () => {
    $('.dropdown').toggleClass('active');
};

// Array to store todo items
let todoArray = [];

// Function to handle the form submission when adding a new item
const submitItem = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Get the value of the input field with the ID 'listItem'
    const newItem = $("#listItem").val();
    // Perform an asynchronous operation (e.g., submit form data using ajax, jquery)
    // Check if newItem is not empty before submitting
    if (newItem.trim() !== "") {
        $.ajax({
            url: '/form',                   // Server endpoint for handling form submission
            method: 'POST',                 // HTTP method for the request
            data: { listItem: newItem },    // Data to be sent to the server
            success: function (data) {
                // Callback function called on successful response from the server
                //displayValues and values are created below
                displayValues(data.values);  // Display the updated list of values
                // Clear the input field after successful submission
                $("#listItem").val('');
                // Reset the textarea to a single row after form submission
                $("#listItem").css('height', 'auto').attr('rows', 1);
            },
            error: function (error) {
                // Callback function called in case of an error
                console.error("Error: ", error);
            }
        });
    }
}

// Function to display values in the list
const displayValues = (values) => {
    // Clear the values list
    $('#itemShown').empty();
    // Display each value in the list
    values.forEach(function (todoItem, index) {
        const listItem = $('<li class="todoItemList">');
        //allows whitespaces to be preserved
        const itemContainer = $('<div class="listedItems" style="white-space: pre-line;" maxlength="2048" aria-expanded="false">' + todoItem + '</div>');
        const buttonsContainer = $('<div class="todoItemListButtons"></div>');

        // Append the "Delete" button
        buttonsContainer.append('<span type="button" onclick="removeItem(' + index + ')" class="todoButton">Delete</span>');

        // Append the "Edit" button
        buttonsContainer.append('<span type="button" onclick="editItem(' + index + ', event)" class="todoButton">Edit</span>');

        // Append the containers to the listItem
        listItem.append(itemContainer);
        listItem.append(buttonsContainer);

        // Append the listItem and a horizontal line to the '#itemShown' container
        $('#itemShown').append(listItem).append('<hr/>');
    });
}

// Function to remove an item from the list
const removeItem = (index) => {
    // Prevent the default form submission behavior
    // Perform an asynchronous operation (e.g., submit form data using ajax, jquery)
    $.ajax({
        url: '/removeItem',           // Server endpoint for removing an item
        method: 'DELETE',               // HTTP method for the request
        data: { index: index },       // Data to be sent to the server (index of the item to be removed)
        success: function (data) {
            // Callback function called on successful response from the server
            displayValues(data.values);  // Display the updated list of values
        },
        error: function (error) {
            // Callback function called in case of an error
            console.error("Error: ", error);
        }
    });
};

// Function to edit an item in the list
const editItem = (index, event) => {
    event.preventDefault();

    // Find the list item and the element containing the text you want to edit
    const listItemElement = $('#itemShown li').eq(index);
    const listedItemsElement = listItemElement.children(':first-child'); // Find the first child element of 'said' element

    // Get the current text value
    const currentText = listedItemsElement.text().trim();

    // Create an input field and set its value to the current text
    const inputField = $('<textarea>', { class: 'editInput', rows: 5 }).val(currentText);

    // Create an "OK" button
    const okButton = $('<button>', { text: 'OK', class: 'okButton' });

    // Replace the text with a empty input field and add the "OK" button
    listedItemsElement.empty().append(inputField).append(okButton);

    // Focus on the input field for a better user experience
    inputField.focus();

    // Add a blur event to the input field to handle editing completion
    inputField.blur(function () {
        completeEditing();
    });

    // Add a click event to the "OK" button to handle editing completion
    okButton.click(function () {
        completeEditing();
    });

    // Function to handle editing completion
    const completeEditing = () => {
        const updatedItem = inputField.val().trim();

        // Check if the value is not empty and has changed
        if (updatedItem !== "" && updatedItem !== currentText) {
            // Send an AJAX request to the server to update the item
            $.ajax({
                url: '/editItem',
                method: 'PUT',
                data: { index: index, updatedItem: updatedItem }, //index is the number of the item in the array, updatedItem is what you changed it to, saving it to data to be called in the success function
                success: function (data) {
                    // Handle success, e.g., update the UI with the new todoArray, stored in data
                    displayValues(data.values);
                },
                error: function (error) {
                    // Handle error, if needed
                    console.error('Error:', error);
                }
            });
        } else {
            // If the value is empty or unchanged, restore the original text
            listedItemsElement.html(updatedItem);
        }
    };
};


$(document).ready(function () { //just here to make sure that there is no errors or delayed responses with the layout
    $('#listItem').on('input', function () {
        $(this).css('height', 'auto'); // Reset height to auto
        $(this).css('height', this.scrollHeight + 2 + 'px'); // Set height to scrollHeight + some padding
    });

    // Code for the active tab on the header
    // If the currentPage's link is '/' or '/contact' or '/about'
    const currentPage = window.location.pathname;

    // Add the "active-link" class to the corresponding nav link
    $('.nav-item a').each((index, element) => {
        const $link = $(element);
        if ($link.attr('href') === currentPage) { //find which page is open
            $link.addClass('active-link'); //and add the class with the 'nav-item' styles
        }
    });
});

/**

1. todoArray: An array to store todo items on the client-side.
2. submitItem: Function to handle form submission when adding a new item. Uses AJAX to send a POST request to the server, updates the UI on success.
3. displayValues: Function to display todo items on the client-side. Clears the existing list and renders the updated list with buttons for removal and editing.
4. removeItem: Function to handle removing an item. Uses AJAX to send a DELETE request to the server, updates the UI on success.
5. editItem: Function to handle editing an item. Prompts the user for a new value, sends a PUT request to the server, and updates the UI on success.

 */