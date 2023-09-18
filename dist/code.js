function doGet(e) {}

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
    var getTempFolderId = function() {
        var tempFolderId = PropertiesService.getScriptProperties().getProperty("TEMP_FOLDER_ID");
        if (tempFolderId) return tempFolderId;
        throw new Error("No Temp Folder Found");
    };
    // CONCATENATED MODULE: ./src/server/code.ts
    __webpack_require__.g.doGet = function(e) {
        return HtmlService.createHtmlOutputFromFile("dist/index.html");
    }, __webpack_require__.g.test = function() {
        return function(documentId) {
            var _a, file = DriveApp.getFileById(documentId);
            if (!file) throw new Error("Could not find downloaded file to convert");
            var config = {
                title: "[Google Sheets] ".concat(file.getName()),
                parents: [ {
                    id: getTempFolderId()
                } ],
                mimeType: "application/vnd.google-apps.spreadsheet"
            }, resultFile = null === (_a = Drive.Files) || void 0 === _a ? void 0 : _a.insert(config, file.getBlob());
            if (!resultFile) throw new Error("Could not find converted file");
            return resultFile.driveId;
        }("<file id>");
    };
    for (var i in __webpack_exports__) this[i] = __webpack_exports__[i];
    __webpack_exports__.__esModule && Object.defineProperty(this, "__esModule", {
        value: !0
    })
    /******/;
})();