const Interface = require("./interface");
const Util = require("./utils");

// Set the render mapping for each type
const renderMap = new Map();

// common method
function renderLabel(parentNode, name) {
    const oldLabels = parentNode.getElementsByTagName('ui-label');

    // update the value if it already exists
    if (oldLabels?.[0]) {
        oldLabels[0].setAttribute('value', Util.capitalLetter(name));
        return;
    }

    // add node
    const $label = document.createElement('ui-label');
    $label.setAttribute('slot', 'label');
    $label.setAttribute('tabindex', '-1');
    $label.setAttribute('value', Util.capitalLetter(name));
    parentNode.appendChild($label);
}

// String type render method
renderMap.set(Interface.NodeTypes.theString, renderStringType);

function renderStringType(parentNode, renderNode, uuidList) {
    const { name, path, type, value } = renderNode;

    renderLabel(parentNode, name || '');

    // update the value if it already exists
    const oldInputs = parentNode.getElementsByTagName('ui-input');
    if (oldInputs?.[0]) {
        oldInputs[0].setAttribute('value', value || '');
        return;
    }

    // add node
    const $input = document.createElement('ui-input');
    $input.setAttribute('slot', 'content');
    $input.setAttribute('tabindex', '0');
    $input.setAttribute('value', value || '');
    parentNode.appendChild($input);

    let inputTimeout = null;
    function handleInput(e) {
        const value = e.target.value;

        // 防抖处理
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
            Editor.Message.send('scene', 'set-property', {
                uuid: uuidList[0],
                path,
                dump: {
                    type,
                    value,
                },
            });
        }, 500);
    }
    $input.addEventListener('input', handleInput);
}

// Number type render method
renderMap.set(Interface.NodeTypes.theNumber, renderNumberType);

function renderNumberType(parentNode, renderNode, uuidList) {
    const { name, default: theDefault, value, type, path } = renderNode;

    renderLabel(parentNode, name || '');

    const oldInputNums = parentNode.getElementsByTagName('ui-num-input');
    if (oldInputNums?.[0]) {
        oldInputNums[0].setAttribute('value', value || '');
        return;
    }

    const $inputNum = document.createElement('ui-num-input');
    $inputNum.setAttribute('slot', 'content');
    $inputNum.setAttribute('tabindex', '0');
    $inputNum.setAttribute('default', theDefault || '');
    $inputNum.setAttribute('value', value || '');
    parentNode.appendChild($inputNum);

    let inputNumTimeout = null;
    function handleNumInput(e) {
        const value = e.target.value;

        // 防抖处理
        clearTimeout(inputNumTimeout);
        inputNumTimeout = setTimeout(() => {
            Editor.Message.send('scene', 'set-property', {
                uuid: uuidList[0],
                path,
                dump: {
                    type,
                    value,
                },
            });
        }, 500);
    }
    $inputNum.addEventListener('change', handleNumInput);
}

// export map
exports.renderMap = renderMap;
