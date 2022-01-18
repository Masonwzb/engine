const Map = require("./eachTypesRenderMapping");

exports.customRender = (parentNode, renderNode) => {
    if (!renderNode || !parentNode) {
        return;
    }

    Map.renderMap.get(renderNode.type)?.(parentNode, renderNode);
};
