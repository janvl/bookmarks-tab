chrome.tabs.onCreated.addListener(function callback(tab) {
	if(tab.url == "chrome://newtab/"){
		updateProperties = {
	      "url": "bookmarks.html"
	    };
		chrome.tabs.update(tab.id, updateProperties);
	}	
});

chrome.browserAction.onClicked.addListener(function callback(){
	createProperties = {
      "url": "bookmarks.html"
    };

	chrome.tabs.create(createProperties);
})