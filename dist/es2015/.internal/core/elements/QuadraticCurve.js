/**
 * Functionality for drawing quadratic curves.
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
import { Line } from "./Line";
import { color } from "../utils/Color";
import * as $path from "../rendering/Path";
import * as $math from "../utils/Math";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a waved line.
 *
 * @see {@link IQuadraticCurveEvents} for a list of available events
 * @see {@link IQuadraticCurveAdapters} for a list of available Adapters
 */
var QuadraticCurve = /** @class */ (function (_super) {
    __extends(QuadraticCurve, _super);
    /**
     * Constructor
     */
    function QuadraticCurve() {
        var _this = _super.call(this) || this;
        _this.className = "QuadraticCurve";
        _this.element = _this.paper.add("path");
        _this.pixelPerfect = false;
        _this.fill = color();
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the waved line.
     *
     * @ignore Exclude from docs
     */
    QuadraticCurve.prototype.draw = function () {
        //super.draw();
        if ($type.isNumber(this.x1 + this.x2 + this.y1 + this.y2 + this.cpx + this.cpy)) {
            var p1 = { x: this.x1, y: this.y1 };
            var p2 = { x: this.x2, y: this.y2 };
            var cp = { x: this.cpx, y: this.cpy };
            var d = $path.moveTo(p1) + $path.quadraticCurveTo(p2, cp);
            this.element.attr({ "d": d });
        }
    };
    Object.defineProperty(QuadraticCurve.prototype, "cpx", {
        /**
         * @return {number} X
         */
        get: function () {
            return this.getPropertyValue("cpx");
        },
        /**
         * X coordinate of control point.
         *
         * @param {number} value X
         */
        set: function (value) {
            this.setPropertyValue("cpx", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuadraticCurve.prototype, "cpy", {
        /**
         * @return {number} Y
         */
        get: function () {
            return this.getPropertyValue("cpy");
        },
        /**
         * Y coordinate of control point.
         *
         * @param {number} value Y
         */
        set: function (value) {
            this.setPropertyValue("cpy", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts relative position along the line (0-1) into pixel coordinates.
     *
     * @param  {number}             position  Position (0-1)
     * @return {IOrientationPoint}            Coordinates
     */
    QuadraticCurve.prototype.positionToPoint = function (position) {
        var p1 = { x: this.x1, y: this.y1 };
        var cp = { x: this.cpx, y: this.cpy };
        var p2 = { x: this.x2, y: this.y2 };
        var point1 = $math.getPointOnQuadraticCurve(p1, p2, cp, position);
        var point2 = $math.getPointOnQuadraticCurve(p1, p2, cp, position + 0.001);
        return { x: point1.x, y: point1.y, angle: $math.getAngle(point1, point2) };
    };
    return QuadraticCurve;
}(Line));
export { QuadraticCurve };
//# sourceMappingURL=QuadraticCurve.js.map