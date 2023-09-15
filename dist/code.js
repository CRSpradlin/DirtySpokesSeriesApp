function doGet(e) {}

function appScriptTest() {}

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
        /******/    }();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {}, greeter = function(person) {
        return "Hello, ".concat(person, "!");
    };
    __webpack_require__.g.doGet = function(e) {
        return HtmlService.createHtmlOutputFromFile("dist/index.html");
    }, __webpack_require__.g.appScriptTest = function() {
        return function testGreeter() {
            return Logger.log(greeter("Brittany")), greeter("Brittany");
        }();
    };
    for (var i in __webpack_exports__) this[i] = __webpack_exports__[i];
    __webpack_exports__.__esModule && Object.defineProperty(this, "__esModule", {
        value: !0
    })
    /******/;
})();