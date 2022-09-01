import { createElement, removeElement } from "../utils/dom";

const SWATCHES_CLASSNAME = 'talwin__swatches';
const SWATCHE_CLASSNAME = 'talwin__swatch';

export const Swatches = (parent, talwin) => {

    const self = {};
    let container;


    self.init = (options) => {
        let { swatches } = options;
        let buttons = [];

        container = removeElement(container, true);

        if (swatches.length) {

            container = createElement('', SWATCHES_CLASSNAME, parent);

            swatches.forEach((color, index) => {
                buttons[index] = createElement('button', SWATCHE_CLASSNAME, container, {
                    type: 'button',
                    style: '--tw-color:' + color,
                    'data-index': index + ''
                });
            });
        }

        self.el = buttons;
    }

    return self;
}