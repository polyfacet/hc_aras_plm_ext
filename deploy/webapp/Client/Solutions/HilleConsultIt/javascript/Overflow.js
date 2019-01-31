var overlayId = "overlay";
var overlay_close_id = "overlay_close";
var ol_tableId = "workflowMatrix";

function Overlay() {
    this.init = function () {
        document.addEventListener("DOMContentLoaded", function (event) {
            console.log("DOM fully loaded and parsed");
            var btn2 = document.querySelector("#btn_my_wf");
            btn2.addEventListener("click", overL.on);
            document.querySelector(`#${overlay_close_id}`).addEventListener("click", overL.off);
        });
    }

    this.on = function() {
        console.log("on");
        loadTable(null, ol_tableId);
        document.getElementById(overlayId).style.display = "block";
    }

    this.off = function() {
        console.log("off");
        document.getElementById(overlayId).style.display = "none";
    }

    var loadTable = function(aras, tableId) {
        console.log("Load table");
        let table = document.getElementById(tableId);
        table.innerHTML = "";
        let thead = table.createTHead();
        let headRow = thead.insertRow();
        let tableDef = getDefinition(aras);
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

    var getDefinition = function(aras) {
        var dl = new Dataloader();
        return dl.getDefinition(aras);
        //return headerDef;
    }
}

function Dataloader() {
    
    this.getDefinition = function(aras) {
        return headerDef();
    }

    /* DUMMY START */
    var headerDefStr = function() {
        let val = '{"headers" : ' +
            '[ ' +
            '{"header":"Role" } ,' +
            '{"header":"Prepare" } ,' +
            '{"header":"Work"},' +
            '{"header" : "Approve"}' +
            ']' +
            ' , "rows": { "row": [ { "cells": [ "Creator", "X", "X", "" ] }, { "cells": [ "Chief", "", "", "Kalle Kula<br/>Jan Banan" ] } ] } ' +
            '}';
        return val;
    }
    var headerDef = function() {
        let val = JSON.parse(headerDefStr());
        return val;
    }
    /* DUMMY END */
}

var overL = new Overlay();
overL.init();