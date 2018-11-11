// My InBasket
var inbasketDefStr = '{"typeName":"InBasket Task", "metadata" : ' + 
'[ ' +
'{"property":"item_type_name", "header":"Type" } ,' + 
'{"property":"item", "header":"Process Item", "openlink":"true", "keyed_name":"true" } ,' + 
'{"property":"keyed_name", "header":"Activity"},' +
'{"property":"instructions", "header":"Instructions"},' + 
'{"property":"vote_now_input", "header":"Sign Off", "voteNowInput":"true"},' + 
'{"property":"start_date", "header" : "Start Date", "isDate":"true"},' +
'{"property":"comments", "header" : "Comments"},' +
'{"property":"pid", "header" : "Workflow", "wfLink":"true"}' +

']' +
' , "searchFields": ' +
'[ ' +
	'{"property":"keyed_name"} ,' + 
	'{"property":"instructions"}' + 
']' +
'}';
var inbasketDef = JSON.parse(inbasketDefStr);


function loadMyInbasketItemsToTable() {
	let cbEl = document.querySelector("#inbasketCb");
	if (cbEl.checked) { // Only if checked/visilbe
		var items = getMyInbasketItems();
		var table = document.querySelector("#inbasket-table");
		table.innerHTML = "";
		insertToTable(table,items,inbasketDef);
	}
}

function getMyInbasketItems() {
	var q = top.aras.newIOMItem("Method", "HC_GetMyInbasketTasks");
	var r = q.apply();
	return r;
}

function openWorkflowProcess(pid,processName) {
	var params = {};
	params.aras = top.aras;
	params.processID = pid;
	params.processName = processName;
	params.dialogWidth = 840;
	params.dialogHeight = 400;
	params.content = 'WorkflowProcess/WflProcessViewer.aspx';

	var win = top.aras.getMostTopWindowWithAras(window);
	(win.main || win).ArasModules.Dialog.show('iframe', params);
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
	params.dialogHeight = 540;
	params.resizable = true;
	params.scroll = true;
	params.content = "InBasket/InBasket-VoteDialog.aspx";
	aras.getMostTopWindowWithAras(window).ArasModules.Dialog.show("iframe", params).promise.then(function (res) {
	// Refresh inbasket on close
	loadMyInbasketItemsToTable();
	if (parent && parent.Core_loadProcessReport) {
		parent.setTimeout(parent.Core_loadProcessReport, 0);
		}
	});
}