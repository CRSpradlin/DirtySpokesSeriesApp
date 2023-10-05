type PackagedResults = {
    fileName: string,
    raceName: string,
    seriesResults: { [key: string]: string[][] }
};

type MainReport = {
    [key: string]: {
        [key: string]: {
            name: string,
            totalPoints: number,
            totalRaces: number
        }
    }
};

type MainSheetProps = {
    raceType: 'long' | 'short',
    id: string,
    raceNames: string[]
};

const RESULTS_SHEET_NAME = 'Results';

const getLongMainSheetProps = (): MainSheetProps => {
    const props = PropertiesService.getScriptProperties();
    const id = props.getProperty('MAIN_LONG_SHEET_ID');
    const raceNamesProp = props.getProperty('MAIN_LONG_SHEET_RACE_NAMES');

    let raceNames: string[] = [];

    if (raceNamesProp) {
        raceNames = JSON.parse(raceNamesProp);
    } else {
        throw new Error('Could not retrieve Main Long Sheet Race Names');
    }

    if (id) {
        return {
            raceType: 'long',
            id,
            raceNames
        };
    } else {
        throw new Error('Could not retrieve Main Long Sheet ID and Race Count');
    }
};

const setLongMainSheetRaces = (newRaces: string[]) => {
    const props = PropertiesService.getScriptProperties();
    props.setProperty('MAIN_LONG_SHEET_RACE_NAMES', JSON.stringify(newRaces));
};

const getShortMainSheetProps = (): MainSheetProps => {
    const props = PropertiesService.getScriptProperties();
    const id = props.getProperty('MAIN_SHORT_SHEET_ID');
    const raceNamesProp = props.getProperty('MAIN_SHORT_SHEET_RACE_NAMES');

    let raceNames: string[] = [];

    if (raceNamesProp) {
        raceNames = JSON.parse(raceNamesProp);
    } else {
        throw new Error('Could not retrieve Main Short Sheet Race Names');
    }

    if (id) {
        return {
            raceType: 'short',
            id,
            raceNames
        };
    } else {
        throw new Error('Could not retrieve Main Short Sheet ID');
    }
};

const setShortMainSheetRaces = (newRaces: string[]) => {
    const props = PropertiesService.getScriptProperties();
    props.setProperty('MAIN_SHORT_SHEET_RACE_NAMES', JSON.stringify(newRaces));
};

const setMainSheetRaceNames = (packagedResults: PackagedResults, newRaces: string[]) => {
    if (packagedResults.fileName.toLowerCase().includes('short')) {
        setShortMainSheetRaces(newRaces);
    } else if (packagedResults.fileName.toLowerCase().includes('long')) {
        setLongMainSheetRaces(newRaces);
    } else {
        throw new Error('Could not determine main sheet to set new Race Names');
    } 
};

const getMainSheetProps = (packagedResults: PackagedResults) => {
    const main_short_props = getShortMainSheetProps();
    const main_long_props = getLongMainSheetProps();

    if (packagedResults.fileName.toLowerCase().includes('short')) {
        return main_short_props;
    } else if (packagedResults.fileName.toLowerCase().includes('long')) {
        return main_long_props;
    } else {
        throw new Error('Could not determine main sheet id based off uploaded file name');
    }
};

const getTempFolderId = () => {
    const props = PropertiesService.getScriptProperties();
    const tempFolderId = props.getProperty('TEMP_FOLDER_ID');
    if (tempFolderId) {
        return tempFolderId;
    } else {
        throw new Error('No Temp Folder Found');
    }
};

const convertToGoogleSheet = (documentId: string) => {
    const file = DriveApp.getFileById(documentId);
    if (!file) {
        throw new Error('Could not find downloaded file to convert');
    }

    const config = {
        title: `[Google Sheets] ${file.getName()}`,
        parents: [{ id: getTempFolderId() }],
        mimeType: 'application/vnd.google-apps.spreadsheet'
    }

    const resultFile = Drive.Files?.insert(config, file.getBlob());
    if (!resultFile || !resultFile.id) {
        throw new Error('Could not find converted file');
    }

    return resultFile.id;
};

const packageSeriesGroups = (documentId: string): PackagedResults => {
    const uploadedSheet = SpreadsheetApp.openById(documentId)
    const uploadedSheetRange = uploadedSheet.getActiveSheet();

    const rangeData = uploadedSheetRange.getRange(1, 1, uploadedSheetRange.getMaxRows(), 7).getValues();

    const packagedResults = {
        fileName: uploadedSheet.getName(),
        raceName: rangeData[1][0],
        seriesResults: {}
    };


    for (let i=6; i<rangeData.length; i++) {
        let row = rangeData[i];
        let firstColOnRow = row[0];
        
        if (firstColOnRow !== '' && firstColOnRow !== 'Place' && isNaN(firstColOnRow) && !firstColOnRow.toLowerCase().includes('win')) {
            packagedResults.seriesResults[firstColOnRow] = [];
            i += 3;
            row = rangeData[i];
            while (row[0] !== '') {
                if(i >= rangeData.length) break;
                
                packagedResults.seriesResults[firstColOnRow].push(row);

                i++;
                row = rangeData[i];
            }
        }
    }

    return packagedResults;
};

const processSeriesGroupsTabs = (packagedResults: PackagedResults) => {
    const mainSheet = SpreadsheetApp.openById(getMainSheetProps(packagedResults).id);

    const sheetNames = mainSheet.getSheets().map(s => s.getName());

    if (!sheetNames.includes(RESULTS_SHEET_NAME)) {
        mainSheet.insertSheet(RESULTS_SHEET_NAME, 0);
    }
    
    for (const seriesGroup of Object.keys(packagedResults.seriesResults)) {
        if (!sheetNames.includes(seriesGroup)) {
            let newSheet;
            if (sheetNames.length == 1) {
                sheetNames.push(seriesGroup);
                newSheet = mainSheet.insertSheet(seriesGroup, 1);
            } else {
                for (let i=1; i <= sheetNames.length; i++) {
                    if (i == sheetNames.length) {
                        sheetNames.push(seriesGroup);
                        newSheet = mainSheet.insertSheet(seriesGroup);
                        break; 
                    }
                    if (sheetNames[i] > seriesGroup) {
                        sheetNames.splice(i, 0, seriesGroup);
                        newSheet = mainSheet.insertSheet(seriesGroup, i);
                        break;
                    }
                }
            }
            if (!newSheet) throw new Error(`Could not place the new sheet: ${seriesGroup}`);
            newSheet.getRange(1, 1, 1, 11).setValues([['Runner Id','Points Awarded','Race','Place','Name','City','Age','Overall','Total Time','Pace','File Name']]);
        }
    }
};

const placePackagedResultsToTabs = (packagedResults: PackagedResults) => {
    const mainSheetProps = getMainSheetProps(packagedResults);
    const mainSheet = SpreadsheetApp.openById(mainSheetProps.id);
    const uploadedFileName = packagedResults.fileName;
    const raceName = packagedResults.raceName;

    if (mainSheetProps.raceNames.includes(raceName)) {
        throw new Error('Race has already been added. Please remove it before adding it again.');
    } else {
        mainSheetProps.raceNames.push(raceName);
    }

    for (const seriesGroup of Object.keys(packagedResults.seriesResults)) {
        const seriesSheet = mainSheet.getSheetByName(seriesGroup);
        if (!seriesSheet) throw new Error(`Could not get series sheet tab in mainSheet: ${mainSheet.getId()} for series: ${seriesGroup}`);
        for (const runner of packagedResults.seriesResults[seriesGroup]) {
            const nameArray = runner[1].trim().toLowerCase().split(' ');
            const age = runner[3];
            const place = parseInt(runner[0]);
            const runnerId = nameArray[0][0] + nameArray[nameArray.length-1] + age + seriesGroup.toLowerCase()[0];
            const pointsAwarded = getPointsFromPlace(place);

            const row = getNextOpenRowInSeriesSheet(seriesSheet);

            seriesSheet.getRange(row, 1, 1, 11).setValues([[runnerId, pointsAwarded, raceName, place, runner[1], runner[2], age, runner[4], runner[5], runner[6], uploadedFileName]]);
        }
    }

   setMainSheetRaceNames(packagedResults, mainSheetProps.raceNames); 
};

const getNextOpenRowInSeriesSheet = (seriesSheet: GoogleAppsScript.Spreadsheet.Sheet) => {
    const startRow = 2; // Due to headers
    const sheetRange = seriesSheet.getRange(startRow, 1, seriesSheet.getMaxRows()).getValues();
    for (let i=0; i<sheetRange.length; i++) {
        if (sheetRange[i][0].trim() == '') return i+startRow;
    }
    return -1;
};

const getPointsFromPlace = (place: number) => (20-(place-1) <= 0 ? 1 : 20-(place-1));

const generateMainReportJSON = (mainSheetId: string): MainReport => {
    const mainSheet = SpreadsheetApp.openById(mainSheetId);
    if (!mainSheet) throw new Error(`Cannot open main sheet with id: ${mainSheetId}`);

    let mainReport = {};

    const sheets = mainSheet.getSheets();
    for (const sheet of sheets) {
        const seriesGroup = sheet.getName();
        if (seriesGroup === RESULTS_SHEET_NAME) continue;

        mainReport[seriesGroup] = {};
        const seriesGroupRange = sheet.getRange(2, 1, sheet.getMaxRows(), 11).getValues();
        for (const record of seriesGroupRange) {
            if (record[0] === 'Runner Id' || record[0].trim() === '') continue;

            const mainReportForRunner = mainReport[seriesGroup][record[0]];
            if (mainReportForRunner) {
                mainReportForRunner.totalPoints += parseInt(record[1]);
                mainReportForRunner.totalRaces += 1;
            } else {
                mainReport[seriesGroup][record[0]] = {
                    name: record[4],
                    totalPoints: parseInt(record[1]),
                    totalRaces: 1
                }
            }
        }
    }

    return mainReport;
};

const postMainReportToSheet = (mainSheetProps: MainSheetProps, mainReport: MainReport, numReportedPerSeriesGroup = 3, minReqRaces = 5) => {
    const mainSheet = SpreadsheetApp.openById(mainSheetProps.id);

    if (!mainSheet) throw new Error(`Cannot open main sheet with id: ${mainSheetProps.id}`);

    let recordsRangeValues: string[][] = [];

    for (let seriesGroup of Object.keys(mainReport)) {
        const seriesArray = [[seriesGroup, '']];
        for (let runner of Object.keys(mainReport[seriesGroup])) {
            if (mainSheetProps.raceNames.length >= minReqRaces){
                if (mainReport[seriesGroup][runner].totalRaces >= minReqRaces) {
                    seriesArray.push([mainReport[seriesGroup][runner].name, mainReport[seriesGroup][runner].totalPoints+'']);
                } else {
                    continue;
                }
                
            } else {
                seriesArray.push([mainReport[seriesGroup][runner].name, mainReport[seriesGroup][runner].totalPoints+'']);
            }
            
        }

        seriesArray.sort((a, b) => {
            if (a[0] == seriesGroup) return -1;
            else if (parseInt(a[1]) < parseInt(b[1])) return 1;
            else if (parseInt(a[1]) > parseInt(b[1])) return -1;
            else return 0;
        });

        const numRunnersOverReportLimit = (seriesArray.length-1) - numReportedPerSeriesGroup; // Plus 1 for Series Group Names
        if (numRunnersOverReportLimit > 0) {
            for (let i=0; i<numRunnersOverReportLimit; i++)
                seriesArray.pop();
        }

        seriesArray.push(['', '']); // Spacer to separate series groups

        if (seriesArray.length > 2) {
            for (let row of seriesArray) {
                recordsRangeValues.push(row);
            }
        }
    }

    mainSheet.getSheetByName(RESULTS_SHEET_NAME)?.clear();
    mainSheet.getSheetByName(RESULTS_SHEET_NAME)?.getRange(1, 1, recordsRangeValues.length, 2).setValues(recordsRangeValues);
};

const removeRace = (mainSheetProps: MainSheetProps, raceName: string) => {
    if (!mainSheetProps.raceNames.includes(raceName)) 
        throw new Error(`Could not find race: "${raceName}" to remove.`);

    const mainSheet = SpreadsheetApp.openById(mainSheetProps.id);

    const sheetTabs = mainSheet.getSheets();
    
    const failedSheets: string[] = [];
    for (let sheet of sheetTabs) {
        
        try {
            if (sheet.getName() === RESULTS_SHEET_NAME) continue;

            const runnerValues = sheet.getRange(2, 1, sheet.getMaxRows(), 11).getValues();
            const newRunnerValues: string[][] = [];
    
            for (let i=0; i<runnerValues.length; i++) {
                if (runnerValues[i][2] != raceName) newRunnerValues.push(runnerValues[i]); 
            }
    
            sheet.getRange(2, 1, newRunnerValues.length, 11).setValues(newRunnerValues);
        } catch (e) {
            failedSheets.push(sheet.getName());
        }
    }
    if (failedSheets.length > 0) {
        throw new Error(`Failed to remove race for seriesGroups: ${failedSheets.join(', ')}`);
    } else {
        mainSheetProps.raceNames.splice(mainSheetProps.raceNames.indexOf(raceName), 1);
        if (mainSheetProps.raceType === 'long') {
            setLongMainSheetRaces(mainSheetProps.raceNames);
        } else {
            setShortMainSheetRaces(mainSheetProps.raceNames);
        }
    }
}

const getMainSheetResultsXLSXBlob = (mainSheetProps: MainSheetProps) => {
    const mainSheet = SpreadsheetApp.openById(mainSheetProps.id);

    const mainSheetCopy = mainSheet.copy('Temp Results Copy');
    for (let sheet of mainSheetCopy.getSheets()) {
        if (sheet.getName() != RESULTS_SHEET_NAME)
            mainSheetCopy.deleteSheet(sheet);
    }

    const url = "https://docs.google.com/feeds/download/spreadsheets/Export?key=" + mainSheetCopy.getId() + "&exportFormat=xlsx";

    const params = {
      method      : "get",
      headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
      muteHttpExceptions: true
    };

    // @ts-ignore
    const blob = UrlFetchApp.fetch(url, params).getBlob();

    blob.setName("GeneratedReport.xlsx");

    return blob;
}

const clearMainSheetReports = () => {
    const longSheet = SpreadsheetApp.openById(getLongMainSheetProps().id);
    
    const longResultsSheet = longSheet.getSheetByName(RESULTS_SHEET_NAME);
    if (longResultsSheet) longResultsSheet.getRange(1, 1, longResultsSheet.getMaxRows(), longResultsSheet.getMaxColumns()).clear();
    
    for (let sheet of longSheet.getSheets()) {
        if (sheet.getName() == RESULTS_SHEET_NAME) continue;
        longSheet.deleteSheet(sheet);
    }

    const shortSheet = SpreadsheetApp.openById(getShortMainSheetProps().id);

    const shortResultsSheet = shortSheet.getSheetByName(RESULTS_SHEET_NAME);
    if (shortResultsSheet) shortResultsSheet.getRange(1, 1, shortResultsSheet.getMaxRows(), shortResultsSheet.getMaxColumns()).clear();
    
    for (let sheet of shortSheet.getSheets()) {
        if (sheet.getName() == RESULTS_SHEET_NAME) continue;
        shortSheet.deleteSheet(sheet);
    }

    setLongMainSheetRaces([]);
    setShortMainSheetRaces([]);
}

export { MainSheetProps, clearMainSheetReports, getMainSheetResultsXLSXBlob, removeRace, getTempFolderId, postMainReportToSheet, getMainSheetProps, getLongMainSheetProps, getShortMainSheetProps, placePackagedResultsToTabs, convertToGoogleSheet, packageSeriesGroups, processSeriesGroupsTabs, generateMainReportJSON };