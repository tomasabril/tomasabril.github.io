document.getElementById("btn-load").onclick = loadFile;
document.getElementById("btn-calculate").onclick = sortAndShowBooks;
var booksOrig;


function loadFile() {
    // load json with list of book from remote location
    var requestUrl = document.getElementById("input-file").value;
    var request = new XMLHttpRequest();
    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.send();
    request.onload = function () {
        booksOrig = request.response;
        sortAndShowBooks();
    };
}

function sortAndShowBooks() {
    if (booksOrig == null) {
        alert("load books first");
        return;
    }
    // based on parameters sort all books
    var pgW = document.getElementById('page-weight').value;
    var willW = document.getElementById('will-weight').value;
    var langPref = document.getElementById('lang-pref').value;

    var maxPages = booksOrig.reduce((prev, curr) => (prev.pages > curr.pages) ? prev : curr).pages;

    var books = booksOrig.map(b => {
        var calcBook = b;
        var pagesValue = (maxPages - b.pages * pgW);
        var willValue = b.will * willW;
        var langValue = (langPref == 'any' || langPref == b.language) ? 1 : 0;
        calcBook.calc = (pagesValue + willValue) * langValue;
        return calcBook;
    });

    books.sort((a, b) => b.calc - a.calc);

    var result = document.getElementById('result');
    // remove old result
    while (result.hasChildNodes()) {
        result.removeChild(result.firstChild);
    }
    // diplay result on page
    for (var i = 0; i < books.length; i++) {
        if (books[i].read == true) {
            continue;
        }
        var div = document.createElement('div');
        div.innerHTML =
            '<h3>' + books[i].title + '</h3>' +
            '<ul>' +
            '<li>' + books[i].author + '</li>' +
            '<li>' + books[i].pages + ' pages</li>' +
            '<li>' + books[i].language + '</li>' +
            '<li>will: ' + books[i].will + '</li>' +
            '<li>calc: ' + books[i].calc + '</li>' +
            '</ul>';

        result.appendChild(div);
    }

}
