import { getTempFolderId } from './sheetUtils';

const uploadFile = (formObject) => {
    const tempFolderId = getTempFolderId();
    const tempFolder = DriveApp.getFolderById(tempFolderId);

    if (formObject.excelFile.length > 0) {
        const blob = formObject.excelFile;
        const file = tempFolder.createFile(blob);
        return file.getId();
    } else{
        throw new Error('File selected contains no content.');
    }
}

const cleanFiles = (fileIds: string[]) => {
    for (let fileId of fileIds) {
        DriveApp.getFileById(fileId).setTrashed(true);
    }
}

export { uploadFile, cleanFiles }