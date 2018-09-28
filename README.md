# hc_aras_plm_ext
Extended functionality of Aras Innovator Out-Of-The-Box PLM package.
Developed on R11SP12 and R11SP9

Purpose to include some more or less generic and valuable feature on top of the Aras Innovotor Out-Of-The-Box PLM package.

Features in short:
* Part Validation concept
* Part Property coloring in grid
* Part variant creation
* A better BOM Compare (Not implemented)
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
 1. Aras Innovator installed (Tested in: R11SP9 , R11SP12, R11SP12)
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
 4. Notice the validation error in Form and the validation tab and the Parts grid colors
 5. Select Action -> Create Variant on an existing Part. Notice the new property/field "Copied From" displayed on Part/Part form.
 6. Customize rules by editing Method HC_PartGetValidations, HC_PartSetGridCss and HC_CreatePartClone_Generic
 
 
 Youtube: https://www.youtube.com/watch?v=WJLfYEj_thI
