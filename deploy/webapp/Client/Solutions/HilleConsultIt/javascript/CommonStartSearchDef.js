var itemDefinitions = new Array();

// Define Parts
var partDefStr = '{"typeName":"Part", "tableId":"parts", "includeSwitchId":"includeParts" ,  "metadata" : ' + 
'[ ' +
'{"property":"item_number", "header":"Part Number", "openlink":"true" } ,' + 
'{"property":"major_rev", "header":"Rev." } ,' + 
'{"property":"classification", "header":"Type"},' +
'{"property":"name", "header":"Name"},' + 
'{"property":"state", "header":"State"},' + 
'{"property":"modified_on", "header" : "Modified on", "isDate":"true"},' +
'{"property":"modified_by_id", "header":"Modified By", "keyed_name":"true"}' + 
']' +
' , "searchFields": ' +
'[ ' +
    '{"property":"item_number"} ,' + 
    '{"property":"name"}' + 
']' +
'}';
var partDef = JSON.parse(partDefStr);
itemDefinitions.push(partDef);


// Define Documents
var documentDefStr = '{"typeName":"Document", "tableId":"documents", "includeSwitchId":"includeDocuments", "metadata" : ' + 
'[ {"property":"item_number", "header":"Document Number", "openlink":"true" } ,' + 
'{"property":"classification", "header":"Type"},' +
'{"property":"name", "header":"Name"},' + 
'{"property":"state", "header":"State"},' + 
'{"property":"authoring_tool", "header":"Authoring Tool"},' + 
'{"property":"modified_on", "header" : "Modified on", "isDate":"true"}' +
']' + 
' , "searchFields": ' +
'[ ' +
    '{"property":"item_number"} ,' + 
    '{"property":"name"}' + 
']' +
'}';
var documentDef = JSON.parse(documentDefStr);
itemDefinitions.push(documentDef);

// Define CAD Documents
var cadDocumentDefStr = '{"typeName":"CAD", "tableId":"caddocuments", "includeSwitchId":"includeCAD",  "metadata" : ' + 
'[ {"property":"item_number", "header":"CAD Number", "openlink":"true" } ,' + 
'{"property":"classification", "header":"Type"},' +
'{"property":"name", "header":"Name"},' + 
'{"property":"state", "header":"State"},' + 
'{"property":"viewable_file", "header":"Viewable File", "isFile":"true"},' + 
'{"property":"authoring_tool", "header":"Authoring Tool"},' + 
'{"property":"modified_on", "header" : "Modified on", "isDate":"true"}' +
']' + 
' , "searchFields": ' +
'[ ' +
    '{"property":"item_number"} ,' + 
    '{"property":"name"}' + 
']' +
'}';
var cadDocumentDef = JSON.parse(cadDocumentDefStr);
itemDefinitions.push(cadDocumentDef);

// Define ECO 
var ecoDefStr = '{"typeName":"Express ECO", "tableId":"ecos", "includeSwitchId":"includeECO", "metadata" : ' + 
'[ {"property":"item_number", "header":"ECO Number", "openlink":"true" } ,' + 
'{"property":"title", "header":"Title"},' + 
'{"property":"modified_on", "header" : "Modified on", "isDate":"true"}' +
']' + 
' , "searchFields": ' +
'[ ' +
    '{"property":"item_number"} ,' + 
    '{"property":"title"}' + 
']' +
'}';
var ecoDef = JSON.parse(ecoDefStr);
itemDefinitions.push(ecoDef);
