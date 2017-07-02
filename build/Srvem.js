"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var middleware_1 = require("@srvem/middleware");
var http_1 = require("http");
var Srvem = (function () {
    function Srvem() {
        this.middleware = [];
        this.server = null;
    }
    Srvem.prototype.use = function () {
        var middleware = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middleware[_i] = arguments[_i];
        }
        for (var _a = 0, middleware_2 = middleware; _a < middleware_2.length; _a++) {
            var m = middleware_2[_a];
            this.middleware.push(m);
        }
    };
    Srvem.prototype.handle = function () {
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        var _loop_1 = function (handler) {
            var m = new ((function (_super) {
                __extends(M, _super);
                function M() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                M.prototype.main = function () {
                    return handler(this.request, this.response);
                };
                return M;
            }(middleware_1.SrvMiddleware)))();
            this_1.middleware.push(m);
        };
        var this_1 = this;
        for (var _a = 0, handlers_1 = handlers; _a < handlers_1.length; _a++) {
            var handler = handlers_1[_a];
            _loop_1(handler);
        }
    };
    Srvem.prototype.start = function () {
        var _this = this;
        return this.server = http_1.createServer(function (request, response) {
            for (var _i = 0, _a = _this.middleware; _i < _a.length; _i++) {
                var m = _a[_i];
                m.request = request;
                m.response = response;
                m.main();
            }
        });
    };
    return Srvem;
}());
exports.Srvem = Srvem;
//# sourceMappingURL=Srvem.js.map