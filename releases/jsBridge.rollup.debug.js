(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.jsBridge = factory());
}(this, function () { 'use strict';

    var __DEBUG_MODE__ = true

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /**
    * entry
    */
    var JsBridge = /** @class */ (function () {
        function JsBridge(options) {
            // hbqJsBridge 方法名统一前缀 
            this.jsBridgePrefix = 'hbqJsBridge';
            // 前端事件执行完，通知native的统一事件名
            this.nativeReceiveEventName = 'hbqNativeReceiveEvent';
            // 普通请求回调事件挂载对象
            this.callbacks = {};
            // 事件请求回调挂载对象
            this.events = {};
            // jsEngine 名, iOS为 webkit
            this.jsEngine = 'webkit';
            // 一个自增的序列每次发起调用时增加一个值
            this.id = 0;
            if (!(this instanceof JsBridge)) {
                return new JsBridge(options);
            }
            window[this.jsBridgePrefix + "Receive"] = this.receive;
        }
        /**
         * 向native发起调用
         * @param name
         * @param data
         * @param callback
         */
        JsBridge.prototype.invoke = function (name, data, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var handler;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            handler = window[this.jsEngine].messageHandlers[name];
                            if (!handler) {
                                return [2 /*return*/, this];
                            }
                            return [4 /*yield*/, handler.postMessage(__assign({}, data, { callbackId: ++this.id }))];
                        case 1:
                            _a.sent();
                            if (callback) {
                                this.callbacks[this.id] = callback;
                            }
                            return [2 /*return*/, this];
                    }
                });
            });
        };
        /**
         * 接收native的回调,前端不需要调用此方法,由native方调用
         * @param reponse
         */
        JsBridge.prototype.receive = function (response) {
            var eventName = response.eventName, callbackId = response.callbackId, responseId = response.responseId, data = response.data;
            if (callbackId) {
                this.callbacks[callbackId] && this.callbacks[callbackId]();
            }
            else if (eventName) {
                var result = this.emit(eventName, data);
                this.invoke(this.nativeReceiveEventName, { result: result, responseId: responseId });
            }
        };
        /**
         * 由native触发web端的事件时执行
         * @param name
         * @param options
         * @returns 返回事件执行的结果
         */
        JsBridge.prototype.emit = function (name, options) {
            if (!this.events[name]) {
                return this;
            }
            var totalResult = {};
            this.events[name].forEach(function (callback) {
                var result = callback(options);
                Object.assign(totalResult, result);
            });
            return totalResult;
        };
        /**
         * 添加事件绑定供native调用
         * @param name 事件名
         * @param callback
         */
        JsBridge.prototype.on = function (name, callback) {
            if (!name || !callback)
                return;
            this.events[name] = this.events[name] || [];
            this.events[name].push(callback);
            return this;
        };
        /**
         * 移除事件绑定
         * @param name
         * @param callback
         */
        JsBridge.prototype.off = function (name, callback) {
            var _this = this;
            if (!name || !this.events[name])
                return this;
            if (!callback) {
                delete this.events[name];
                return this;
            }
            var callbacks = [];
            this.events[name].forEach(function (n) {
                if (_this.events[name] !== callback) {
                    callbacks.push(n);
                }
            });
            this.events[name] = callbacks;
            return this;
        };
        return JsBridge;
    }());

    return JsBridge;

}));
