import { packageSeriesGroups, placePackagedResultsToTabs, processSeriesGroupsTabs, convertToGoogleSheet } from "./utils/sheetUtils";
import { uploadFile, cleanFiles } from "./utils/fileProcessor";

// @ts-ignore
global.doGet = (e) => {
    return HtmlService.createHtmlOutputFromFile('dist/index.html').setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle("DirtySpokesSeriesApp");;
}

// @ts-ignore
global.uploadHandler = (formObject) => {
    let excelFileId: string | undefined;
    let gSheetId: string | undefined;
    let caughtError;

    try {
        excelFileId = uploadFile(formObject);
        gSheetId = convertToGoogleSheet(excelFileId);
        const packagedResults = packageSeriesGroups(gSheetId);
        processSeriesGroupsTabs(packagedResults);
        placePackagedResultsToTabs(packagedResults);
    } catch(error) {
        caughtError = error;
    } finally {
        const fileIds: string[] = [];
        if (excelFileId != undefined) fileIds.push(excelFileId);
        if (gSheetId != undefined) fileIds.push (gSheetId);
        
        cleanFiles(fileIds);

        if (caughtError) {
            throw caughtError;
        }
    }


}

// @ts-ignore
global.test = () => {
}

// // @ts-ignore
// global.setScriptProp = () => {
//     // const key = 'MAIN_SHORT_SHEET_ID';
//     // const value = '<sheet id>';

//     // const key = 'MAIN_SHORT_SHEET_RACE_NAMES';
//     // const value = '<sheet id>';

//     // const key = 'MAIN_LONG_SHEET_ID';
//     // const value = '<sheet id>';

//     // const key = 'MAIN_LONG_SHEET_RACE_NAMES';
//     // const value = '<sheet id>';

//     const key = 'TEMP_FOLDER_ID';
//     const value = '<temp folder id>';

//     const scriptProps = PropertiesService.getScriptProperties();
//     scriptProps.setProperty(key, value);
//     return true;
// }