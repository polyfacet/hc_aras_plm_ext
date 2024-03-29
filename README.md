# hc_aras_plm_ext

⚠️ Note this "collection" is not maintained anymore. Some of the features has been extracted to their own repositories.  
The features that does not have their own repositories, will be left behind here (or get their own in the future), as they are merely concepts or rather trivial.  
So these concepts and code can be "copied" from here if needed.

## Features which got their own repositories

- [Validations](https://github.com/polyfacet/aras-validations)
- [BOM Compare](https://github.com/polyfacet/aras-bom-compare)

## Summary of features

Extended functionality of Aras Innovator Out-Of-The-Box PLM package.
Developed on R12SP9 (R11SP12 and R11SP9)

Purpose to include some more or less generic and valuable feature on top of the Aras Innovotor Out-Of-The-Box PLM package.

Features in short:
* Part Validation concept
* Part Property coloring in grid
* Part variant creation
* Tree Grid View example
* A better BOM Compare
* Starting page
* Open in background (Not implemented)

* Extended API:
   * History handling
   * Copy from Vault Server Side
   * ActivityExt
   
 ## Installation 
 Important!
 Always back up your code tree and database before applying an import package or code tree patch!
 
 ### Pre-requisites
 1. Aras Innovator installed (Tested in: R11SP9 , R11SP12, R11SP12)
 2. Aras Package Import tool
 
 ### Install steps
 #### Code Tree Installation
 0. (If not running SP12SP9) Recompile https://github.com/hilleconsultit/hc_aras_core_lib for your specific version and modify method-config.xml (compare modifications between method-config.xml and method-config_R12SP9 in this project)
 1. Copy the Client folder located in deploy/webapp
 2. Paste into Innovator-folder (default: C:\Program Files (x86)\Aras\Innovator\Innovator)
 
 
 #### Database Installation
 1. Open up the Aras Package Import tool.
 2. Enter your login credentials and click Login (root required)
 3. Enter the package name in the TargetRelease field.
 4. Enter the path to your local .\deploy\packages\hcaras\myimports.mf file in the Manifest File field.
 5. Select all packages in the Available for Import field.
 6. Select Type = Merge and Mode = Thorough Mode.
 7. Click Import in the top left corner.
 8. Close the Aras Package Import tool.
 
 ## Usage
 1. Part validation concept:  Youtube: https://www.youtube.com/watch?v=WJLfYEj_thI
 2. Part property coloring in grid, part variant creation and Tree Grid View: Youtube: https://youtu.be/tkUH0XZzqFU
 3. Starting page and a better BOM Compare: Youtube: https://youtu.be/jsfyDUVPpqs
 
 
 
