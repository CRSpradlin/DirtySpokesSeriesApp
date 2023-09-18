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

export { convertToGoogleSheet };