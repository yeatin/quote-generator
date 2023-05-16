const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
let ct = 0;

const showLoading = () => {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// hide loading
const removeLoading = () => {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

const showError = () => {
    loader.hidden = true;
    quoteContainer.hidden = true;
    body = document.getElementsByTagName('body')[0];
    error = document.createElement('h1');
    body.appendChild(error);
    error.classList.add('error-container')
    error.innerText = 'Quote Generator stopped loading. Please refresh your web page.'
}

const getQuote = async () => {
    showLoading();
    const url =
        'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';
    const corsUrl =
        'https://cors-anywhere.herokuapp.com/';
    try {
        const res = await fetch(corsUrl + url);
        const data = await res.json();
        // to check if the quote is repeated
        if(data.quoteAuthor === quoteAuthor.innerText) {
            return getQuote();
        }
        if (data.quoteAuthor === '') {
            quoteAuthor.innerText = 'UNKNOWN';
        } else {
            quoteAuthor.innerText = data.quoteAuthor;
        }
        if (data.quoteText.length >= 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        removeLoading();
        // clear counter when the loading is successful
        ct = 0;
    } catch (err) {
        ct ++;
        console.log('No quote', err)
        if (ct < 10) {
            getQuote();
        } else {
            showError();
        }
    }
}

tweetQuote = () => {
    const quote = quoteText.innerText;
    const author = quoteAuthor.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// on load
getQuote();