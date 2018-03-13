/**
 * Provides functionality used to creating and showing tooltips (balloons).
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
import { Container } from "../Container";
import { PointedRectangle } from "./PointedRectangle";
import { Text } from "../elements/Text";
import { Animation } from "../utils/Animation";
import { color } from "../utils/Color";
import { DropShadowFilter } from "../rendering/filters/DropShadowFilter";
import * as $math from "../utils/Math";
import * as $ease from "../utils/Ease";
import * as $utils from "../utils/Utils";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Tooltip displays text and/or multimedia information in a balloon over chart
 * area.
 * @see {@link ITooltipEvents} for a list of available events
 * @see {@link ITooltipAdapters} for a list of available Adapters
 */
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    /**
     * Constructor
     */
    function Tooltip() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Text element that represents tooltip contents.
         */
        _this.textElement = new Text();
        /**
         * Holds numeric boundary values. Calculated from the `boundingContainer`.
         *
         * @type {IRectangle}
         */
        _this._boundingRect = { x: -20000, y: -20000, width: 40000, height: 40000 };
        /**
         * Coordinates tolltip's pointer (stem) should point to.
         *
         * @type {IPoint}
         */
        _this._pointTo = { x: 0, y: 0 };
        /**
         * [fitPointerToBounds description]
         *
         * @todo Description
         * @type {boolean}
         */
        _this.fitPointerToBounds = false;
        /**
         * If tooltipOrientation is vertical, it can be drawn below or above point. We need to know this when solving overlapping
         *
         * @type "up" | "down"
         * @ignore
         */
        _this._verticalOrientation = "up";
        _this.className = "Tooltip";
        _this.isMeasured = false;
        _this.getFillFromObject = true;
        _this.margin(5, 5, 5, 5);
        // Create chrome/background
        var background = _this.background;
        background.mouseEnabled = false;
        background.fillOpacity = 0.9;
        background.strokeWidth = 1;
        background.strokeOpacity = 1;
        background.stroke = color("#ffffff");
        background.cornerRadius = 3;
        background.pointerLength = 6;
        background.pointerBaseWidth = 10;
        _this.autoTextColor = true;
        // Create text element
        _this.textElement = _this.createChild(Text);
        _this.textElement.padding(7, 12, 6, 12);
        _this.textElement.mouseEnabled = false;
        _this.textElement.horizontalCenter = "middle";
        _this.textElement.fill = color("#ffffff");
        _this._disposers.push(_this.textElement);
        _this.textElement.zIndex = 1; // @todo remove this line when bg sorting is solved
        // Set defaults
        _this.pointerOrientation = "vertical";
        var dropShadow = new DropShadowFilter();
        dropShadow.dy = 1;
        dropShadow.dx = 1;
        dropShadow.opacity = 0.5;
        _this.filters.push(dropShadow);
        _this.animationDuration = 0;
        _this.animationEasing = $ease.cubicOut;
        // Set accessibility options
        _this.role = "tooltip";
        _this.visible = false;
        _this.opacity = 0;
        _this.x = 0;
        _this.y = 0;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Tooltip.prototype, "getStrokeFromObject", {
        /**
         * Specifies if tooltip background should get stroke color from the sprite it is pointing to.
         *
         * @return {boolean}
         * @default false
         */
        get: function () {
            return this.getPropertyValue("getStrokeFromObject");
        },
        /**
         * Specifies if tooltip background should get stroke color from the sprite it is pointing to.
         *
         * @param {value} value boolean
         */
        set: function (value) {
            this.setPropertyValue("getStrokeFromObject", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "autoTextColor", {
        /**
         * Specifies if text color should be chosen automatically for a better readability.
         *
         * @return {boolean}
         * @default true
         */
        get: function () {
            return this.getPropertyValue("autoTextColor");
        },
        /**
         * Specifies if text color should be chosen automatically for a better readability.
         *
         * @param {value} value boolean
         */
        set: function (value) {
            this.setPropertyValue("autoTextColor", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "getFillFromObject", {
        /**
         * Specifies if tooltip background should get fill color from the sprite it is pointing to.
         *
         * @return {boolean}
         * @default true
         */
        get: function () {
            return this.getPropertyValue("getFillFromObject");
        },
        /**
         * Specifies if tooltip background should get fill color from the sprite it is pointing to.
         *
         * @param {value} value boolean
         */
        set: function (value) {
            this.setPropertyValue("getFillFromObject", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and returns a background element.
     *
     * @ignore Exclude from docs
     * @return {PointedRectangle} Background
     */
    Tooltip.prototype.createBackground = function () {
        return new PointedRectangle();
    };
    Object.defineProperty(Tooltip.prototype, "pointerOrientation", {
        /**
         * @return {PointerOrientation} Orientation
         */
        get: function () {
            return this.getPropertyValue("pointerOrientation");
        },
        /**
         * Pointer orientation: "horizontal" or "vertical".
         *
         * @default "vertical"
         * @param {PointerOrientation}  value  Orientation
         */
        set: function (value) {
            this.setPropertyValue("pointerOrientation", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "animationDuration", {
        /**
         * @return {PointerOrientation} Orientation
         */
        get: function () {
            return this.getPropertyValue("animationDuration");
        },
        /**
         * Duration in milliseconds for the animation to take place when the tolltip
         * is moving from one place to another.
         * @default 0
         * @param {number}  value  number
         */
        set: function (value) {
            this.setPropertyValue("animationDuration", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "animationEasing", {
        /**
         * @return {Function}
         */
        get: function () {
            return this.getPropertyValue("animationEasing");
        },
        /**
         * Tooltip animation easing function.
         * @todo: review description and default
         * @default $ease.cubicOut
         * @param {Function}  value (value: number) => number
         */
        set: function (value) {
            this.setPropertyValue("animationEasing", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "html", {
        /**
         * @return {string} HTML content
         */
        get: function () {
            return this.textElement.html;
        },
        /**
         * HTML content for the Tooltip.
         *
         * Provided value will be used as is, without applying any further
         * formatting to it.
         *
         * @param {string}  value  HTML content
         */
        set: function (value) {
            this.textElement.html = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets data item for the tooltip.
     *
     * This wil be used in resolving field references in text and replacing them
     * with real values.
     *
     * @ignore Exclude from docs
     * @param {DataItem}  dataItem  Data item
     */
    Tooltip.prototype.setDataItem = function (dataItem) {
        this.textElement.dataItem = dataItem;
        _super.prototype.setDataItem.call(this, dataItem);
    };
    Object.defineProperty(Tooltip.prototype, "text", {
        /**
         * @return {string} SVG text
         */
        get: function () {
            return this.textElement.text;
        },
        /**
         * SVG text content for the Tooltip.
         *
         * Text can have a number of formatting options supported by
         * [[TextFormatter]].
         *
         * @param {string}  value  SVG text
         */
        set: function (value) {
            if (this.textElement.text != value) {
                this.textElement.text = value;
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates the Tooltip.
     *
     * @ignore Exclude from docs
     */
    Tooltip.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var textElement = this.textElement;
        if (textElement.invalid) {
            textElement.validate();
        }
        var x = this._pointTo.x;
        var y = this._pointTo.y;
        var boundingRect = this._boundingRect;
        var textW = textElement.pixelWidth;
        var textH = textElement.pixelHeight;
        var pointerLength = this.background.pointerLength;
        var textX;
        var textY;
        // horizontal
        if (this.pointerOrientation == "horizontal") {
            textY = -textH / 2;
            if (x > boundingRect.x + boundingRect.width / 2) {
                textX = -textW / 2 - pointerLength;
            }
            else {
                textX = textW / 2 + pointerLength;
            }
        }
        else {
            textX = $math.fitToRange(0, boundingRect.x - x + textW / 2, boundingRect.x - x + boundingRect.width - textW / 2);
            if (y > boundingRect.y + textH + pointerLength) {
                textY = -textH - pointerLength;
                this._verticalOrientation = "up";
            }
            else {
                textY = pointerLength;
                this._verticalOrientation = "down";
            }
        }
        textY = $math.fitToRange(textY, boundingRect.y - y, boundingRect.y + boundingRect.height - textH - y);
        textElement.x = textX;
        textElement.y = textY;
        this.drawBackground();
    };
    /**
     * Overrides functionality from the superclass.
     *
     * @ignore Exclude from docs
     */
    Tooltip.prototype.updateBackground = function () {
        // Do nothing
    };
    /**
     * Draws Tooltip background (chrome, background and pointer/stem).
     *
     * @ignore Exclude from docs
     */
    Tooltip.prototype.drawBackground = function () {
        var textElement = this.textElement;
        var background = this.background;
        var textWidth = textElement.pixelWidth;
        var textHeight = textElement.pixelHeight;
        var pixelWidth = this.pixelWidth;
        var pixelHeight = this.pixelHeight;
        var boundingRect = this._boundingRect;
        var bgWidth = textWidth;
        var bgX = textElement.pixelX - textWidth / 2;
        var bgHeight = textHeight;
        var bgY = textElement.pixelY;
        var x = this._pointTo.x;
        var y = this._pointTo.y;
        var boundX1 = boundingRect.x - x;
        var boundX2 = boundX1 + boundingRect.width;
        var boundY1 = boundingRect.y - y;
        var boundY2 = boundY1 + boundingRect.height;
        // all this math required when tooltip width is set from outside and it's bigger then text width
        //not working well, when text changes, disabling for now.
        /*
        if (this.pointerOrientation == "vertical") {
            if (pixelWidth > textWidth) {
                let x1real: number = Math.min(-pixelWidth / 2, bgX);
                let x2real: number = Math.max(pixelWidth / 2, bgX + textWidth);
                // fit to bounds
                let x1: number = $math.fitToRange(x1real, boundX1, boundX2);
                let x2: number = $math.fitToRange(x2real, boundX1, boundX2);

                bgWidth = x2 - x1;
                bgX = x1;
            }
        }
        else {
            if (pixelHeight > textHeight) {
                let y1real: number = Math.min(-pixelHeight / 2, bgY);
                let y2real: number = Math.max(pixelHeight / 2, bgY + textHeight);
                // fit to bounds
                let y1: number = $math.fitToRange(y1real, boundY1, boundY2);
                let y2: number = $math.fitToRange(y2real, boundY1, boundY2);

                bgHeight = y2 - y1;
                bgY = y1;
            }
        }*/
        background.x = bgX;
        background.y = bgY;
        background.width = bgWidth;
        background.height = bgHeight;
        if (this.fitPointerToBounds) {
            background.pointerX = $math.fitToRange(-background.x, boundX1 - background.x, boundX2 - background.x);
            background.pointerY = $math.fitToRange(-background.y, boundY1 - background.y, boundY2 - background.y);
        }
        else {
            background.pointerX = -background.x;
            background.pointerY = -background.y;
        }
        background.validate();
    };
    /**
     * Set nes tooltip's anchor point and moves whole tooltip.
     *
     * @param {number}  x  X coordinate
     * @param {number}  y  Y coordinate
     */
    Tooltip.prototype.pointTo = function (point, instantly) {
        if (this._pointTo.x != point.x || this._pointTo.y != point.y) {
            this._pointTo = point;
            this.invalidate();
            // this helps to avoid strange animation from nowhere on initial show or when balloon was hidden already
            if (!this.visible || instantly) {
                this.moveTo(this._pointTo);
            }
            else {
                new Animation(this, [{ property: "x", to: point.x, from: this.pixelX }, { property: "y", to: point.y, from: this.pixelY }], this.animationDuration, this.animationEasing).start();
            }
        }
    };
    /**
     * Sets numeric boundaries Tooltip needs to obey (so it does not go outside
     * specific area).
     *
     * @ignore Exclude from docs
     * @param {IRectangle} rectangle Boundary rectangle
     */
    Tooltip.prototype.setBounds = function (rectangle) {
        this._boundingRect = rectangle;
        this.invalidate();
    };
    Object.defineProperty(Tooltip.prototype, "boundingContainer", {
        /**
         * Sets a [[Container]] instance to be used when calculating numeric
         * boundaries for the Tooltip.
         *
         * @ignore Exclude from docs
         * @param {Container}  container  Boundary container
         */
        set: function (container) {
            this._boundingContainer = container;
            // TODO remove closures ?
            container.events.on("sizechanged", this.updateBounds, this);
            container.events.on("positionchanged", this.updateBounds, this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates numeric boundaries for the Tooltip, based on the
     * `boundingCountrainer`.
     */
    Tooltip.prototype.updateBounds = function () {
        var boundingContainer = this._boundingContainer;
        // to global
        var rect = $utils.spriteRectToSvg({
            x: boundingContainer.pixelX,
            y: boundingContainer.pixelY,
            width: boundingContainer.maxWidth,
            height: boundingContainer.maxHeight
        }, boundingContainer);
        this.setBounds(rect);
    };
    Object.defineProperty(Tooltip.prototype, "verticalOrientation", {
        /**
         * If tooltipOrientation is vertical, it can be drawn below or above point. We need to know this when solving overlapping
         * @return "up" | "down"
         */
        get: function () {
            return this._verticalOrientation;
        },
        enumerable: true,
        configurable: true
    });
    return Tooltip;
}(Container));
export { Tooltip };
//# sourceMappingURL=Tooltip.js.map