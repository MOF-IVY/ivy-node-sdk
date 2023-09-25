"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponse = void 0;
const axios_1 = require("axios");
class BaseResponse {
    constructor(data, message, statusCode = axios_1.HttpStatusCode.Ok) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }
    toJson() {
        return {
            data: this.data,
            message: this.message,
            statusCode: this.statusCode,
        };
    }
}
exports.BaseResponse = BaseResponse;
//# sourceMappingURL=base-response.model.js.map