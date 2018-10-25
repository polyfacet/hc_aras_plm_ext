var selectedId;
var idMap = new Map();

// My InBasket
var inbasketDefStr = '{"typeName":"InBasket Task", "metadata" : ' + 
'[ ' +
'{"property":"item_type_name", "header":"Type" } ,' + 
'{"property":"item", "header":"Process Item", "openlink":"true", "keyed_name":"true" } ,' + 
'{"property":"keyed_name", "header":"Activity"},' +
'{"property":"instructions", "header":"Instructions"},' + 
'{"property":"vote_now_input", "header":"Sign off", "voteNowInput":"true"},' + 
'{"property":"start_date", "header" : "Start Date", "isDate":"true"},' +
'{"property":"comments", "header" : "Comments"},' +
'{"property":"classification", "header":"Workflow link"}' + 
']' +
' , "searchFields": ' +
'[ ' +
	'{"property":"keyed_name"} ,' + 
	'{"property":"instructions"}' + 
']' +
'}';
var inbasketDef = JSON.parse(inbasketDefStr);


function loadMyInbasketItemsToTable() {
	var items = getMyInbasketItems();
	var table = document.querySelector("#inbasket-table");
	table.innerHTML = "";
	insertToTable(table,items,inbasketDef);
}

function getMyInbasketItems() {
	console.debug("getMyInbasketItems");
	var q = top.aras.newIOMItem("Method", "HC_GetMyInbasketTasks");
	var r = q.apply();
	console.debug({r});
	return r;
}

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
			else if(metaDef.metadata[j].keyed_name && metaDef.metadata[j].openlink) {
				var displayValue = item.getPropertyAttribute(prop,"keyed_name");
				var typeName = metaDef.typeName;
				itemId = item.getProperty(prop);
				if (typeName == "InBasket Task") {
					typeName = item.getPropertyAttribute("item_type_id", "keyed_name");
				}
				var aElementString = `<a href='javascript:void(0)' onclick='openItem("${typeName}", "${itemId}")'>${displayValue}</a> `;
				newRow.insertCell().innerHTML = aElementString;
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
			else if(metaDef.metadata[j].voteNowInput) {
				var displayValue = "Sign off";
				var fields = item.getProperty(prop).split(',');
				var wfpID = fields[0];
				var wfpName = fields[1];
				var actID = fields[2];
				var activityAssignmentId = fields[3];
				var sourceItemId = fields[4];
				var aElementString = `<a href='javascript:void(0)' onclick='voteNow("${wfpID}", "${wfpName}", "${actID}", "${activityAssignmentId}", "${sourceItemId}")'>${displayValue}</a> `;
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
		toggleSectionVisible(ev);
	}
}

function toggleSectionVisible(ev) {
	if(ev) {
		var checked = ev.srcElement.checked;
		var id;
		if (ev.srcElement.id == "inbasketCb") {
			id = 'inbasket-section';
		}
		if (id) {
			toggleVisbilityByElementId(id,checked);
		}
	}
}

function toggleVisbilityByElementId(id,onOrOffBool) {
	var element = document.querySelector(`#${id}`);
	if (element) {
		if (onOrOffBool) {
			element.removeAttribute("hidden");
		}
		else {
			element.setAttribute("hidden","");
		}
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


function voteNow(wfpID, wfpName, actID, asmntID, itemID) {
	if(typeof aras === "undefined"){
		var aras = parent.parent.aras;
	}
	if(!aras) {
		alert("aras is not specified.");
		return;
	}
	var params = {};
	params.aras = aras;
	params.activity = aras.getItemById("Activity", actID, 1);
	params.wflName = wfpName;
	params.wflId = wfpID;
	params.assignmentId = asmntID;
	params.itemId = itemID;
	params.dialogWidth = 700;
	params.dialogHeight = 500;
	params.resizable = true;
	params.scroll = true;
	params.content = "InBasket/InBasket-VoteDialog.aspx";
	aras.getMostTopWindowWithAras(window).ArasModules.Dialog.show("iframe", params).promise.then(function (res) {
	if (parent && parent.Core_loadProcessReport) {
		parent.setTimeout(parent.Core_loadProcessReport, 0);
		}
	});
}
