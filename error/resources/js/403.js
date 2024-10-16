if (document.referrer === "" || !document.referrer.includes(window.location.hostname)) {
    window.location.href = "../index.html";
} else {
    // redirect to previous page
    //window.location.href = document.referrer.split('?')[0];
    redirectToPrePreviousPage();
}

// Function to redirect to the pre-previous page
function redirectToPrePreviousPage() {
    var historyArr = JSON.parse(sessionStorage.getItem("pageHistory")) || [];
    if (historyArr.length >= 3) {
        // Get the pre-previous page URL
        var prePreviousPageUrl = historyArr[historyArr.length - 3];
        // Check if the URL is from the same domain
        var url = new URL(prePreviousPageUrl);
        if (url.hostname === window.location.hostname) {
            // Redirect to the pre-previous page
            window.location.href = prePreviousPageUrl;
        } else {
            console.log("The pre-previous page is not from the same domain.");
        }
    } else {
        console.log("No pre-previous page found in the history.");
    }
}

function Redirect() {
    var countdownElement = document.getElementById("countdown-text");
    var timeLeft = parseInt(countdownElement.innerHTML);
    if (isNaN(timeLeft)) {
        console.error("Invalid countdown value");
        return;
    }
    var countdownTimer = setInterval(function () {
        var seconds = timeLeft % 60;
        countdownElement.innerHTML = seconds + "s";
        if (timeLeft === 0) {
            clearInterval(countdownTimer);
            window.location.href = "../index.html";
        }
        timeLeft--;
    }, 1000);
}