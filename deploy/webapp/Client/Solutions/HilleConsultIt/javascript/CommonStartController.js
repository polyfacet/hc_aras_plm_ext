var selectedId;
var idMap = new Map();


function insertToTable(table, items, metaDef) {
	//console.debug({metaDef});
	var captionRow = table.appendChild(document.createElement('caption'));
	let div1 = document.createElement("div");
	div1.setAttribute("class","tableCaption");
	if (metaDef.typeName == "InBasket Task") {
		// Add time stamp
		div1.classList.add("inbasket");
		let spanEl = document.createElement("span");
		let currentDateValue = new Date();
		let dateString = currentDateValue.toLocaleString("sv-SE")
		spanEl.innerText = `Refreshed at: ${dateString}`;
		div1.appendChild(spanEl);
	}
	else {
		div1.innerHTML = metaDef.typeName;
	}
	captionRow.appendChild(div1);

	// Create thead
	var thead = table.createTHead();
	
	/*
	var captionRow = thead.insertRow();
	if (metaDef.typeName == "InBasket Task") {
		// Add time stamp
		let div1 = document.createElement("div");
		let spanEl = document.createElement("span");
		let currentDateValue = new Date();
		let dateString = currentDateValue.toLocaleString("sv-SE")
		spanEl.innerText = `Refreshed at: ${dateString}`;
		div1.appendChild(spanEl);
		captionRow.appendChild(div1);
	}
	else {
		var th1 = document.createElement("th");
		th1.setAttribute("class","tableCaption");
		th1.innerHTML = metaDef.typeName;
		captionRow.appendChild(th1);
	}
	*/
	
	var headRow = thead.insertRow();
	for (var i = 0; i<metaDef.metadata.length; i++) {
		var th = document.createElement("th");
		th.innerHTML = metaDef.metadata[i].header;
		headRow.appendChild(th);
	}
	
	// Add content rows
	let tbody = table.appendChild(document.createElement('tbody'));
	var itemCount = items.getItemCount();
	for (var i = 0; i < itemCount; i++ ){ 
		var item = items.getItemByIndex(i);
		var itemId = item.getID();
		idMap.set(itemId,item);
		
		var newRow = tbody.insertRow();
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
			else if(metaDef.metadata[j].wfLink) {
				var displayValue = "View Workflow";
				var wfpID = item.getProperty(prop);
				var wfpName = item.getProperty('pname');
				var aElementString = `<a href='javascript:void(0)' onclick='openWorkflowProcess("${wfpID}", "${wfpName}")'>${displayValue}</a> `;
				newRow.insertCell().innerHTML = aElementString;
			}
			else {
				newRow.insertCell().textContent = item.getProperty(prop);
			}
		}
		// Add selected id event handler
		newRow.onclick = rowClick(newRow);
		
	}
	table.classList.add("sortable");
	sorttable.makeSortable(table);
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
	//console.log({ev});
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
			loadMyInbasketItemsToTable();
		}
		if (id) {
			toggleVisbilityByElementId(id,checked);
		}
	}
}

function toggleVisbilityByElementId(id,onOrOffBool) {
	let element = document.querySelector(`#${id}`);
	if (element) {
		if (onOrOffBool) {
			element.style.display = "block";
		}
		else {
			element.style.display = "none";
		}
	}
}

function setUserOption(ev) {
	//console.log("setUserOption");
	//console.log({ev});
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


function loadAllTables(searchValue) {
	console.log({searchValue});
	let table;
	let userCheckbox;
	let includeSwitchId;
	let tableId;

	itemDefinitions.forEach(function(itemDef, index, array) {
		//console.log(itemDf, index);
		includeSwitchId = itemDef.includeSwitchId;
		tableId = itemDef.tableId;
		userCheckbox = document.querySelector(`#${includeSwitchId}`);
		table = document.querySelector(`#${tableId}`);;
		table.innerHTML = "";
		if (userCheckbox.checked) {
			loadItemsToTable(table,itemDef,itemDef.typeName ,searchValue);
		}
	});
}

function loadMotd() {
	let q = top.aras.newIOMItem("Method", "HC_GetMotd");
	let r = q.apply();
	if (!r.isError()) {
		let r1 =r.dom.firstChild.firstChild.firstChild.innerHTML.trim();
		let motdEl = document.querySelector("#motd");
		motdEl.innerHTML = r1;
		motdEl.style.display = "block";
	}
}