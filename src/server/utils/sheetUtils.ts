const getMainSheetId = () => {
    const props = PropertiesService.getScriptProperties();

    const id = props.getProperty('MAIN_SHEET_ID');

    if (id) {
        return id;
    } else {
        throw new Error('Could not find Main Sheet Id. Be sure it is saved in the script properties.');
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
    if (!resultFile) {
        throw new Error('Could not find converted file');
    }

    return resultFile.driveId;
};

const packageSeriesGroups = (documentId: string) => {
    const uploadedSheet = SpreadsheetApp.openById(documentId).getActiveSheet();

    const rangeData = uploadedSheet.getRange(1, 1, uploadedSheet.getMaxRows(), 7).getValues();

    const packagedResults = {
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

const processSeriesGroupsTabs = (packagedResults) => {
    const mainSheet = SpreadsheetApp.openById(getMainSheetId());

    const sheetNames = mainSheet.getSheets().map(s => s.getName());
    
    for (const seriesGroup of Object.keys(packagedResults.seriesResults)) {
        if (!sheetNames.includes(seriesGroup)) {
            const newSheet = mainSheet.insertSheet(seriesGroup);
            newSheet.getRange(1, 1, 1, 12).setValues([['Runner','Id','Points Awarded','Race','Place','Name','City','Age','Overall','Total','Time','Pace']]);
        }
    }
};
