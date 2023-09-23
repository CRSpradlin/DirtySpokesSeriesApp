function doGet(e) {}

function uploadHandler(formObject) {}

function test() {}

 /******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var __webpack_require__ = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/global */
    /******/    
    /******/ __webpack_require__.g = function() {
        /******/ if ("object" == typeof globalThis) return globalThis;
        /******/        try {
            /******/ return this || new Function("return this")();
            /******/        } catch (e) {
            /******/ if ("object" == typeof window) return window;
            /******/        }
        /******/    }(), 
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = exports => {
        /******/ "undefined" != typeof Symbol && Symbol.toStringTag && 
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        })
        /******/ , Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }
    /******/;
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // ESM COMPAT FLAG
        __webpack_require__.r(__webpack_exports__);
    // CONCATENATED MODULE: ./src/server/utils/sheetUtils.ts
    var setMainSheetRaceNames = function(packagedResults, newRaces) {
        if (packagedResults.fileName.toLowerCase().includes("short")) !function(newRaces) {
            PropertiesService.getScriptProperties().setProperty("MAIN_SHORT_SHEET_RACE_NAMES", JSON.stringify(newRaces));
        }(newRaces); else {
            if (!packagedResults.fileName.toLowerCase().includes("long")) throw new Error("Could not determine main sheet to set new Race Names");
            !function(newRaces) {
                PropertiesService.getScriptProperties().setProperty("MAIN_LONG_SHEET_RACE_NAMES", JSON.stringify(newRaces));
            }(newRaces);
        }
    }, getMainSheetProps = function(packagedResults) {
        var main_short_props = function() {
            var props = PropertiesService.getScriptProperties(), id = props.getProperty("MAIN_SHORT_SHEET_ID"), raceNamesProp = props.getProperty("MAIN_SHORT_SHEET_RACE_NAMES"), raceNames = [];
            if (!raceNamesProp) throw new Error("Could not retrieve Main Short Sheet Race Names");
            if (raceNames = JSON.parse(raceNamesProp), id) return {
                id,
                raceNames
            };
            throw new Error("Could not retrieve Main Short Sheet ID");
        }(), main_long_props = function() {
            var props = PropertiesService.getScriptProperties(), id = props.getProperty("MAIN_LONG_SHEET_ID"), raceNamesProp = props.getProperty("MAIN_LONG_SHEET_RACE_NAMES"), raceNames = [];
            if (!raceNamesProp) throw new Error("Could not retrieve Main Long Sheet Race Names");
            if (raceNames = JSON.parse(raceNamesProp), id) return {
                id,
                raceNames
            };
            throw new Error("Could not retrieve Main Long Sheet ID and Race Count");
        }();
        if (packagedResults.fileName.toLowerCase().includes("short")) return main_short_props;
        if (packagedResults.fileName.toLowerCase().includes("long")) return main_long_props;
        throw new Error("Could not determine main sheet id based off uploaded file name");
    }, getTempFolderId = function() {
        var tempFolderId = PropertiesService.getScriptProperties().getProperty("TEMP_FOLDER_ID");
        if (tempFolderId) return tempFolderId;
        throw new Error("No Temp Folder Found");
    }, getNextOpenRowInSeriesSheet = function(seriesSheet) {
        for (var sheetRange = seriesSheet.getRange(2, 1, seriesSheet.getMaxRows()).getValues(), i = 0; i < sheetRange.length; i++) if ("" == sheetRange[i][0].trim()) return i + 2;
        return -1;
    }, getPointsFromPlace = function(place) {
        return 20 - (place - 1) <= 0 ? 1 : 20 - (place - 1);
    };
    // CONCATENATED MODULE: ./src/server/code.ts
    __webpack_require__.g.doGet = function(e) {
        return HtmlService.createHtmlOutputFromFile("dist/index.html").setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag("viewport", "width=device-width, initial-scale=1").setTitle("DirtySpokesSeriesApp");
    }, __webpack_require__.g.uploadHandler = function(formObject) {
        var xcelFileId = function(formObject) {
            var tempFolderId = getTempFolderId(), tempFolder = DriveApp.getFolderById(tempFolderId);
            if (formObject.excelFile.length > 0) {
                var blob = formObject.excelFile;
                return tempFolder.createFile(blob).getId();
            }
            throw new Error("File selected contains no content.");
        }(formObject), packagedResults = function(documentId) {
            for (var uploadedSheet = SpreadsheetApp.openById(documentId), uploadedSheetRange = uploadedSheet.getActiveSheet(), rangeData = uploadedSheetRange.getRange(1, 1, uploadedSheetRange.getMaxRows(), 7).getValues(), packagedResults = {
                fileName: uploadedSheet.getName(),
                raceName: rangeData[1][0],
                seriesResults: {}
            }, i = 6; i < rangeData.length; i++) {
                var row = rangeData[i], firstColOnRow = row[0];
                if ("" !== firstColOnRow && "Place" !== firstColOnRow && isNaN(firstColOnRow) && !firstColOnRow.toLowerCase().includes("win")) for (packagedResults.seriesResults[firstColOnRow] = [], 
                row = rangeData[i += 3]; "" !== row[0] && !(i >= rangeData.length); ) packagedResults.seriesResults[firstColOnRow].push(row), 
                row = rangeData[++i];
            }
            return packagedResults;
        }(function(documentId) {
            var _a, file = DriveApp.getFileById(documentId);
            if (!file) throw new Error("Could not find downloaded file to convert");
            var config = {
                title: "[Google Sheets] ".concat(file.getName()),
                parents: [ {
                    id: getTempFolderId()
                } ],
                mimeType: "application/vnd.google-apps.spreadsheet"
            }, resultFile = null === (_a = Drive.Files) || void 0 === _a ? void 0 : _a.insert(config, file.getBlob());
            if (!resultFile || !resultFile.id) throw new Error("Could not find converted file");
            return resultFile.id;
        }(xcelFileId));
        !function(packagedResults) {
            for (var mainSheet = SpreadsheetApp.openById(getMainSheetProps(packagedResults).id), sheetNames = mainSheet.getSheets().map((function(s) {
                return s.getName();
            })), _i = 0, _a = Object.keys(packagedResults.seriesResults); _i < _a.length; _i++) {
                var seriesGroup = _a[_i];
                sheetNames.includes(seriesGroup) || mainSheet.insertSheet(seriesGroup).getRange(1, 1, 1, 11).setValues([ [ "Runner Id", "Points Awarded", "Race", "Place", "Name", "City", "Age", "Overall", "Total Time", "Pace", "File Name" ] ]);
            }
        }(packagedResults), function(packagedResults) {
            var mainSheetProps = getMainSheetProps(packagedResults), mainSheet = SpreadsheetApp.openById(mainSheetProps.id), uploadedFileName = packagedResults.fileName, raceName = packagedResults.raceName;
            if (mainSheetProps.raceNames.includes(raceName)) throw new Error("Race has already been added. Please remove it before adding it again.");
            mainSheetProps.raceNames.push(raceName);
            for (var _i = 0, _a = Object.keys(packagedResults.seriesResults); _i < _a.length; _i++) {
                var seriesGroup = _a[_i], seriesSheet = mainSheet.getSheetByName(seriesGroup);
                if (!seriesSheet) throw new Error("Could not get series sheet tab in mainSheet: ".concat(mainSheet.getId(), " for series: ").concat(seriesGroup));
                for (var _b = 0, _c = packagedResults.seriesResults[seriesGroup]; _b < _c.length; _b++) {
                    var runner = _c[_b], nameArray = runner[1].toLowerCase().split(" "), age = runner[3], place = parseInt(runner[0]), runnerId = nameArray[0][0] + nameArray[nameArray.length - 1] + age + seriesGroup.toLowerCase()[0], pointsAwarded = getPointsFromPlace(place), row = getNextOpenRowInSeriesSheet(seriesSheet);
                    seriesSheet.getRange(row, 1, 1, 11).setValues([ [ runnerId, pointsAwarded, raceName, place, runner[1], runner[2], age, runner[4], runner[5], runner[6], uploadedFileName ] ]);
                }
            }
            setMainSheetRaceNames(packagedResults, mainSheetProps.raceNames);
        }(packagedResults);
    }, __webpack_require__.g.test = function() {};
    for (var i in __webpack_exports__) this[i] = __webpack_exports__[i];
    __webpack_exports__.__esModule && Object.defineProperty(this, "__esModule", {
        value: !0
    })
    /******/;
})();