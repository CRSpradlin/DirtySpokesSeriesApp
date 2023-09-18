import { convertToGoogleSheet } from "./utils/sheetUtils";

// @ts-ignore
global.doGet = (e) => {
    return HtmlService.createHtmlOutputFromFile('dist/index.html');
}

// @ts-ignore
global.test = () => {
    const fileId = '<file id>';
    return convertToGoogleSheet(fileId);
}

// // @ts-ignore
// global.setScriptProp = () => {
//     // const key = 'MAIN_SHEET_ID';
//     // const value = '<sheet id>';

//     const key = 'TEMP_FOLDER_ID';
//     const value = '<temp folder id>';

//     const scriptProps = PropertiesService.getScriptProperties();
//     scriptProps.setProperty(key, value);
//     return true;
// }