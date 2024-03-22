const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "temp-book";
const STORAGE_KEY = "book-LocalStorage";


function isStorageExist() {
    if (typeof Storage === undefined) {
        alert("browser ini tidak mendukung local storage, operasi dihentikan");
        return false;
    }
    return true;
}



inputBookIsComplete.addEventListener('change', function () {
    const bookSubmit = document.querySelector('#bookSubmit>span')
    if (inputBookIsComplete.checked) {
        bookSubmit.innerText = 'Selesai Dibaca'
    } else {
        bookSubmit.innerText = 'Belum Selesai Dibaca'
    }
})

function openForm() {
    document.getElementById("Form").style.display = "block";
}
  
function closeForm() {
    document.getElementById("Form").style.display = "none";
} 



function loadDataFromStorage() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function updateDataFromStorage() {
    if (isStorageExist()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}




const newBook = () => {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const category = document.getElementById("inputBookCategory").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;
    const object = {
        id: +new Date(),
        title: title,
        author: author,
        year: year,
        category: category,
        isCompleted: isCompleted,
    };

    books.push(object);
    document.dispatchEvent(new Event(RENDER_EVENT));
    updateDataFromStorage();
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("inputBook").addEventListener("submit", (e) => {
        e.preventDefault();
        newBook();
    });

    document
        .getElementById("searchBookTitle")
        .addEventListener("keyup", (e) => {
            const searchString = e.target.value.toUpperCase();
            searchBook(searchString);
        });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

const createBook = (book) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book-item");
    bookItem.innerHTML = "";

    if (book.isCompleted) {
        bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.year}</p>
            <p>${book.category}</p>
            <div class="action">
                <button class="incomplete" onclick="moveToUnCompleted(${book.id})">
                Belum Selesai
                </button>
                <button class="trash" onclick="deletebook(${book.id})">
                Hapus
                </button>
            </div>`;
    } else {
        bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.year}</p>
            <p>${book.category}</p>
            <div class="action">
                <button class="complete" onclick="moveToCompleted(${book.id})">
                Selesai dibaca
                </button>
                <button class="trash" onclick="deletebook(${book.id})">
                Hapus
                </button>
            </div>`;
    }

    return bookItem;
};


document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
    const complete = document.getElementById("completeBookList");
    const incomplete = document.getElementById("incompleteBookList");
    complete.innerHTML = "";
    incomplete.innerHTML = "";
    for (const book of books) {
        const bookContent = createBook(book);
        if (book.isCompleted) {
            complete.append(bookContent);
        } else {
            incomplete.append(bookContent);
        }
    }
});

const moveToCompleted = (bookId) => {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    updateDataFromStorage();
};


const moveToUnCompleted = (bookId) => {
    const bookTarget = findBook(bookId);
    if (bookTarget === null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    updateDataFromStorage();
};



const deletebook = (bookId) => {
    if (confirm ("apakah anda ingin menghapus buku ini")){
        const bookTarget = findIndex(bookId);
        if (bookTarget === 1) return;
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        updateDataFromStorage();
    } else {
        return
    }
};


function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function findIndex(bookId) {
    let index = 0;
    for (const book of books) {
        if (book.id === bookId) return index;
        index++;
    }
    return -1;
}

const searchBook = (string) => {
    const bookItem = document.querySelectorAll(".book-item");
    for (const item of bookItem) {
        const title = item.childNodes[1];
        if (title.innerText.toUpperCase().includes(string)) {
            title.parentElement.style.display = "";
        } else {
            title.parentElement.style.display = "none";
        }
    }
};




