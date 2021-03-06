/**
 * Module that defines everything related to building Candlesticks.
 */
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
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Column } from "./Column";
import { Line } from "../../core/elements/Line";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates Candlesticks.
 *
 * @see {@link ICandlestickEvents} for a list of available events
 * @see {@link ICandlestickAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var Candlestick = /** @class */ (function (_super) {
    __extends(Candlestick, _super);
    /**
     * Constructor
     */
    function Candlestick() {
        var _this = _super.call(this) || this;
        _this.className = "Candlestick";
        _this.layout = "none";
        return _this;
    }
    Candlestick.prototype.createAssets = function () {
        _super.prototype.createAssets.call(this);
        this.lowLine = this.createChild(Line);
        this.lowLine.shouldClone = false;
        this.highLine = this.createChild(Line);
        this.highLine.shouldClone = false;
    };
    Candlestick.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.lowLine) {
            this.lowLine.copyFrom(source.lowLine);
        }
        if (this.highLine) {
            this.highLine.copyFrom(source.highLine);
        }
    };
    return Candlestick;
}(Column));
export { Candlestick };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Candlestick"] = Candlestick;
//# sourceMappingURL=Candlestick.js.map