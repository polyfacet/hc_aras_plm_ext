/* DUMMY START */
var headerDefStr = '{"headers" : ' +
    '[ ' +
    '{"header":"Role" } ,' +
    '{"header":"Prepare" } ,' +
    '{"header":"Work"},' +
    '{"header" : "Approve"}' +
    ']' +
    ' , "rows": { "row": [ { "cells": [ "Creator", "X", "X", "" ] }, { "cells": [ "Chief", "", "", "Kalle Kula<br/>Jan Banan" ] } ] } ' +
    '}';
var headerDef = JSON.parse(headerDefStr);
/* DUMMY END */

var overlayId = "overlay";
var overlay_close_id = "overlay_close";
var ol_tableId = "workflowMatrix";


function on() {
    loadTable(null,ol_tableId);
    document.getElementById(overlayId).style.display = "block";
}

function off() {
    document.getElementById(overlayId).style.display = "none";
}

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    var btn2 = document.querySelector("#btn_my_wf");
    btn2.addEventListener("click", on);
    document.querySelector(`#${overlay_close_id}`).addEventListener("click",off);
});


function loadTable(aras, tableId) {
    //debugger;
    console.log("Load table");
    let table = document.getElementById(tableId);
    table.innerHTML = "";
    let thead = table.createTHead();
    let headRow = thead.insertRow();
    let tableDef = this.getDefinition(aras);
    tableDef.headers.forEach(element => {
        let th = document.createElement("th");
        th.className = "ol";
        th.innerHTML = element.header;
        headRow.appendChild(th);
    });

    // Add content rows
    //let columnCount = tableDef.headers.length;
    let tbody = table.appendChild(document.createElement('tbody'));
    tableDef.rows.row.forEach((row) => {
        let newRow = tbody.insertRow();
        row.cells.forEach((cell, index) => {
            let c = newRow.insertCell();
            c.innerHTML = cell;
            c.classList.add("ol");
            if (index === 0) {
                c.classList.add("firstCol");
            }
        });
    });
    console.log("Table loaded");
}

function getDefinition(aras) {
    return headerDef;
}