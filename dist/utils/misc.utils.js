"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscUtils = void 0;
class MiscUtils {
    static getNumberPrecision(number) {
        var _a;
        return ((_a = number.toString().split(".")[1]) !== null && _a !== void 0 ? _a : "1").length;
    }
    static removeSymbolSlash(sym) {
        return sym.replace("/", "");
    }
    static getDistinctStrings(strings) {
        return [...new Set(strings)];
    }
    static sleepMs(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((r) => setTimeout(() => r(), ms));
        });
    }
    static sleepS(s) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sleepMs(s * 1000);
        });
    }
    /**
     * converts a time frame to milliseconds
     * @param timeFrame string in form of (s,m,h,d,w,M,y)
     * @returns number ms representation of given time frame
     */
    static parseTimeFrameToMs(timeFrame) {
        const amount = +timeFrame.slice(0, -1);
        const unit = timeFrame.slice(-1);
        let scale;
        if (unit === "y") {
            scale = 60 * 60 * 24 * 365;
        }
        else if (unit === "M") {
            scale = 60 * 60 * 24 * 30;
        }
        else if (unit === "w") {
            scale = 60 * 60 * 24 * 7;
        }
        else if (unit === "d") {
            scale = 60 * 60 * 24;
        }
        else if (unit === "h") {
            scale = 60 * 60;
        }
        else if (unit === "m") {
            scale = 60;
        }
        else if (unit === "s") {
            scale = 1;
        }
        else {
            throw Error("time frame unit " + unit + " is not supported");
        }
        return amount * scale * 1000;
    }
    /**
     * Returns information about tf in form of object with
     * unit & amount properties. Where unit is a string & amount
     * a number
     * @param tf the input time frame (s,m,h,d,w,M,y)
     * @returns object with unit & amount properties
     */
    static getTfMetadata(tf) {
        var _a;
        const splitTf = tf.split("");
        return {
            unit: (_a = splitTf.pop()) !== null && _a !== void 0 ? _a : "",
            amount: +splitTf.join(""),
        };
    }
    static orderTFs(tfs) {
        const seconds = [];
        const minutes = [];
        const hours = [];
        const days = [];
        const weeks = [];
        const months = [];
        const years = [];
        tfs.forEach((tf) => {
            switch (tf.split("").pop()) {
                case "s":
                    seconds.push(this.getTfMetadata(tf).amount);
                    break;
                case "m":
                    minutes.push(this.getTfMetadata(tf).amount);
                    break;
                case "h":
                    hours.push(this.getTfMetadata(tf).amount);
                    break;
                case "d":
                    days.push(this.getTfMetadata(tf).amount);
                    break;
                case "w":
                    weeks.push(this.getTfMetadata(tf).amount);
                    break;
                case "M":
                    months.push(this.getTfMetadata(tf).amount);
                    break;
                case "y":
                    years.push(this.getTfMetadata(tf).amount);
                    break;
            }
        });
        return [
            ...seconds.sort((a, b) => a - b).map((u) => `${u}s`),
            ...minutes.sort((a, b) => a - b).map((u) => `${u}m`),
            ...hours.sort((a, b) => a - b).map((u) => `${u}h`),
            ...days.sort((a, b) => a - b).map((u) => `${u}d`),
            ...weeks.sort((a, b) => a - b).map((u) => `${u}w`),
            ...months.sort((a, b) => a - b).map((u) => `${u}M`),
            ...years.sort((a, b) => a - b).map((u) => `${u}y`),
        ];
    }
}
exports.MiscUtils = MiscUtils;
//# sourceMappingURL=misc.utils.js.map