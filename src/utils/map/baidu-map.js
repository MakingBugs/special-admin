export default {
    init: function (){
      //console.log("初始化百度地图脚本...");
      const AK = "1h2SG7dVHEku02WcNfxNXLegWxtKVKOG";
      const BMap_URL = "https://api.map.baidu.com/api?v=2.0&ak="+ AK +"&s=1&callback=onBMapCallback";
      return new Promise((resolve, reject) => {
        // 如果已加载直接返回
        if(typeof BMap !== "undefined") {
          resolve(BMap);
          return true;
        }
        // 百度地图异步加载回调处理
        window.onBMapCallback = function () {
          // console.log("百度地图脚本初始化成功...");
          resolve(BMap);
        };
        // 插入script脚本
        let scriptNode = document.createElement("script");
        scriptNode.setAttribute("type", "text/javascript");
        scriptNode.setAttribute("src", BMap_URL);
        document.body.appendChild(scriptNode);
      });
    }
}  