function doGet(e) {}

function generateReport(formObject) {}

function removeRaceHandler(formObject) {}

function getRaceNames() {}

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
    var getLongMainSheetProps = function() {
        var props = PropertiesService.getScriptProperties(), id = props.getProperty("MAIN_LONG_SHEET_ID"), raceNamesProp = props.getProperty("MAIN_LONG_SHEET_RACE_NAMES"), raceNames = [];
        if (!raceNamesProp) throw new Error("Could not retrieve Main Long Sheet Race Names");
        if (raceNames = JSON.parse(raceNamesProp), id) return {
            raceType: "long",
            id,
            raceNames
        };
        throw new Error("Could not retrieve Main Long Sheet ID and Race Count");
    }, setLongMainSheetRaces = function(newRaces) {
        PropertiesService.getScriptProperties().setProperty("MAIN_LONG_SHEET_RACE_NAMES", JSON.stringify(newRaces));
    }, getShortMainSheetProps = function() {
        var props = PropertiesService.getScriptProperties(), id = props.getProperty("MAIN_SHORT_SHEET_ID"), raceNamesProp = props.getProperty("MAIN_SHORT_SHEET_RACE_NAMES"), raceNames = [];
        if (!raceNamesProp) throw new Error("Could not retrieve Main Short Sheet Race Names");
        if (raceNames = JSON.parse(raceNamesProp), id) return {
            raceType: "short",
            id,
            raceNames
        };
        throw new Error("Could not retrieve Main Short Sheet ID");
    }, setShortMainSheetRaces = function(newRaces) {
        PropertiesService.getScriptProperties().setProperty("MAIN_SHORT_SHEET_RACE_NAMES", JSON.stringify(newRaces));
    }, getMainSheetProps = function(packagedResults) {
        var main_short_props = getShortMainSheetProps(), main_long_props = getLongMainSheetProps();
        if (packagedResults.fileName.toLowerCase().includes("short")) return main_short_props;
        if (packagedResults.fileName.toLowerCase().includes("long")) return main_long_props;
        throw new Error("Could not determine main sheet id based off uploaded file name");
    }, getTempFolderId = function() {
        var tempFolderId = PropertiesService.getScriptProperties().getProperty("TEMP_FOLDER_ID");
        if (tempFolderId) return tempFolderId;
        throw new Error("No Temp Folder Found");
    }, placePackagedResultsToTabs = function(packagedResults) {
        var mainSheetProps = getMainSheetProps(packagedResults), mainSheet = SpreadsheetApp.openById(mainSheetProps.id), uploadedFileName = packagedResults.fileName, raceName = packagedResults.raceName;
        if (mainSheetProps.raceNames.includes(raceName)) throw new Error("Race has already been added. Please remove it before adding it again.");
        mainSheetProps.raceNames.push(raceName);
        for (var _i = 0, _a = Object.keys(packagedResults.seriesResults); _i < _a.length; _i++) {
            var seriesGroup = _a[_i], seriesSheet = mainSheet.getSheetByName(seriesGroup);
            if (!seriesSheet) throw new Error("Could not get series sheet tab in mainSheet: ".concat(mainSheet.getId(), " for series: ").concat(seriesGroup));
            for (var _b = 0, _c = packagedResults.seriesResults[seriesGroup]; _b < _c.length; _b++) {
                var runner = _c[_b], nameArray = runner[1].trim().toLowerCase().split(" "), age = runner[3], place = parseInt(runner[0]), runnerId = nameArray[0][0] + nameArray[nameArray.length - 1] + age + seriesGroup.toLowerCase()[0], pointsAwarded = getPointsFromPlace(place), row = getNextOpenRowInSeriesSheet(seriesSheet);
                seriesSheet.getRange(row, 1, 1, 11).setValues([ [ runnerId, pointsAwarded, raceName, place, runner[1], runner[2], age, runner[4], runner[5], runner[6], uploadedFileName ] ]);
            }
        }
        !function(packagedResults, newRaces) {
            if (packagedResults.fileName.toLowerCase().includes("short")) setShortMainSheetRaces(newRaces); else {
                if (!packagedResults.fileName.toLowerCase().includes("long")) throw new Error("Could not determine main sheet to set new Race Names");
                setLongMainSheetRaces(newRaces);
            }
        }(packagedResults, mainSheetProps.raceNames);
    }, getNextOpenRowInSeriesSheet = function(seriesSheet) {
        for (var sheetRange = seriesSheet.getRange(2, 1, seriesSheet.getMaxRows()).getValues(), i = 0; i < sheetRange.length; i++) if ("" == sheetRange[i][0].trim()) return i + 2;
        return -1;
    }, getPointsFromPlace = function(place) {
        return 20 - (place - 1) <= 0 ? 1 : 20 - (place - 1);
    };
    // CONCATENATED MODULE: ./src/server/code.ts
    __webpack_require__.g.doGet = function(e) {
        return HtmlService.createHtmlOutputFromFile("dist/index.html").setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag("viewport", "width=device-width, initial-scale=1").setTitle("DirtySpokesSeriesApp");
    }, __webpack_require__.g.generateReport = function(formObject) {
        if (!formObject.raceType || "long" != formObject.raceType && "short" != formObject.raceType) throw new Error("Invalid race type selected.");
        var mainSheetProps, raceType = formObject.raceType, numberPerSeries = parseInt(formObject.numberPerSeries), allowedAbsences = parseInt(formObject.allowedAbsences);
        !function(mainSheetProps, mainReport, numReportedPerSeriesGroup, allowedAbsences) {
            var _a, _b;
            void 0 === numReportedPerSeriesGroup && (numReportedPerSeriesGroup = 3), void 0 === allowedAbsences && (allowedAbsences = 2);
            var mainSheet = SpreadsheetApp.openById(mainSheetProps.id);
            if (!mainSheet) throw new Error("Cannot open main sheet with id: ".concat(mainSheetProps.id));
            for (var recordsRangeValues = [], _loop_1 = function(seriesGroup) {
                for (var seriesArray = [ [ seriesGroup, "" ] ], _d = 0, _e = Object.keys(mainReport[seriesGroup]); _d < _e.length; _d++) {
                    var runner = _e[_d];
                    if (mainSheetProps.raceNames.length > allowedAbsences) {
                        if (!(mainReport[seriesGroup][runner].totalRaces >= mainSheetProps.raceNames.length - allowedAbsences)) continue;
                        seriesArray.push([ mainReport[seriesGroup][runner].name, mainReport[seriesGroup][runner].totalPoints + "" ]);
                    } else seriesArray.push([ mainReport[seriesGroup][runner].name, mainReport[seriesGroup][runner].totalPoints + "" ]);
                }
                seriesArray.sort((function(a, b) {
                    return a[0] == seriesGroup ? -1 : parseInt(a[1]) < parseInt(b[1]) ? 1 : parseInt(a[1]) > parseInt(b[1]) ? -1 : 0;
                }));
                var numRunnersOverReportLimit = seriesArray.length - 1 - numReportedPerSeriesGroup;
                if (numRunnersOverReportLimit > 0) for (var i = 0; i < numRunnersOverReportLimit; i++) seriesArray.pop();
                for (var _f = 0, seriesArray_1 = seriesArray; _f < seriesArray_1.length; _f++) {
                    var row = seriesArray_1[_f];
                    recordsRangeValues.push(row);
                }
            }, _i = 0, _c = Object.keys(mainReport); _i < _c.length; _i++) _loop_1(_c[_i]);
            null === (_a = mainSheet.getSheetByName("Results")) || void 0 === _a || _a.clear(), 
            null === (_b = mainSheet.getSheetByName("Results")) || void 0 === _b || _b.getRange(1, 1, recordsRangeValues.length, 2).setValues(recordsRangeValues);
        }(mainSheetProps = "long" === raceType ? getLongMainSheetProps() : getShortMainSheetProps(), function(mainSheetId) {
            var mainSheet = SpreadsheetApp.openById(mainSheetId);
            if (!mainSheet) throw new Error("Cannot open main sheet with id: ".concat(mainSheetId));
            for (var mainReport = {}, _i = 0, sheets_1 = mainSheet.getSheets(); _i < sheets_1.length; _i++) {
                var sheet = sheets_1[_i], seriesGroup = sheet.getName();
                if ("Results" !== seriesGroup) {
                    mainReport[seriesGroup] = {};
                    for (var _a = 0, seriesGroupRange_1 = sheet.getRange(2, 1, sheet.getMaxRows(), 11).getValues(); _a < seriesGroupRange_1.length; _a++) {
                        var record = seriesGroupRange_1[_a];
                        if ("Runner Id" !== record[0] && "" !== record[0].trim()) {
                            var mainReportForRunner = mainReport[seriesGroup][record[0]];
                            mainReportForRunner ? (mainReportForRunner.totalPoints += parseInt(record[1]), mainReportForRunner.totalRaces += 1) : mainReport[seriesGroup][record[0]] = {
                                name: record[4],
                                totalPoints: parseInt(record[1]),
                                totalRaces: 1
                            };
                        }
                    }
                }
            }
            return mainReport;
        }(mainSheetProps.id), numberPerSeries, allowedAbsences);
        var blob = function(mainSheetProps) {
            for (var mainSheet = SpreadsheetApp.openById(mainSheetProps.id), mainSheetCopy = (mainSheet.getSheetByName("Results"), 
            mainSheet.copy("Temp Results Copy")), _i = 0, _a = mainSheetCopy.getSheets(); _i < _a.length; _i++) {
                var sheet = _a[_i];
                "Results" != sheet.getName() && mainSheetCopy.deleteSheet(sheet);
            }
            var url = "https://docs.google.com/feeds/download/spreadsheets/Export?key=" + mainSheetCopy.getId() + "&exportFormat=xlsx", params = {
                method: "get",
                headers: {
                    Authorization: "Bearer " + ScriptApp.getOAuthToken()
                },
                muteHttpExceptions: !0
            }, blob = UrlFetchApp.fetch(url, params).getBlob();
            return blob.setName("GeneratedReport.xlsx"), blob;
        }(mainSheetProps);
        return "data:".concat(MimeType.MICROSOFT_EXCEL, ";base64,") + Utilities.base64Encode(blob.getBytes());
    }, __webpack_require__.g.removeRaceHandler = function(formObject) {
        if (!formObject.raceType || "long" != formObject.raceType && "short" != formObject.raceType) throw new Error("Invalid race type selected.");
        if (!formObject.raceName) throw new Error("No race name given.");
        return function(mainSheetProps, raceName) {
            if (!mainSheetProps.raceNames.includes(raceName)) throw new Error('Could not find race: "'.concat(raceName, '" to remove.'));
            for (var failedSheets = [], _i = 0, sheetTabs_1 = SpreadsheetApp.openById(mainSheetProps.id).getSheets(); _i < sheetTabs_1.length; _i++) {
                var sheet = sheetTabs_1[_i];
                try {
                    if ("Results" === sheet.getName()) continue;
                    for (var runnerValues = sheet.getRange(2, 1, sheet.getMaxRows(), 11).getValues(), newRunnerValues = [], i = 0; i < runnerValues.length; i++) runnerValues[i][2] != raceName && newRunnerValues.push(runnerValues[i]);
                    sheet.getRange(2, 1, newRunnerValues.length, 11).setValues(newRunnerValues);
                } catch (e) {
                    failedSheets.push(sheet.getName());
                }
            }
            if (failedSheets.length > 0) throw new Error("Failed to remove race for seriesGroups: ".concat(failedSheets.join(", ")));
            mainSheetProps.raceNames.splice(mainSheetProps.raceNames.indexOf(raceName), 1), 
            "long" === mainSheetProps.raceType ? setLongMainSheetRaces(mainSheetProps.raceNames) : setShortMainSheetRaces(mainSheetProps.raceNames);
        }("long" === formObject.raceType ? getLongMainSheetProps() : getShortMainSheetProps(), formObject.raceName), 
        __webpack_require__.g.getRaceNames();
    }, __webpack_require__.g.getRaceNames = function() {
        return {
            long: getLongMainSheetProps().raceNames,
            short: getShortMainSheetProps().raceNames
        };
    }, __webpack_require__.g.uploadHandler = function(formObject) {
        var excelFileId, gSheetId, caughtError;
        try {
            excelFileId = function(formObject) {
                var tempFolderId = getTempFolderId(), tempFolder = DriveApp.getFolderById(tempFolderId);
                if (formObject.excelFile.length > 0) {
                    var blob = formObject.excelFile;
                    return tempFolder.createFile(blob).getId();
                }
                throw new Error("File selected contains no content.");
            }(formObject);
            var packagedResults = function(documentId) {
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
            }(gSheetId = function(documentId) {
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
            }(excelFileId));
            !function(packagedResults) {
                var mainSheet = SpreadsheetApp.openById(getMainSheetProps(packagedResults).id), sheetNames = mainSheet.getSheets().map((function(s) {
                    return s.getName();
                }));
                sheetNames.includes("Results") || mainSheet.insertSheet("Results");
                for (var _i = 0, _a = Object.keys(packagedResults.seriesResults); _i < _a.length; _i++) {
                    var seriesGroup = _a[_i];
                    sheetNames.includes(seriesGroup) || mainSheet.insertSheet(seriesGroup).getRange(1, 1, 1, 11).setValues([ [ "Runner Id", "Points Awarded", "Race", "Place", "Name", "City", "Age", "Overall", "Total Time", "Pace", "File Name" ] ]);
                }
            }(packagedResults), placePackagedResultsToTabs(packagedResults);
        } catch (error) {
            caughtError = error;
        } finally {
            var fileIds = [];
            if (excelFileId != undefined && fileIds.push(excelFileId), gSheetId != undefined && fileIds.push(gSheetId), 
            function(fileIds) {
                for (var _i = 0, fileIds_1 = fileIds; _i < fileIds_1.length; _i++) {
                    var fileId = fileIds_1[_i];
                    DriveApp.getFileById(fileId).setTrashed(!0);
                }
            }(fileIds), caughtError) throw caughtError;
        }
    }, __webpack_require__.g.test = function() {};
    for (var i in __webpack_exports__) this[i] = __webpack_exports__[i];
    __webpack_exports__.__esModule && Object.defineProperty(this, "__esModule", {
        value: !0
    })
    /******/;
})();