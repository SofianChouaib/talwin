const previewArea = document.querySelector('.preview-area');
const menuButton = document.querySelector('.menu-button');
const sidePanel = document.querySelector('.panel');
const closeButton = sidePanel.querySelector('.close-menu');
const pickerSelect = sidePanel.querySelector('#picker');

Alwan.defaults.swatches = ['red', 'green', 'blue'];

const alwanText = new Alwan('#fg');
const alwanBG = new Alwan('#bg', { color: 'red' });

let picker;

initialize('bg');


function initialize(pickerId) {
    picker = pickerId === 'fg' ? alwanText : alwanBG

    const options = picker.config;

    for(const option in options) {
        if (Object.hasOwnProperty.call(options, option)) {
            const value = options[option];

            if (option === 'id' || option === 'classname') {
                continue;
            }

            const elements = document.getElementsByName(option);

            // Checkboxes.
            if (elements.length > 1) {
                elements.forEach(element => {
                    element.checked = value[element.value];
                });
            } else {

                const element = elements[0];

                if (element.tagName === 'TEXTAREA') {
                    element.value = value.join(', ');
                } else if (element.tagName === 'SELECT' || element.type !== 'checkbox') {
                    element.value = value;
                } else {
                    element.checked = value;
                }
            }

        }
    }
}

function updateOptions(e) {
    const options = {};
    const el = e.target;
    let { type, value, checked, name } = el;

    if (pickerSelect === el) {
        return initialize(value);
    }

    value = type === 'checkbox' ? checked : value;

    if (name === 'swatches') {
        value = value.trim();
        options.swatches = value ? value.split(/\s*,\s*/) : [];
    } else if (name === 'inputs') {

        options.inputs = {};

        sidePanel.querySelectorAll("[name='inputs']").forEach((checkbox) => {
            options.inputs[checkbox.value] = checkbox.checked;
        });
    } else if (name === 'target') {
        options.target = value ? document.querySelector(value) : value;
    } else {
        options[name] = value;
    }

    picker.setOptions(options);
}


sidePanel.addEventListener('change', updateOptions);
sidePanel.addEventListener('input', updateOptions);


alwanText.on('color', (color) => {
    previewArea.style.color = color.rgb() + '';
});

alwanBG.on('color', (color) => {
    previewArea.style.backgroundColor = color.rgb() + '';
});


closeButton.addEventListener('click', toggleOptionsPanel);
menuButton.addEventListener('click', toggleOptionsPanel);

function toggleOptionsPanel(e) {
    sidePanel.classList.toggle('open');
    e.stopPropagation();
}

document.addEventListener('click', e => {
    let target = e.target;
    if (! sidePanel.contains(target) || target === closeButton) {
        sidePanel.classList.remove('open');
    }
});