import { MainSheetProps, clearMainSheetReports, getMainSheetResultsXLSXBlob, generateMainReportJSON, postMainReportToSheet, removeRace, getLongMainSheetProps, getShortMainSheetProps, packageSeriesGroups, placePackagedResultsToTabs, processSeriesGroupsTabs, convertToGoogleSheet } from "./utils/sheetUtils";
import { uploadFile, cleanFiles } from "./utils/fileProcessor";

// @ts-ignore
global.doGet = (e) => {
    const scriptProps = PropertiesService.getScriptProperties();

    const allowedUsers = scriptProps.getProperty('ALLOWED_USER_EMAILS');

    if (!allowedUsers) throw new Error('Invalid Users Property. Please Contact Site Admin.');

    if (allowedUsers.includes(Session.getActiveUser().getEmail())) {
        return HtmlService.createHtmlOutputFromFile('dist/index.html').setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle("DirtySpokesSeriesApp");
    } else {
        return HtmlService.createHtmlOutput('NO ACCESS');
    }

};

// @ts-ignore
global.generateReport = (formObject) => {
    if (!formObject.raceType || (formObject.raceType != 'long' && formObject.raceType != 'short')) throw new Error('Invalid race type selected.');
    const raceType = formObject.raceType;
    const numberPerSeries = parseInt(formObject.numberPerSeries);
    const minReqRaces = parseInt(formObject.minReqRaces);

    let mainSheetProps: MainSheetProps;
    if (raceType === 'long')
        mainSheetProps = getLongMainSheetProps();
    else
        mainSheetProps = getShortMainSheetProps();

    const mainReportJSON = generateMainReportJSON(mainSheetProps.id);
    postMainReportToSheet(mainSheetProps, mainReportJSON, numberPerSeries, minReqRaces);

    const blob = getMainSheetResultsXLSXBlob(mainSheetProps);
    
    //@ts-ignore
    const data = `data:${MimeType.MICROSOFT_EXCEL};base64,` + Utilities.base64Encode(blob.getBytes())
    
    return data;
}

// @ts-ignore
global.removeRaceHandler = (formObject) => {
    if (!formObject.raceType || (formObject.raceType != 'long' && formObject.raceType != 'short')) throw new Error('Invalid race type selected.');
    if (!formObject.raceName) throw new Error('No race name given.');

    let mainSheetProps;
    if (formObject.raceType === 'long') {
        mainSheetProps = getLongMainSheetProps();
    } else {
        mainSheetProps = getShortMainSheetProps();
    }

    removeRace(mainSheetProps, formObject.raceName);

    // @ts-ignore
    return global.getRaceNames()
};

// @ts-ignore
global.getRaceNames = () => {
    return {
        'long': getLongMainSheetProps().races.map((race) => race.raceName),
        'short': getShortMainSheetProps().races.map((race) => race.raceName)
    }
};

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
};

// @ts-ignore
global.clearReports = () => {
    clearMainSheetReports();
};

// @ts-ignore
global.test = () => {
};

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