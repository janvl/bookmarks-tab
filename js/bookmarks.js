// RETRIEVE BOOKMARKS

chrome.bookmarks.getTree(function callback(bookmarks){
	console.log("version 0.0.2");
	
	// Only retrieve the first folder containing the same bookmarks that appear in your 'bookmarks bar'
	bookmarks = bookmarks[0].children[0].children;
	loadBookmarks(bookmarks);
});

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
			importantBookmarks.push({
				title: title,
				url: url
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
	
	// Add list-item to list
	target.appendChild(linkListItem);
}