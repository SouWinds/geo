const Http = new XMLHttpRequest();
var url = './assets/geoJson/zaozhuang.json';
//绘图容器
var svg = null;
var containerWidth = 0;
var containerHeight = 0;
//DOM加载后赋值获取容器高宽
window.onload = (e => {
    containerWidth = document.getElementById('map').clientWidth;
    containerHeight = document.getElementById('map').clientHeight;
    d3.select("#log").style('height', window.innerHeight - containerHeight - 50 + 'px').style('overflow', 'auto')
    startDraw();
})
//获取Geojson文件
function getGeoData() {
    return new Promise(function (resolve, reject) {
        Http.open("get", url);
        Http.send();
        Http.onreadystatechange = function () {
            if (Http.readyState == 4 && Http.status == 200) {
                resolve(JSON.parse(Http.responseText))
            }
        }
    })
}
//从服务器获取数据后开始绘图
function startDraw() {
    getGeoData().then(res => {
        svg = d3.select("#map")
            .append('svg');
        draw(res)
    })
}
//绘图方法
function draw(nodes) {
    //墨卡托坐标系
    let projection = d3.geoMercator()
    //坐标映射
    projection.fitExtent([
        [0, 0],
        [containerWidth, containerHeight]
    ], nodes);
    let path = d3.geoPath(projection);
    //绘图以及添加各种事件
    var polygonNode = svg.selectAll("path")
        .data(nodes.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "grey")
        .attr('opacity', 0.5)
        .attr('stroke', 'yellow')
        .attr('stroke-width', function (d) {
            return 1
        })
        .on("mouseover", function (d, i) {
            polygonNode.style("opacity", function (n) {
                if (d.properties.name == n.properties.name) {
                    return 1;
                } else {
                    return 0.5;
                }
            });
            polygonNode.attr('stroke-width', function (n) {
                if (d.properties.name == n.properties.name)
                    return 10;
            })
            polygonNode.style('cursor', function (n) {
                if (d.properties.name == n.properties.name)
                    return 'pointer';
            })
            d3.select('#tips')[0][0].innerText = d.properties.name;;
        })
        .on('mouseout', function () {
            d3.select('#tips')[0][0].innerText = '未选择'
        })
        .on("click", function (d, i) {
            d3.select('#log')[0][0].innerText += (new Date()).toLocaleString() + ": 你单击了【" + d.properties.name + '】\n';
            d3.select('#log')[0][0].scrollTop = d3.select('#log')[0][0].scrollHeight;
            console.log(d);
            
            
        })
        .on("dblclick", function (d, i) {
            d3.select('#log')[0][0].innerText += (new Date()).toLocaleString() + ": 你刚才双击了【" + d.properties.name + '】\n';

        })
}