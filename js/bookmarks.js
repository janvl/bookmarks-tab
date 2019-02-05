//********************************************************************//
// SETTINGS
//********************************************************************//
var newTab = "on"
var customTab = "";

//********************************************************************//
// BOOKMARKS
//********************************************************************//

// RETRIEVE BOOKMARKS
function retrieveBookmarks(){
	chrome.bookmarks.getTree(function callback(bookmarks){
		console.log("version 0.0.4");
		
		// Only retrieve the first folder containing the same bookmarks that appear in your 'bookmarks bar'
		bookmarks = bookmarks[0].children[0].children;
		loadBookmarks(bookmarks);
	});
}

var importantBookmarks = new Array();

// LOAD BOOKMARKS
function loadBookmarks(bookmarks){
	console.log(bookmarks);
	var content = document.createElement("div"); 
	content.setAttribute("id", "bookmarks");
	
	// Loop through array and retrieve the title of the folders & the bookmarks
	for(var i = 0; i < bookmarks.length; i++){
		title = bookmarks[i].title;
		links = bookmarks[i].children;
		
		// Check if this is a folder		
		if(links){
			// Create folders
			var folder = document.createElement("div");    
			folder.classList.add("folder");
			
			// Add H3 with title
			var folderTitle = document.createElement("h3"); 
			folderTitle.innerHTML += title;
			folder.appendChild(folderTitle);
			
			// Add the number of links to the title element
			var folderCount = document.createElement("span")
			folderCount.innerHTML = "(" + links.length + ")";
			folderTitle.appendChild(folderCount);
			
			// Loop through links and create list 
			var linkList = document.createElement("ul");
			
			for(var k = 0; k < links.length; k++){
				// Add bookmark to linklist
				addBookmark(links[k], linkList);
			}
			
			// Add list with links to folder
			folder.appendChild(linkList);
			
			// Add folders
			content.appendChild(folder)
		}else{
			// This is a single bookmark, save it for later
			url = bookmarks[i].url;
			id = bookmarks[i].id;
			
			importantBookmarks.push({
				title: title,
				url: url,
				id: id
			});
		}
	}
	
	// Tackle the important bookmarks
	if(importantBookmarks.length){
		
		// Setup up container
		var folder = document.createElement("div");    
		folder.classList.add("folder");
		var linkList = document.createElement("ul");
		
		// Loop through importantBookmarks
		for(var i = 0; i < importantBookmarks.length; i++){
			addBookmark(importantBookmarks[i], linkList);
		}
		
		// Add list with links to folder
		folder.appendChild(linkList);
		
		// Add folders
		content.prepend(folder)
	}
			
	// Add folders to page
	if(document.body != null){ document.body.prepend(content); }
	
	console.log(importantBookmarks);
}

// ADD BOOKMARKS TO A FOLDER
function addBookmark(bookmark, target){
	// Retrieve Link Title, URL & ID
	var linkTitle = bookmark.title;
	var linkURL = bookmark.url;
	var linkID = bookmark.id;
	
	// Create list item
	var linkListItem = document.createElement("li");
	
	// Create link element
	var link = document.createElement("a");
	link.innerHTML += linkTitle;
	link.setAttribute("href", linkURL);
	link.setAttribute("data-id", linkID);
	link.classList.add("bookmark");
	
	// Add link to list-item
	linkListItem.appendChild(link);
	
	// Create remove element
	var remove = document.createElement("a");
	remove.innerHTML = "remove";
	remove.setAttribute("href", "#");
	remove.addEventListener("click", function(e){ 
		e.preventDefault();
		removeBookmark(linkID);
	});
	remove.classList.add("remove");
	
	// Add remove to list-item
	linkListItem.appendChild(remove);
	
	// Add list-item to list
	target.appendChild(linkListItem);
}

// REFRESH PAGE
function refreshPage(){
	location.reload();
}

// ⛔️ REMOVES BOOKMARK ⛔️
function removeBookmark(id){
	console.log("remove bookmark #" + id);
	
	// Ask confirmation before proceeding
	if(confirm("Are you sure you want to remove this bookmark?")){
		
		// Remove the bookmark from chrome's storage
		chrome.bookmarks.remove(id, refreshPage);
	}
}

//********************************************************************//
// HANDLE SETTINGS
//********************************************************************//

// On load, set eventHandlers & retrieve settings
window.addEventListener('load', function() {
    initSettingHandlers();
    retrieveSettings();
});

// RETRIEVE ALL THE SETTINGS
function retrieveSettings(){
	chrome.storage.sync.get(["newTab", "customTab"], function(result) {
      newTab = result["newTab"];
      customTab = result["customTab"];
      setSettingsPage();
      retrieveBookmarks();
    });
}

// PRE-FILL THE SETTINGS BASED ON WHAT'S IN THE STORAGE
function setSettingsPage(){
	document.querySelectorAll("input[name='newTab'][value='" + newTab + "']")[0].checked=true;
	
	if(customTab != ""){
		document.getElementById("customTab").value = customTab;
	}
}


// SET EVENT HANDLERS FOR THE SETTINGS
function initSettingHandlers(){
	document.getElementById("settingsToggle").addEventListener('click', function(elem) {
		document.getElementById("settingsToggle").classList.toggle('is-active');
		document.getElementById("settings").classList.toggle('is-shown');
	});
	
	var tabSettings = document.getElementsByName("newTab");
	tabSettings.forEach(function(elem) {
		elem.addEventListener('click', function() {
		    setNewTab(elem.value);
		})
	});
	
	document.getElementById("saveCustomTab").addEventListener('click', function() {
		var value= document.getElementById("customTab").value;
		setCustomTab(value);
	});
}

// TOGGLE THE NEW TAB SETTING
function setNewTab(value){
	chrome.storage.sync.set({newTab: value});
	newTab = value;
	showSavedAlert();
	
}


// SET THE URL TO THE CUSTOM TAB
function setCustomTab(value){
	chrome.storage.sync.set({customTab: value});
	customTab = value;
	showSavedAlert();
}

// BIREFLY SHOW THE ALERT THAT NOTIFIES THE USER THE SETTINGS HAVE BEEN SAVED
function showSavedAlert(){
	var alertMessage = document.getElementById("alert");
	
	// Show the alert
	alertMessage.classList.add('is-shown');
	
	// Wait 1s and hide alert again.
	setTimeout(function(){ alertMessage.classList.remove('is-shown'); }, 1000);
}