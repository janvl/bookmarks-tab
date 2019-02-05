//********************************************************************//
// BACKGROUND SCRIPT
//********************************************************************//


// DECIDE WHICH URL TO LOAD WHEN OPENING A NEW TAB
chrome.tabs.onCreated.addListener(function callback(tab) {
	
	// Track if the user opens a new empty
	if(tab.url == "chrome://newtab/"){
		
		// Retrieve the newTab Setting
		chrome.storage.sync.get(["newTab"], function(result) {
			newTab = result["newTab"];
			
			// If newTab == on, show the default bookmarks.html
			if(newTab == "on"){	
				chrome.tabs.update(tab.id, {
			      "url": "bookmarks.html"
			    });				
			}else{
				
				// If newTab == off, retrieve the customTab URL
				chrome.storage.sync.get(["customTab"], function(result) {
					customTab = result["customTab"];
					
					// Make sure it works, even when customTab is empty					
					if(customTab == ""){ 
						customTab = "chrome://newtab/"
					}
					
					// Show the customTab in the newly openend tab	
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