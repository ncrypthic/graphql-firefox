browser.browserAction.onClicked.addListener(() => browser.tabs.create({active: true, url: "./index.html"}));
