

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

function getBOM(itemId) {
	var q = top.aras.newIOMItem("Part BOM", "get");
	q.setProperty("source_id", itemId);
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