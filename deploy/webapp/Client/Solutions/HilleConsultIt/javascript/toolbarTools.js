var toolbar = null;

var activeToolbar = null;
var toolbarApplet = null;

var CONTROLS_STATE_ARRAY = {};//is used for popup menu initialization
//setControlEnabled saves information here
//to synchronize toolbar controls and popup menu state
var canNewFlag = true;

function setControlEnabled(ctrlName, b) {
	if (b === undefined) {
		b = true;
	}
	else {
		b = Boolean(b);
	}

	CONTROLS_STATE_ARRAY[ctrlName] = b;
	try {
		var tbi = activeToolbar.getElement(ctrlName);
		if (tbi) {
			tbi.setEnabled(b);
		}
	} catch (excep) { }
}

function initToolbar() {
	if (!toolbarReady) {
		setTimeout(initToolbar, 200);
		return;
	}
	activeToolbar = toolbarApplet.getActiveToolbar();
}

function onToolbarButtonClick(btn) {
	if (!gridApplet) {
		return;
	}

	var btnID = btn.getId() + "";
	processCommand(btnID);
}

function processCommand(cmdId) {
	if (!cmdId) {
		return false;
	}
	var functionName = "on" + (cmdId.substr(0, 1)).toUpperCase() + cmdId.substr(1) + "Click";
	if (window[functionName]) {
		return window[functionName]();
	}
	return false;
}

function isNewEnabled() {
	res = isEditMode && canNewFlag;
	return res;
}

function isDeleteEnabled() {
	if (!isEditMode) {
		return false;
	}

	if (!currSelRowId) {
		return false;
	}
	var rowId = currSelRowId;
	var rel = getRelationship(rowId);
	if (!rel) {
		return false;
	}

	var relAction = rel.getAction();
	if (relAction == "purge" || relAction == "delete") {
		return false;
	}

	return true;
}

function isShow_relationshipEnabled() {
	if (!currSelRowId) {
		return false;
	}
	var rowId = currSelRowId;
	var rel = getRelationship(rowId);
	if (!rel) {
		return false;
	}

	var relAction = rel.getAction();
	if (relAction == "purge" || relAction == "delete") {
		return false;
	}

	return true;
}

function isShow_itemEnabled() {
	if (!currSelRowId) {
		return false;
	}
	var rowId = currSelRowId;
	var rel = getRelationship(rowId);
	if (!rel) {
		return false;
	}
	related = rel.getRelatedItem();
	if (!related || related.isError()) {
		return false;
	}

	var relAction = rel.getAction();
	if (relAction == "purge" || relAction == "delete") {
		return false;
	}
	return true;
}

function isLockEnabled() {
	if (!isEditMode) {
		return false;
	}
	if (!currSelRowId) {
		return false;
	}
	var lockedStatus = getLockedStatusStr(currSelRowId);
	if (lockedStatus === undefined || lockedStatus !== "") {
		return false;
	}
}

function isUnlockEnabled() {
	if (!isEditMode) {
		return false;
	}
	if (!currSelRowId) {
		return false;
	}
	var lockedStatus = getLockedStatusStr(currSelRowId);
	var loginName = parent.aras.getLoginName();
	if (lockedStatus == "alien" && (loginName == "root" || loginName == "admin")) {
		return true;
	}
	if (lockedStatus != "user") {
		return false;
	}
	return true;
}

function computeCorrectControlState(controlName) {
	if (!controlName) {
		return false;
	}

	var functionName = "is" + (controlName.substr(0, 1)).toUpperCase() + controlName.substr(1) + "Enabled";
	if (window[functionName]) {
		return window[functionName]();
	}
	return false;
}

function updateToolbar() {
	if (!activeToolbar) {
		setTimeout(updateToolbar, 200);
		return;
	}
	/*  var tbElements = new Array("new", "pick_replace", "delete", "lock", "unlock", "promote", "search", "show_item", "show_relationship", "get_files",
		  "checkout", "checkin", "get_files_related", "checkout_related", "checkin_related", "copy2clipboard", "paste", "select_all");

	  for (var i=0; i<tbElements.length; i++) setControlEnabled(tbElements[i], false);
	*/

	setControlEnabled("search", false);

	setControlEnabled("new", computeCorrectControlState("new"));
	setControlEnabled("delete", computeCorrectControlState("delete"));
	setControlEnabled("show_relationship", computeCorrectControlState("show_relationship"));
	setControlEnabled("show_item", computeCorrectControlState("show_item"));
	setControlEnabled("lock", computeCorrectControlState("lock"));
	setControlEnabled("unlock", computeCorrectControlState("unlock"));
}