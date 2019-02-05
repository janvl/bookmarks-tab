//********************************************************************//
// BACKGROUND SCRIPT
//********************************************************************//


// DECIDE WHICH URL TO LOAD WHEN OPENING A NEW TAB
chrome.tabs.onCreated.addListener(function callback(tab) {
	if(tab.url == "chrome://newtab/"){
		chrome.storage.sync.get(['newTab'], function(result) {
			newTab = result["newTab"];
			
			if(newTab == "on"){	
				chrome.tabs.update(tab.id, {
			      "url": "bookmarks.html"
			    });				
			}else{
				chrome.storage.sync.get(['customTab'], function(result) {
					customTab = result["customTab"];
					chrome.tabs.update(tab.id, {
				      "url": customTab
				    })
				});	
			}
		});
	}	
});

// ALLWAYS OPEN THE BOOKMARKS.HTML WHEN CLICKING THE EXTENSION ICON
chrome.browserAction.onClicked.addListener(function callback(){
	chrome.tabs.create({
      "url": "bookmarks.html"
    });
})