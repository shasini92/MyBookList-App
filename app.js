// Book Class: represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: to handle UI tasks
class UI {
  // We use static so we don't have to instantiate
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");
    // we use backticks (``) because we want to use variables inside a string
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      //   We want to select the parent (the row)
      //   Double parent element because it's a link, so the first parent element is td and the second is the row
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.getElementById("book-form");
    container.insertBefore(div, form);

    // Make it go away in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  //   A function that clears fields after input
  static clearFields() {
    document.getElementById("book-form").reset();
  }
}

// Store Class: handles storage

class Store {
  // making them static lets us use it without instantiating the Store class
  // we can't use objects in local storage, only strings
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.getElementById("book-form").addEventListener("submit", e => {
  // Because it's a submit form we need to prevent the default action (submit)

  e.preventDefault();

  // Get form values
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  //   Validation
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all the fields.", "danger");
  } else {
    // Instantiate a book
    const book = new Book(title, author, isbn);

    //  Add Book to UI
    UI.addBookToList(book);

    // Add a book to Store
    Store.addBook(book);

    // Show success message
    UI.showAlert("Book added.", "success");

    //   Clear Fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.getElementById("book-list").addEventListener("click", e => {
  // Remove book from UI
  UI.deleteBook(e.target);

  //   Remove book from the Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  UI.showAlert("Book removed.", "success");
});
