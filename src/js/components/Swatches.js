import { CLICK } from "../constants";
import { bindEvent, unbindEvent } from "../core/events/EventBinder";
import { parseColor } from "../lib/parser";
import { createElement, removeElement } from "../utils/dom";

const SWATCHES_CLASSNAME = 'talwin__swatches';
const SWATCHE_CLASSNAME = 'talwin__swatch';

export const Swatches = (parent, talwin) => {

    const self = {};

    const { _clr: { value, updateByString }, _e: { emit } } = talwin;


    let container;
    let listeners = [];


    self.init = (options) => {
        let { swatches } = options;
        let buttons = [];

        container = removeElement(container, true);
        listeners = unbindEvent(listeners, container);

        if (swatches.length) {

            container = createElement('', SWATCHES_CLASSNAME, parent);

            swatches.forEach((color, index) => {
                buttons[index] = createElement('button', SWATCHE_CLASSNAME, container, {
                    type: 'button',
                    style: '--tw-color:' + parseColor(color, true),
                    'data-index': index + ''
                });
            });

            bindEvent(listeners, container, CLICK, setColorFromSwatch);
        }

        self.el = buttons;
    }

    /**
     * Sets color from a swatch button.
     *
     * @param {Event} e - Click.
     */
    const setColorFromSwatch = e => {
        let target = e.target;

        if (target !== container && updateByString(talwin.config.swatches[target.dataset.index])) {
            emit('color', value, target);
            emit('change', value, target);
        }
    }

    return self;
}