var gridReady = false;
var aras = parent.aras;
var deletedFont_const = "Arial-italic-8";
var deletedTextColor_const = "#b0b0b0";

var currSelCell = null;
var currSelRowId = "";
var currSelCol = -1;

var grid_PPM;
var gridApplet = null;

function onGridLoad() {
	gridReady = true;
	grid_PPM = new PopupMenu("Grid_PPM", "PopupMenu", false);
	grid_PPM.setOnClick(onPopupMenuClicked);
}

function initGrid() {
	if (!gridReady) {
		setTimeout(initGrid, 100);
		return;
	}
}
function onRowSelect(rowId) {
	currSelRowId = rowId;
	if (!relTypeId) {
		return null;
	}
	var relationship = getRelationship(rowId);
	if (!relationship) {
		alert(aras.getResource("plm", "gridtools.cannot_get_relship_id", id));
		return;
	}
	updateToolbar();
}

function deselectRow() {
	var currSelCell = null;
	var currSelRowId = "";
	var currSelCol = -1;
	if (gridApplet) {
		gridApplet.Deselect(); //setSelectedRow(currSelCol, false);
	}
}

/// keyedName
var bKEYEDNAME_INPUT_IS_IN_PROGRESS = false;  //  ability to directly key a value in the field/cell(against Dialog)

var zeroError = {};
zeroError.number = 0;
zeroError.description = aras.getResource("plm", "gridtools.ok");

function onEditCell(mode, rowId, col) {
	if (mode === 0) {
		return onGridCellEdit_mode0(rowId, col);
	}
	if (mode == 1) {
		return onGridCellEdit_mode1(rowId, col);
	}
	if (mode == 2) {
		return onGridCellEdit_mode2(rowId, col);
	}
}

function onGridCellEdit_mode0(rowId, col) {
	if (!isEditMode) {
		return false;
	}

	if (propsArr[col].DRL == "R" && !(getLockedStatusStr(rowId) == "user" || getLockedStatusStr(rowId) == "new")) {
		return false;
	}

	var columnName = propsArr[col].name;
	var functionName = "onBeforeEditMode_" + columnName;
	var res = true;
	if (window[functionName]) {
		res = window[functionName](rowId);
	}
	if (res === false) {
		return false;
	}

	var result = false;
	try {
		var propDT = propsArr[col].data_type;
		if (propDT == "item") {
			var source_IT = getItemById("ItemType", propsArr[col].data_source, 1);
			if (!source_IT) {
				//			aras.AlertError('ItemType with id "'+propsArr[col].data_source+'" not found !');
				//      alert("Choose type, please");
				result = true;
				throw zeroError;
			}
			bKEYEDNAME_INPUT_IS_IN_PROGRESS = true;
		}
		result = true;
	}
	catch (excep) {
		if (excep != zeroError) {
			throw excep;
		}
	}

	return result;
}

function onGridCellEdit_mode1(rowId, col) {
	var cell = gridApplet.cells(rowId, parseInt(col));

	function preserverCheckBoxState() {
		cell.setValue("<checkbox state=" + (cell.isChecked() ? "0" : "1") + ">");
	}

	if ((!isEditMode || (propsArr[col].DRL == "R" && !(getLockedStatusStr(rowId) == "user" || getLockedStatusStr(rowId) == "new"))) && cell.isCheckbox()) {
		preserverCheckBoxState();
	}

	currSelCell = cell;
	currSelCol = col;
	var value;
	var prop = propsArr[col];

	if (cell.isCheckbox()) {
		value = cell.isChecked() ? 1 : 0;
	}
	else {
		value = cell.getValue();
	}

	if (setupProperty && prop.data_type != "item") {
		setupProperty(value, true);
	}
}

function onGridCellEdit_mode2(rowId, col) {
	if (bKEYEDNAME_INPUT_IS_IN_PROGRESS) {
		var cell = gridApplet.cells(rowId, parseInt(col));
		res = onInputKeyedNameFinished(cell.getValue(), col);
	}

	var prop = propsArr[col];
	if (prop.data_type == "item") {
		var relationship = getRelationship(rowId);
		updateRow(relationship);
	}
}

function onF2Pressed() {
	if (!bKEYEDNAME_INPUT_IS_IN_PROGRESS) {
		return;
	}

	var source_IT = getItemById("ItemType", propsArr[currSelCol].data_source, 1);
	if (source_IT) {
		var propSource_ITName = source_IT.getProperty("name");
		setTimeout("showDialog(\"" + propSource_ITName + "\")", 10);
	}
}

function onKeyPressed(kEv) {
	// call specific handlers
	if (currSelCol == -1) {
		return;
	}

	var functionName = "on_" + propsArr[currSelCol].name + "_KeyPressed";
	var executed = false;
	var res;
	var code = "try {res = " + functionName + "(kEv); executed=true;} catch (ex) {res = undefined;}";
	var evalFuntion = window.eval;
	evalFuntion(code);
	if (executed) {
		return res;
	}

	var keyCode = kEv.getKeyCode();

	if (keyCode == 113) {// F2 pressed
		onF2Pressed();
	}
}

function onInputKeyedNameFinished(val, col) {
	bKEYEDNAME_INPUT_IS_IN_PROGRESS = false;
}

function updateGridApplet() {
	gridApplet.clear();
	var data;
	data = thisItem.getRelationships(relTypeName);
	var gridDataDom = innovator.newXMLDocument();
	gridDataDom.loadXML(getGridDataXML(relType, props, data));

	var gridDom = getGridSetupXML(props);

	// Add the rows to the grid dom
	var rows = gridDataDom.selectNodes("/table/tr");
	for (var i = 0; i < rows.length; i++) {
		gridDom.selectSingleNode("/table").appendChild(rows(i));
	}
	gridApplet.setPaintEnabled(false);
	gridApplet.initXML(gridDom.xml);
}

function addRow(relationship) {
	if (!relationship) {
		return false;
	}

	var r_copy = relationship;  //.clone(true); - clone change id

	var data = r_copy.getItemsByXPath(".");
	var gridDataDom = innovator.newXMLDocument();
	gridDataDom.loadXML(getGridDataXML(relType, props, data));

	var gridDom = getGridSetupXML(props);

	// Add the rows to the grid dom
	var rows = gridDataDom.selectNodes("/table/tr");
	for (var i = 0; i < rows.length; i++) {
		gridDom.selectSingleNode("/table").appendChild(rows(i));
	}
	gridApplet.setPaintEnabled(false);
	gridApplet.addXMLRows(gridDom.xml);
}

function updateRow(relationship) {
	/*
	designed to update grid UI only
	*/

	if (!relationship) {
		return false;
	}

	var relId = relationship.getID();

	var data = relationship.getItemsByXPath(".");
	var gridDataDom = innovator.newXMLDocument();
	gridDataDom.loadXML(getGridDataXML(relType, props, data));

	var tds = gridDataDom.selectNodes("/table/tr/td");
	for (var i = 0; i < tds.length; i++) {
		var td = tds[i];
		var cell = gridApplet.cells(relId, i);
		system_UpdateGridCell(cell, td);
	}
}

function system_UpdateGridCell(cell, tdNd) {
	var td_textColor = tdNd.getAttribute("textColor");
	var td_link = tdNd.getAttribute("link");
	var td_bgColor = tdNd.getAttribute("bgColor");
	var td_font = tdNd.getAttribute("font");
	var td_value = tdNd.text;

	if (td_textColor) {
		try { cell.setTextColor(td_textColor); } catch (excep) { }
	}
	if (td_link) {
		cell.setLink(td_link);
	}
	if (td_bgColor) {
		try { cell.setBgColor_Experimental(td_bgColor); } catch (excep) { }
	}
	if (td_font) {
		cell.setFont(td_font);
	}
	cell.setValue(td_value);
}

////////////////////////////  +++ Dialogs +++  ////////////////////////////
function showDialog(IT_Name) {
	bKEYEDNAME_INPUT_IS_IN_PROGRESS = false;

	var params = {
		aras: aras,
		itemtypeName: IT_Name,
		itemContext: item,
		itemSelectedID: currSelRowId,
		type: "SearchDialog"
	};
	window.ArasModules.Dialog.show("iframe", params).promise.then(function (dlgRes) {
		if (dlgRes === undefined) {
			return false;
		}

		gridApplet.setPaintEnabled(false);
		try {
			if (dlgRes.itemID) {
				var keyedName = dlgRes.keyed_name;
				var res = dlgRes.itemID;

				if (propsArr[currSelCol].name == "related_id" && res != itemId) {
					var relatedItm = getItemById(IT_Name, res, 0);
					if (!relatedItm) {
						aras.AlertError(aras.getResource("plm", "gridtools.rel_item_not_found", IT_Name, res));
						setupProperty("", true);
					}
					else {
						setupProperty(relatedItm, true);
					}
				}
				else {
					var propVal = new Item();
					propVal.loadAML(dlgRes.item.cloneNode(false).xml);
					propVal.setAction("skip");
					propVal.setAttribute("keyed_name", keyedName);
					setupProperty(propVal, true);
					//      updateGridApplet();
					updateRow(getRelationship(currSelRowId));
				}
			}
			else {
				setupProperty("", true);
			}

			deselectRow();
			gridApplet.turnEditOff();
		} catch (ex) { }
		gridApplet.setPaintEnabled(true);
	});
}

////////////////////////////  --- End Dialogs ---  ////////////////////////////

////////////////////////////////////////////////////////////
function PopupMenuState() {
	this.states = [];
}

PopupMenuState.prototype.addEntry = function (id, label, isVisible) {
	this.states[id] = {};
	this.states[id].label = label;
	this.states[id].isVisible = isVisible;
};
////////////////////////////////////////////////////////////

function onMenuCreate(rowID, col, p) {
	// select row
	var selectedRows = gridApplet.getSelectedItemIds(";");
	if (selectedRows.search(rowID) == -1) {
		gridApplet.setSelectedRow(rowID, false, false);
		onRowSelect(rowID, false, false);
	}

	grid_PPM.rowId = rowID;
	grid_PPM.col = col;
	grid_PPM.removeAll();

	var popupMenuState = new PopupMenuState();
	if (this.relatedTypeName !== undefined) {
		popupMenuState.addEntry("show_item", aras.getResource("plm", "gridtools.view", relatedTypeName), computeCorrectControlState("show_item"));
	}
	else if (this.relTypeName !== undefined) {
		popupMenuState.addEntry("show_relationship", aras.getResource("plm", "gridtools.view", relTypeName), computeCorrectControlState("show_relationship"));
	}

	popupMenuState.addEntry("new", aras.getResource("plm", "gridtools.new"), computeCorrectControlState("new"));
	popupMenuState.addEntry("delete", aras.getResource("plm", "gridtools.delete"), computeCorrectControlState("delete"));

	var needSeparatorFlg = false;
	for (var menuCmd in popupMenuState.states) {
		var isSeparator = (popupMenuState.states[menuCmd].label.search(/^separator/) === 0);
		if (popupMenuState.states[menuCmd].isVisible && !isSeparator) {
			if (needSeparatorFlg) {
				grid_PPM.addSeparator();
				needSeparatorFlg = false;
			}
			grid_PPM.add(menuCmd, popupMenuState.states[menuCmd].label, true);
		}
		if (isSeparator) {
			needSeparatorFlg = true;
		}
	}

	var keyToAvoidExplicitTopUsage = "top";
	var p1 = aras.uiGetElementCoordinates(grid);
	var x = p.x + p1.left;
	var y = p.y + p1[keyToAvoidExplicitTopUsage];
	window.focus();
	grid_PPM.show(x, y);
}

function onPopupMenuClicked(item) {
	return onPopupMenuClick2(item.getId(), grid_PPM.rowId, grid_PPM.col);
}

function onPopupMenuClick2(id, rowId, colId) {
	processCommand(id);
}

function onLink(linkVal) {
	linkVal = linkVal.replace(/'/g, "");
	var itemTypeName = linkVal.split(",")[0],
		itemID = linkVal.split(",")[1];
	if (!isEditMode) {
		setTimeout("onLink2(\"" + itemTypeName + "\", \"" + itemID + "\")");
	}
	return true;
}

function onLink2(itemTypeName, itemID) {
	if (!isEditMode) {
		var itm = aras.getItemById(itemTypeName, itemID, 0);
		if (itm) {
			aras.uiShowItemEx(itm, undefined);
		}
	}
}