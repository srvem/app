"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var Srvem = (function () {
    function Srvem() {
        this.middleware = [];
    }
    Srvem.prototype.use = function (middleware) {
        this.middleware.push(middleware);
    };
    Srvem.prototype.callback = function () {
        var _this = this;
        return function (request, response) {
            _this.middleware.forEach(function (m) {
                m.request = request;
                m.response = response;
                m.main();
            });
        };
    };
    Srvem.prototype.start = function () {
        return this.server = http_1.createServer(this.callback());
    };
    return Srvem;
}());
exports.Srvem = Srvem;
//# sourceMappingURL=Srvem.js.map