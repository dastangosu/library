let myLibrary = [];

const booksContainer = document.querySelector('#books-container');
const titleInput = document.querySelector('form > #title');
const authorInput = document.querySelector('form > #author');
const pagesInput = document.querySelector('form > #pages');
const readStatusInput = document.querySelector('form #read-status-checkbox');
const form = document.querySelector('form');
const submitButton = document.querySelector('#submit-button');
const overlay = document.querySelector('#overlay');
const newBookButton = document.querySelector('#new-book-button');

//function to store and retrieve from LocalStorage
function storeInLS() {
  const jsonString = JSON.stringify(myLibrary);
  localStorage.setItem('myLibrary', jsonString);
}
function retrieveFromLS() {
  const jsonString = localStorage.getItem('myLibrary');
  const retrievedArray = JSON.parse(jsonString);
  retrievedArray.forEach((book) => {
    Object.setPrototypeOf(book, Book.prototype);
  })
  return retrievedArray;
}
//Book constructor
function Book(author, title, numOfPages, readStatus) {
  this.author = author;
  this.title = title;
  this.numOfPages = numOfPages;
  this.readStatus = readStatus;
}
Book.prototype.toggleReadStatus = function () {
  if (this.readStatus === "Read") {
    this.readStatus = "Not Read";
  }
  else {
    this.readStatus = "Read";
  }
}

function addBookToLibrary(book) {
  myLibrary.push(book);
  storeInLS();
}

function displayBooks() {
  for (let i = 0; i < myLibrary.length; i++) {
    addBooktoDOM(myLibrary[i]);
  }
}

function addBooktoDOM(book) {
  const title = document.createElement('p');  //create title element
  title.textContent = '"' + book.title + '"';

  const author = document.createElement('p'); //create author element
  author.textContent = book.author;

  const numOfPages = document.createElement('p');  // create element for num of pages
  numOfPages.textContent = book.numOfPages.toString();

  const readStatus = document.createElement('button'); //create button for read status
  readStatus.classList.add('read-status');
  readStatus.textContent = book.readStatus;

  if (book.readStatus === 'Read') {   //add .read class to change appearance
    readStatus.classList.add('read');
  }
  readStatus.addEventListener('click', () => { //event listener to toggle the read status
    book.toggleReadStatus();
    readStatus.textContent = book.readStatus;
    if (book.readStatus === 'Read') {
      readStatus.classList.add('read');
    }
    else {
      readStatus.classList.remove('read');
    }
  })

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => {
    myLibrary.splice(+removeButton.parentNode.dataset.bookIndex, 1);  //remove the object from array
    storeInLS();
    removeButton.parentNode.remove(); //remove the node from DOM
    giveBooksAnIndexAttribute();  //update the index attributes of elements
  })

  const bookDivElement = document.createElement('div'); //create div element for book
  bookDivElement.classList.add('book');
  bookDivElement.appendChild(title);   //append children
  bookDivElement.appendChild(author);
  bookDivElement.appendChild(numOfPages);
  bookDivElement.appendChild(readStatus);
  bookDivElement.appendChild(removeButton);

  booksContainer.appendChild(bookDivElement); //append the book element to books container
}

function giveBooksAnIndexAttribute() {
  const bookCards = document.querySelectorAll('.book');
  for (let i = 0; i < bookCards.length; i++) {
    bookCards[i].setAttribute('data-book-index', i.toString());  //give index data attribute to books in order to link them with array 
  }
}

form.addEventListener('click', (e) => {
  e.stopPropagation();    //stop propagation to prevent the overlay from closing when form is clicked
})

submitButton.addEventListener('click', (e) => {
  e.preventDefault();  //prevent the form from submitting to the server side
  if (form.checkValidity()) {
    let read = '';
    if (readStatusInput.checked) {
      read = 'Read';
    }
    else {
      read = "Not Read"
    }
    let numberOfPages = +pagesInput.value;
    let book = new Book(authorInput.value, titleInput.value, numberOfPages, read);
    addBookToLibrary(book);
    addBooktoDOM(book);
    giveBooksAnIndexAttribute();
    overlayOff();
    form.reset();
  }
  else {
    form.reportValidity();
  }
})

function overlayOn() {
  overlay.style.display = 'block';
}

function overlayOff() {
  overlay.style.display = 'none';
}

newBookButton.addEventListener('click', overlayOn);  //display overlay when "New Book" is clicked
overlay.addEventListener('click', overlayOff);

window.onload = function () {
  if (localStorage.getItem('myLibrary')) {   //check if local storage has myLibrary
    myLibrary = retrieveFromLS();
  }
  else {
    let book1 = new Book("Sun Tzu", "The Art of War", 288, "Not Read");
    addBookToLibrary(book1);
    let book2 = new Book("Dostoevsky", "The Brothers Karamazov", 840, "Not Read");
    addBookToLibrary(book2);
  }
  displayBooks();
}


