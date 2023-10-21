import { RGB_FORMAT } from '../../constants/globals';
import type { HSLA, RGBA, colorDetails, colorFormat } from '../../types';

/**
 * Converts color objects HSL, RGB to string.
 *
 * @param color - Color object.
 * @param format - Color format.
 * @returns - RGB or HSL color string.
 */
export const stringify = (color: colorDetails | HSLA | RGBA, format: colorFormat = RGB_FORMAT) => {
    let a = color.a;
    let opacity = '';
    let str = format;

    if (a < 1) {
        opacity += ', ' + a;
        str += 'a';
    }

    if (format === RGB_FORMAT) {
        return str + `(${(<RGBA>color).r}, ${(<RGBA>color).g}, ${(<RGBA>color).b + opacity})`;
    }

    return str + `(${(<HSLA>color).h}, ${(<HSLA>color).s}%, ${(<HSLA>color).l}%${opacity})`;
};
