import { ROOT } from "../constants/globals";
import { getBounds, translate } from "../utils/dom";
import { abs, isNumeric, round } from "../utils/number";
import { isString } from "../utils/string";
import { isset } from "../utils/util";

// getBounds function array.
const LEFT = 0; // Also the x coordinate.
const TOP = 1; // Also the y coordinate.
const RIGHT = 4;
const BOTTOM = 5;

const START = 0;
const CENTER = 1;
const END = 2;

/**
 * Sides to fallback to for each side.
 */
const fallbackSides = {
    top: [TOP, BOTTOM, RIGHT, LEFT],
    bottom: [BOTTOM, TOP, RIGHT, LEFT],
    right: [RIGHT, LEFT, TOP, BOTTOM],
    left: [LEFT, RIGHT, TOP, BOTTOM],
};

/**
 * Alignments to fallback to for each alignment.
 */
const fallbackAlignments = {
    start: [START, CENTER, END],
    center: [CENTER, START, END],
    end: [END, CENTER, START],
};

/**
 * Creates a Popover instance.
 *
 * @param {Element} target - Popover target.
 * @param {HTMLElement} container - Popover container.
 * @param {object} param2 - Popover options.
 * @param {Function} autoUpdate - Auto update callback.
 * @param {Function} accessibility - Popover accessibility callback.
 */
export const createPopover = (target, container, { _margin, _position }) => {
    if (isString(_margin)) {
        _margin = float(_margin);
    }
    const margin = isNumeric(_margin) ? _margin : 0;
    const [side, alignment] = isString(_position) ? _position.split('') : [];
    const sidesFlipOrder = fallbackSides[side] || fallbackSides.bottom;
    const alignmentsFlipOrder = fallbackAlignments[alignment] || fallbackAlignments.center;
    // const overflowAncestors = getOverflowAncestors(target);

    /**
     * Updates the container's position.
     */
    const _update = () => {
        const visualViewport = getBounds(ROOT);
        const targetBounds = getBounds(target);
        const containerBounds = getBounds(container);
        const coordinates = [];

        /**
         * Check sides.
         */
        sidesFlipOrder.some((side) => {
            // Get axis of the side.
            // x (0) if side is LEFT (1) or RIGHT (4).
            // y (1) if side is TOP (0) or BOTTOM (5).
            let axis = side % 2;
            // Viewport side.
            const domSide = visualViewport[side];
            // Target element coordinate.
            const targetSide = targetBounds[side];
            // Space required for the container.
            // Adding 2 to the axis index gives the dimension based on the axis,
            // x => width and y => height.
            const requiredSpace = margin + containerBounds[axis + 2];

            if (requiredSpace <= abs(domSide - targetSide)) {
                // Calculate coordinate to set this side.
                // side <= 1 means side is either TOP or LEFT.
                // otherwise it's BOTTOM or RIGHT.
                coordinates[axis] = targetSide + (side <= 1 ? -requiredSpace : margin);
                // Reverse the axis for the alignments.
                // x (0) => y (1)
                // y (1) => x (0)
                axis = (axis + 1) % 2;
                const containerDimension = containerBounds[axis + 2];
                // Lower bound is either the TOP | LEFT coordinate and,
                // the Upper bound is either the BOTTOM | RIGHT coordinates of the target element.
                // depends on the axis.
                const targetLowerBound = targetBounds[axis];
                const targetUpperBound = targetBounds[axis + 4];
                // Distance between the document upper bound (BOTTOM or RIGHT) and,
                // the target element lower bound (TOP or LEFT).
                const upperBoundDistance = visualViewport[axis + 4] - targetLowerBound;
                // Offset between the container and the reference element.
                const offset = (containerDimension + targetBounds[axis + 2]) / 2;

                /**
                 * Check alignments, only if the container is attached to one side.
                 */
                alignmentsFlipOrder.some((alignment) => {
                    // Check space, if it's available then align the container.
                    if (alignment === START && containerDimension <= upperBoundDistance) {
                        coordinates[axis] = targetLowerBound;
                        return true;
                    }
                    if (
                        alignment === CENTER &&
                        offset <= targetUpperBound &&
                        offset <= upperBoundDistance
                    ) {
                        coordinates[axis] = targetUpperBound - offset;
                        return true;
                    }
                    if (alignment === END && containerDimension <= targetUpperBound) {
                        coordinates[axis] = targetUpperBound - containerDimension;
                        return true;
                    }
                    return false;
                });
            }
        });

        // If there is no space to position the popover in all sides,
        // then center the popover in the screen.
        // If the popover is attached to one side but there is no space,
        // for the alignment then center it horizontally/vertically depends on the side.
        translate(
            container,
            ...(coordinates.map((value, axis) =>
                round(
                    isset(value) ?
                    value
                    : (visualViewport[axis + 4] - containerBounds[axis + 2]) / 2
                )
            ))
        );
    };

    return {
        _update
    }
}