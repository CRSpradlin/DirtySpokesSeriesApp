const getMainSheetId = () => {
    const props = PropertiesService.getScriptProperties();
    return props.getProperty('MAIN_SHEET_ID');
};

const getTempFolderId = () => {
    const props = PropertiesService.getScriptProperties();
    const tempFolderId = props.getProperty('TEMP_FOLDER_ID');
    if (tempFolderId) {
        return tempFolderId;
    } else {
        throw new Error('No Temp Folder Found');
    }
}

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
}

const packageSeriesGroups = (documentId: string) => {
    const uploadedSheet = SpreadsheetApp.openById(documentId).getActiveSheet();

    const rangeData = uploadedSheet.getRange(1, 1, uploadedSheet.getMaxRows(), 7).getValues();

    for (let i=6; i<rangeData.length; i++) {
        const row = rangeData[i];
        const firstColOnRow = row[0];
        
        if (firstColOnRow !== '' && firstColOnRow !== 'Place' && isNaN(firstColOnRow) && !firstColOnRow.toLowerCase().includes('win')) {
            Logger.log(firstColOnRow);
        }
    }

    return rangeData;
}

export { convertToGoogleSheet, packageSeriesGroups };