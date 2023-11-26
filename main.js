document.addEventListener('DOMContentLoaded', function () {

    const inputForm = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
  
    inputForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
  
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    });
  
    document.addEventListener('click', function (event) {
        const target = event.target;
  
        if (target.classList.contains('green')) {
            const bookElement = target.closest('.book_item');
            if (bookElement.parentElement === incompleteBookshelfList) {
                moveBookToComplete(bookElement);
            } else if (bookElement.parentElement === completeBookshelfList) {
                moveBookToIncomplete(bookElement);
            }
        } else if (target.classList.contains('red')) {
            const bookElement = target.closest('.book_item');
            const isComplete = bookElement.parentElement === completeBookshelfList;
            removeBook(bookElement, isComplete);
        }
    });
  
    function addBook() {
        const titleInput = document.getElementById('inputBookTitle').value;
        const authorInput = document.getElementById('inputBookAuthor').value;
        const yearInput = parseInt(document.getElementById('inputBookYear').value);
        const isCompleteInput = document.getElementById('inputBookIsComplete').checked;
  
        const book = {
            id: +new Date(),
            title: titleInput,
            author: authorInput,
            year: yearInput,
            isComplete: isCompleteInput,
        };
  
        const bookshelfList = isCompleteInput ? completeBookshelfList : incompleteBookshelfList;
  
        const newBookElement = makeBookElement(book);
        bookshelfList.appendChild(newBookElement);
  
        updateDataToStorage();
        inputForm.reset();
    }
  
    function searchBook() {
        const searchTitleInput = document.getElementById('searchBookTitle').value.toLowerCase();
  
        const allBooks = document.querySelectorAll('.book_item');
        allBooks.forEach(function (book) {
            const title = book.querySelector('h3').innerText.toLowerCase();
            const isMatch = title.includes(searchTitleInput);
  
            if (isMatch) {
                book.style.display = 'block';
            } else {
                book.style.display = 'none';
            }
        });
    }
  
    function moveBookToComplete(bookElement) {
        const greenButton = bookElement.querySelector('.green');
        greenButton.innerText = 'Belum selesai di Baca';
        completeBookshelfList.appendChild(bookElement);
        updateDataToStorage();
    }
    
    function moveBookToIncomplete(bookElement) {
        const greenButton = bookElement.querySelector('.green');
        greenButton.innerText = 'Selesai dibaca';
        incompleteBookshelfList.appendChild(bookElement);
        updateDataToStorage();
    }
    
  
    function removeBook(bookElement, isComplete) {
        if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
            bookElement.remove();
            updateDataToStorage();
        }
    }
  
    function makeBookElement(book) {
        const bookElement = document.createElement('article');
        bookElement.classList.add('book_item');
  
        const bookInfo = `<p data-id="${book.id}">${book.id}</p>
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p>${book.year}</p>`;
  
        const bookAction = `<div class="action">
                        <button class="green">${book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca'}</button>
                        <button class="red">Hapus buku</button>
                      </div>`;
  
        bookElement.innerHTML = bookInfo + bookAction;
  
        return bookElement;
    }
  
    function updateDataToStorage() {
        const incompleteBookshelfData = getBookshelfData(incompleteBookshelfList);
        const completeBookshelfData = getBookshelfData(completeBookshelfList);
  
        localStorage.setItem('incompleteBookshelf', JSON.stringify(incompleteBookshelfData));
        localStorage.setItem('completeBookshelf', JSON.stringify(completeBookshelfData));
    }
  
    function getBookshelfData(bookshelfList) {
        const books = bookshelfList.getElementsByClassName('book_item');
        const bookshelfData = [];
  
        for (const book of books) {
            const id = book.querySelector('p').dataset.id;
            const title = book.querySelector('h3').innerText;
            const author = book.querySelector('p:nth-child(3)').innerText;
            const year = parseInt(book.querySelector('p:nth-child(4)').innerText);
            const isComplete = book.querySelector('.green').innerText === 'Belum selesai di Baca';
  
            bookshelfData.push({ id, title, author, year, isComplete });
        }
  
        return bookshelfData;
    }
  
    function loadBookshelfData() {
        const incompleteBookshelfData = JSON.parse(localStorage.getItem('incompleteBookshelf')) || [];
        const completeBookshelfData = JSON.parse(localStorage.getItem('completeBookshelf')) || [];
  
        for (const book of incompleteBookshelfData) {
            const newBookElement = makeBookElement(book);
            incompleteBookshelfList.appendChild(newBookElement);
        }
  
        for (const book of completeBookshelfData) {
            const newBookElement = makeBookElement(book);
            completeBookshelfList.appendChild(newBookElement);
        }
    }
  
    loadBookshelfData();
  
  });
  