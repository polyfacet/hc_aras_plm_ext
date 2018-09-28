# hc_aras_plm_ext
Extended functionality of Aras Innovator Out-Of-The-Box PLM package.
Developed on R11SP12 and R11SP9

Purpose to include some more or less generic and valuable feature on top of the Aras Innovotr Out-Of-The-Box PLM package
Which can be pulled and resused as needed.

Features in short:
* Part Validation concept
* A better BOM Compare (Not implemented)
* Part variant creation (Not implemented)
* Property coloring (Not implemented)
* Open in background (Not implemented)
* Tree Grid View example (Not implemented)
* Extended API:
   * History handling
   * Copy from Vault Server Side
   * ActivityExt
   
 ## Installation 
 Important!
 Always back up your code tree and database before applying an import package or code tree patch!
 
 ### Pre-requisites
 1. Aras Innovator installed
 2. Aras Package Import tool
 
 ### Install steps
 #### Code Tree Installation
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
 1. Login to Innovator
 2. Navigate to the Part ItemType
 3. Create a new part with no name set.
 4. Notice the validation error in From and the Validation tab.
 
 Youtube: https://www.youtube.com/watch?v=WJLfYEj_thI
