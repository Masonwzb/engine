const Interface = require("./interface");
const Util = require("./utils");

// Set the render mapping for each type
const renderMap = new Map();

// common method
function renderLabel(parentNode, name) {
    const oldLabels = parentNode.getElementsByTagName('ui-label');

    // update the value if it already exists
    if (oldLabels?.[0]) {
        oldLabels[0].setAttribute('value', Util.capitalLetter(name) + '-C');
        return;
    }

    // add node
    const $label = document.createElement('ui-label');
    $label.setAttribute('slot', 'label');
    $label.setAttribute('tabindex', '-1');
    $label.setAttribute('value', Util.capitalLetter(name) + '-C');
    parentNode.appendChild($label);
}

// String type render method
renderMap.set(Interface.NodeTypes.theString, renderStringType);

function renderStringType(parentNode, renderNode, uuidList) {
    const { name, path, type, value, readonly } = renderNode;

    renderLabel(parentNode, name ?? '');

    // update the value if it already exists
    const oldInputs = parentNode.getElementsByTagName('ui-input');
    if (oldInputs?.[0]) {
        oldInputs[0].setAttribute('value', value ?? '');
        return;
    }

    // add dump value
    parentNode.setAttribute('dump', type);
    // add node
    const $input = document.createElement('ui-input');
    $input.setAttribute('slot', 'content');
    readonly && $input.setAttribute('readonly', '');
    $input.setAttribute('tabindex', '0');
    $input.setAttribute('value', value ?? '');
    parentNode.appendChild($input);

    let inputTimeout = null;
    function handleChange(e) {
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
    $input.addEventListener('change', handleChange);
}

// Number type render method
renderMap.set(Interface.NodeTypes.theNumber, renderNumberType);

function renderNumberType(parentNode, renderNode, uuidList) {
    const { name, default: theDefault, value, type, path, readonly } = renderNode;

    renderLabel(parentNode, name ?? '');

    const oldInputNums = parentNode.getElementsByTagName('ui-num-input');
    if (oldInputNums?.[0]) {
        oldInputNums[0].setAttribute('value', value ?? '');
        return;
    }

    // add dump value
    parentNode.setAttribute('dump', type);
    // add node
    const $inputNum = document.createElement('ui-num-input');
    $inputNum.setAttribute('slot', 'content');
    readonly && $inputNum.setAttribute('readonly', '');
    $inputNum.setAttribute('tabindex', '0');
    $inputNum.setAttribute('default', theDefault ?? '');
    $inputNum.setAttribute('value', value ?? '');
    parentNode.appendChild($inputNum);

    let inputNumTimeout = null;
    function handleNumChange(e) {
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
    $inputNum.addEventListener('change', handleNumChange);
}

// Enum type render method
renderMap.set(Interface.NodeTypes.theEnum, renderEnumType);

function renderEnumType(parentNode, renderNode, uuidList) {
    const { type, name, path, readonly, value, enumList } = renderNode;

    renderLabel(parentNode, name ?? '');

    const oldSelects = parentNode.getElementsByTagName('ui-select');
    if (oldSelects?.[0]) {
        oldSelects[0].setAttribute('value', value ?? '');
        return;
    }

    // add dump value
    parentNode.setAttribute('dump', type);
    // add node
    const $select = document.createElement('ui-select');
    $select.setAttribute('slot', 'content');
    readonly && $select.setAttribute('readonly', '');
    $select.setAttribute('tabindex', '0');
    $select.setAttribute('value', value ?? '');
    for (let myEnum of enumList) {
        if (!myEnum) {
            continue;
        }
        const $option = document.createElement('option');
        $option.setAttribute('value', myEnum.value ?? '');
        $option.textContent = myEnum.name ?? '';
        $select.appendChild($option);
    }
    parentNode.appendChild($select);

    let selectTimeout = null;
    function handleSelectChange(e) {
        const value = e.target.value;

        // 防抖处理
        clearTimeout(selectTimeout);
        selectTimeout = setTimeout(() => {
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
    $select.addEventListener('change', handleSelectChange);
}

// cc.Script type render method
renderMap.set(Interface.NodeTypes.theScript, renderScriptType);

function renderScriptType(parentNode, renderNode) {
    const { displayName, name, type, value, readonly } = renderNode;

    renderLabel(parentNode, displayName ?? name ?? '');

    // update the value if it already exists
    const oldScripts = parentNode.getElementsByTagName('ui-asset');
    if (oldScripts?.[0]) {
        oldScripts[0].setAttribute('value', value.uuid ?? '');
        return;
    }

    // add parent node dump value
    parentNode.setAttribute('dump', type);
    parentNode.setAttribute('readonly', true);
    // add node
    const $asset = document.createElement('ui-asset');
    $asset.setAttribute('slot', 'content');
    readonly && $asset.setAttribute('readonly', '');
    $asset.setAttribute('tabindex', '0');
    $asset.setAttribute('droppable', type);
    $asset.setAttribute('placeholder', type);
    $asset.setAttribute('disabled', '');
    $asset.setAttribute('effective', '');
    $asset.setAttribute('value', value.uuid ?? '');
    parentNode.appendChild($asset);
}

// export map
exports.renderMap = renderMap;
