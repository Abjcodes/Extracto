import Tesseract from 'tesseract.js';

//To store the method, format and the persistent state in the chrome storage
chrome.storage.sync.get((config) => {
    if (!config.method) {
        chrome.storage.sync.set({ method: 'crop' })
    }
    if (!config.format) {
        chrome.storage.sync.set({ format: 'png' })
    }
    if (config.dpr === undefined) {
        chrome.storage.sync.set({ dpr: true })
    }
})

function inject(tab) {
    chrome.tabs.sendMessage(tab.id, { message: 'init' }, (res) => {
        if (res) {
            clearTimeout(timeout)
        }
    })
    //To insert loader and text
    var timeout = setTimeout(() => {
        chrome.tabs.insertCSS(tab.id, { file: 'vendor/jquery.Jcrop.min.css', runAt: 'document_start' })
        chrome.tabs.insertCSS(tab.id, { file: 'css/content.css', runAt: 'document_start' })

        chrome.tabs.executeScript(tab.id, { file: 'vendor/jquery.min.js', runAt: 'document_start' })
        chrome.tabs.executeScript(tab.id, { file: 'vendor/jquery.Jcrop.min.js', runAt: 'document_start' })
        chrome.tabs.executeScript(tab.id, { file: 'content/content.js', runAt: 'document_start' })

        setTimeout(() => {
            chrome.tabs.sendMessage(tab.id, { message: 'init' })
        }, 100)
    }, 100)
}


//Called when the icon is clicked
chrome.browserAction.onClicked.addListener((tab) => {
    inject(tab)
})
//Called when alt+s is called
chrome.commands.onCommand.addListener((command) => {
    if (command === 'take-screenshot') {
        chrome.tabs.getSelected(null, (tab) => {
            inject(tab)
        })
    }
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
    //Cropping using the crop function and capturing the screenshot using the captureVisibleTab API, if the message is capture
    if (req.message === 'capture') {
        chrome.storage.sync.get((config) => {

            chrome.tabs.getSelected(null, (tab) => {

                chrome.tabs.captureVisibleTab(tab.windowId, { format: config.format }, (image) => {
                    crop(image, req.area, req.dpr, config.dpr, config.format, tab,(cropped) => {
                        res({ message: 'extracted' })
                    })
                })
            })
        })
    }
    
    else if (req.message === 'active') {
        if (req.active) {
            //Setting the active badge in the extension title
            chrome.storage.sync.get((config) => {
                if (config.method === 'crop') {
                    chrome.browserAction.setTitle({ tabId: sender.tab.id, title: 'Select region' })
                    chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: 'active' })
                }
            })
        }
        else {
            chrome.browserAction.setTitle({ tabId: sender.tab.id, title: 'Copy text from image' })
            chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: '' })
        }
    }
    return true
})


function crop(image, area, dpr, preserve, format, tab, done) {
    //Dpr = device pixel ratio
    var top = area.y * dpr
    var left = area.x * dpr
    var width = area.w * dpr
    var height = area.h * dpr
    var w = (dpr !== 1 && preserve) ? width : area.w
    var h = (dpr !== 1 && preserve) ? height : area.h

    var canvas = null
    if (!canvas) {
        canvas = document.createElement('canvas')
        document.body.appendChild(canvas)
    }
    canvas.width = w
    canvas.height = h

    var img = new Image()
    img.onload = () => {
        var context = canvas.getContext('2d')
        context.drawImage(img,
            left, top,
            width, height,
            0, 0,
            w, h
        )

        //Cropped image
        var cropped = canvas.toDataURL(`image/${format}`)

        //Implementation of text detection
        Tesseract.recognize(cropped, {
            lang: 'eng'
        })
            .then(function (result) {

                document.oncopy = function (event) {
                    event.clipboardData.setData('text/plain', result.text);
                    event.preventDefault();
                };
                 document.execCommand("copy", false, null);
                chrome.tabs.sendMessage(tab.id, { message: 'loaded' }, (res) => {
                    if (res) {
                        clearTimeout(timeout)
                    }
                })
            });


        done(cropped)
    };
    img.src = image
}
