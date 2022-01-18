const Interface = require("./interface");
const Util = require("./utils");

// Set the render mapping for each type
const renderMap = new Map();

// common method
function renderLabel(parentNode, renderNode) {
    const oldLabels = parentNode.getElementsByTagName('ui-label');
    for (const label of oldLabels) {
        label && parentNode.removeChild(label);
    }

    const $label = document.createElement('ui-label');
    $label.setAttribute('slot', 'label');
    $label.setAttribute('tabindex', '-1');
    $label.setAttribute('value', Util.capitalLetter(renderNode.name || ''));
    parentNode.appendChild($label);
}

// String type render method
renderMap.set(Interface.NodeTypes.theString, renderStringType);
function renderStringType(parentNode, renderNode) {
    renderLabel(parentNode, renderNode);

    const $input = document.createElement('ui-input');

    function handleInput(e) {
        console.log('啦啦啦啦阿啦啦啦 changed ???????', e.target.value);
        Editor.Message.send('scene', 'set-property', {
            uuid: "eeUK0dCetFUpG4HccdtoUi",
            path: '__comps__.1.myString',
            dump: {
                type: "String",
                value: e.target.value,
            },
        });
    }

    // remove previous node
    const oldInputs = parentNode.getElementsByTagName('ui-input');
    for (const input of oldInputs) {
        if (input) {
            input.removeEventListener('input', handleInput);
            parentNode.removeChild(input);
        }
    }

    // add node
    $input.setAttribute('slot', 'content');
    $input.setAttribute('tabindex', '0');
    $input.setAttribute('value', renderNode.value || '');
    parentNode.appendChild($input);

    $input.addEventListener('input', handleInput);
}

// Number type render method
renderMap.set(Interface.NodeTypes.theNumber, renderNumberType);
function renderNumberType(parentNode, renderNode) {
    renderLabel(parentNode, renderNode);

    const oldInputNums = parentNode.getElementsByTagName('ui-num-input');
    for (const inputNum of oldInputNums) {
        inputNum && parentNode.removeChild(inputNum);
    }

    const $inputNum = document.createElement('ui-num-input');
    $inputNum.setAttribute('slot', 'content');
    $inputNum.setAttribute('tabindex', '0');
    $inputNum.setAttribute('default', renderNode.default || '');
    $inputNum.setAttribute('value', renderNode.value || '');
    parentNode.appendChild($inputNum);
}

// export map
exports.renderMap = renderMap;
