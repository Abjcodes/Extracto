//Creates a new tab after the image has been loaded

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "notification") {
        var newURL = chrome.extension.getURL('newTab.html');
        chrome.tabs.create({ url: newURL });
    }
});