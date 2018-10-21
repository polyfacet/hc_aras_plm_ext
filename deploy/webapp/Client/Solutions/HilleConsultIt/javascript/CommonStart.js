var selectedId;
var idMap = new Map();


function getLastItems(typeName, pageSize, onlyMine) {
	if (!pageSize) {
		pageSize = "10";
	}
	var q = top.aras.newIOMItem(typeName, "get");
	q.setAttribute("orderBy","modified_on DESC");
	q.setAttribute("page","1");
	q.setAttribute("pagesize",pageSize);
	if (onlyMine) {
		q.setProperty("modified_by_id",top.aras.getUserID());
	}
	var r = q.apply();
	return r;
}


function findItems(itemDef, pageSize, searchString, onlyLatestReleased) {
	if (!pageSize) {
		pageSize = "10";
	}
	var q = top.aras.newIOMItem(itemDef.typeName, "get");
	q.setAttribute("orderBy","modified_on DESC");
	q.setAttribute("page","1");
	q.setAttribute("pagesize",pageSize);
	
	// Option on Latest Released
	if (onlyLatestReleased) {
		q.setProperty("is_released", "1");
		q.setProperty("generation","0");
		q.setPropertyCondition('generation', 'gt'); 	
		var logicalOR1 = q.newOR(); 
		logicalOR1.setProperty("state", "Released");
		logicalOR1.setProperty("state", "In Change");
	}
	
	if (itemDef.searchFields) {
		// Loop search fields
		var logicalOR = q.newOR(); 
		for (var i = 0; i<itemDef.searchFields.length;i++){
			var prop = itemDef.searchFields[i].property;
			logicalOR.setProperty(prop,searchString);
			logicalOR.setPropertyCondition(prop, 'like'); 
		}
	}
	else {
		console.log("No search definition for " + itemDef.typeName);
		q.setPropertyAttribute("item_number","condition","like");
		q.setProperty("item_number",searchString);
	}

	var r = q.apply();
	return r;	
}

function open(){
	console.debug("open");
	var item = getSelectedItem();
	if (item == null) {
		console.debug("No row selected");
		return false;
	}
	top.aras.uiShowItemEx(item.node,"tab view");
}

function getBOM(itemId) {
	var q = top.aras.newIOMItem("Part BOM", "get");
	q.setProperty("source_id", itemId);
	var r = q.apply();
	return r;
}

function openFile(fileId) {
	console.debug("Open file");
	top.aras.uiShowItem("File", fileId);
}

function openItem(itemType, itemId) {
	console.debug("Open item");
	console.debug({itemType});
	console.debug({itemId});
	top.aras.uiShowItem(itemType, itemId);
}

function insertToTable(table, items, metaDef) {
	console.debug({metaDef});
	// Create thead
	var thead = table.createTHead();
	var captionRow = thead.insertRow();
	var th1 = document.createElement("th");
	th1.setAttribute("class","tableCaption");
	th1.innerHTML = metaDef.typeName;
	captionRow.appendChild(th1);
	var headRow = thead.insertRow();
	for (var i = 0; i<metaDef.metadata.length; i++) {
		var th = document.createElement("th");
		th.innerHTML = metaDef.metadata[i].header;
		headRow.appendChild(th);
	}
	
	// Add content rows
	var itemCount = items.getItemCount();
	for (var i = 0; i < itemCount; i++ ){ 
		var item = items.getItemByIndex(i);
		var itemId = item.getID();
		idMap.set(itemId,item);
		
		var newRow = table.insertRow();
		newRow.setAttribute("itemId", itemId);
		for (var j = 0; j<metaDef.metadata.length; j++) {
			var prop = metaDef.metadata[j].property;
			if (metaDef.metadata[j].isDate) {
				var dateValue = new Date(item.getProperty(prop));
				newRow.insertCell().textContent = dateValue.toLocaleString("sv-SE");
			}
			else if(metaDef.metadata[j].keyed_name) {
				newRow.insertCell().textContent = item.getPropertyAttribute(prop,"keyed_name");
			}
			else if(metaDef.metadata[j].isFile) {
				var displayValue = item.getPropertyAttribute(prop,"keyed_name");
				var fileId = item.getProperty(prop);
				var aElementString = "<a href='javascript:void(0)' onclick='openFile(\""+fileId+"\")'>"+displayValue+"</a>";
				newRow.insertCell().innerHTML = aElementString;
			}
			else if(metaDef.metadata[j].openlink) {
				var displayValue = item.getProperty(prop);
				var aElementString = `<a href='javascript:void(0)' onclick='openItem("${metaDef.typeName}", "${itemId}")'>${displayValue}</a> `;
				newRow.insertCell().innerHTML = aElementString;
			}
			else {
				newRow.insertCell().textContent = item.getProperty(prop);
			}
		}
		// Add selected id event handler
		newRow.onclick = rowClick(newRow);
		
	}
}

function rowClick(row) {
	return function() {
	// Set selected id 
	if (row.attributes.itemid != null) {
		var id = row.attributes.itemid.value;
		selectedId = id;
		var item = idMap.get(selectedId);
		showInTopPanel(item);
	}
  };
}

function showInTopPanel(item) {
	var topPanelElement = document.querySelector("#top-panel");
	if (topPanelElement) {
		//topPanelElement.textContent = item.getType();
	}
}	

	
function getSelectedItem() {
	var item = idMap.get(selectedId);
	return item;
}

function loadItemsToTable(table, itemDef, itemType, searchString) {
	var onlyMine = document.querySelector("#onlyMine").checked;
	var itemLimit = document.querySelector("#itemLimit").value;
	var onlyLatestReleased = document.querySelector("#onlyLatestReleased").checked;
	
	var searchMode = false;
	if (searchString) {
		if (typeof searchString == "string") {
			searchMode = true;
		}
	}
	
	// Get Items from server
	var items;
	var message;
	if (searchMode) {
		console.log("searchMode");
		items = findItems(itemDef, itemLimit, searchString, onlyLatestReleased);	
		message = "Search results for: " + searchString;
	}
	else {
		console.log("latest mode");
		items = getLastItems(itemType, itemLimit, onlyMine);	
		message = "Latest modified results";
	}
	
	// Clear and add items to table
	table.innerHTML = "";
	insertToTable(table,items,itemDef);
	var resultDiv = document.querySelector("#resultMessage");
	resultDiv.textContent = message;
}

function storeUserSetting(id,value) {
	localStorage.setItem(id,value);
}

function getUserSetting(id) {
	var value = localStorage.getItem(id);
	return value;
}

function toggleCb(ev) {
	console.log({ev});
	if (ev) {
		storeUserSetting(ev.srcElement.id,ev.srcElement.checked.toString());
	}
}

function setUserOption(ev) {
	console.log("setUserOption");
	console.log({ev});
	if (ev) {
		storeUserSetting(ev.srcElement.id,ev.srcElement.value.toString());
	}
}

function searchItems() {
	var searchValue = document.querySelector("#searchField").value;
	loadAllTables(searchValue);
}

function refreshLatest() {
	loadAllTables();
}
