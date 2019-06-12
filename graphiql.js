browser.browserAction.onClicked.addListener(() => browser.tabs.create({active: true, url: "/index.html"}));


browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(({url, params})=> {
    fetch(url, {
      method: 'post',
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      console.log(response);
      try {
        port.postMessage({response, error: null});
      } catch (error) {
        port.postMessage({response: null, error});
      }
    }).catch(e => {
      console.log(e.stack);
      port.postMessage({response: null, error: e})
    });
  });
})
