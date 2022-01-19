const Map = require("./eachTypesRenderMapping");

exports.customRender = (parentNode, renderNode, uuidList) => {
    if (!renderNode || !parentNode || !uuidList?.[0]) {
        return;
    }

    Map.renderMap.get(renderNode.type)?.(parentNode, renderNode, uuidList);
};
