"use strict";

let doc = document;
let sys = {
  getSelectorAll: function (o) {
    return doc.querySelectorAll(o);
  }
}

//排名与月均航班数量 / 数字动画
let chart7Ranking = new CountUp("chart7Ranking", 0, 10, 0, 3.5, {
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
});
let chart7SumCity = new CountUp("chart7RankSum", 0, 100, 0, 3.5, {
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
});
let chart7FlightNum = new CountUp("chart7FlightNum", 0, 1000, 0, 3.5, {
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
});

let charts = sys.getSelectorAll("[chart]");
let c1 = echarts.init(charts[0]);
let c2 = echarts.init(charts[1]);
let c3 = echarts.init(charts[2]);
let c4 = echarts.init(charts[3]);
let c5 = echarts.init(charts[4]);
let c6 = echarts.init(charts[5]);
let c8 = echarts.init(charts[7]);
let c1Option = {}
let c2Option = {}
let c3Option = {}
let c4Option = {}
let c5Option = {}
let c6Option = {}
let c8Option = {}

let tool = {}
//全屏操作
tool.fullScreen = function (id) {
  const btn = sys.getSelectorAll(id)[0];
  let oldClass = btn.className;
  let newClass = "fa fa-compress";

  //监听全屏状态
  function fullscreenChange() {
    //兼容 - 各浏览器全屏事件名
    let eventChangName = ["fullscreenchange", "msfullscreenchange", "webkitfullscreenchange", "mozfullscreenchange"];
    eventChangName.forEach(function (item, index) {
      if (item) {
        doc.addEventListener(item, function () {
          //兼容 - 各浏览器全屏状态检测
          let bool = true;
          let fullscreenState = [doc.fullscreenElement, doc.mozFullScreen, doc.msFullscreenElement, doc.webkitIsFullScreen];
          fullscreenState.forEach(function (Item, Index) { //多重检测 浏览器是否支持、是否全屏，并改变安按钮状态
            if (Item) {
              btn.className = newClass;

              charts[2].style.height = '3.25rem';
              charts[4].style.height = '3.25rem';
              c3.resize();
              c5.resize();

              c1.resize();
              c2.resize();
              c4.resize();
              c6.resize();
              c8.resize();
            } else if (Item == false) {
              btn.className = oldClass;

              charts[2].style.height = '2rem';
              charts[4].style.height = '2rem';
              c3.resize();
              c5.resize();

              c1.resize();
              c2.resize();
              c4.resize();
              c6.resize();
              c8.resize();
            } else if (Item == undefined) {
            }
          });
        }, false);
      }

    });
  };

  function fun_full() {
    if (btn.className == oldClass) {
      //进入全屏
      const docElm = doc.documentElement;
      if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
    } else { //退出全屏
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
      }
    };
    fullscreenChange(); //每次点击事件都监听全屏状态,作出相应修改
  };

  btn.addEventListener("click", fun_full, false); //btn点击事件触发全屏/退出全屏
  //浏览器出于安全考虑  js无法监听系统内部全屏状态,所以拦截系统事件 重写f11
  //屏蔽f11键 并且调用自己实现的全屏函数
  doc.onkeydown = function (e) {
    /*let eVent = e || event;
    if (eVent.keyCode == 122) {
      eVent.preventDefault();
      fun_full();
    } else if(btn.className == oldClass && eVent.keyCode != 27 && eVent.keyCode != 122) {
      alert(12);
      fun_full();
    }*/
  }
  doc.addEventListener('click', function (e) {
    if (btn.className == oldClass) {
    }
  });
};

window.onload = function () {
  tool.fullScreen("[tool=FullScreen]");

  //c1c3
  //echarts 点击事件改变Y坐标DATA ？？？？
  (function(){
    $.ajax({
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      url: '/server/airportline',
      //data: JSON.stringify(list),
      success: function (data) {
        c1Option = {
          title: {
            text: "进出港航班次",
            left: 'center',
            textStyle: {
              color: 'rgba(0,245,255,0.7)',
              fontSize: 14,
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: "shadow"
            },
          },
          legend: {
            name: '出入港',
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data: ['出港', '入港'],
            textStyle: {
              color: 'rgba(0,245,255,0.8)'
            },
            selectedMode: 'single',
            inactiveColor: 'rgba(100,100,100,1)',
          },
          grid: {
            left: 12,
            right: 0,
            top: 20,
            bottom: 0,
            width: '95%',
            containLabel: true
          },
          xAxis: {
            name: '/架次',
            nameLocation: 'end',
            type: 'value',
            label: {
              show: true
            },
            scale: false,
            position: 'top',
            boundaryGap: false,
            splitLine: { //刻度轴线
              show: true, //刻度不从最小值开始
              lineStyle: {
                color: 'rgba(0,245,255,0.5)'
              }
            },
            axisTick: {
              show: true,
              alignWithLabel: false, //强制刻度对齐
              inside: true, //刻度朝内
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(0,245,255,1)' //轴文字色取自这
              }
            },
            axisLabel: {
              rotate: 0,
              margin: 0,
              textStyle: {
                color: 'rgba(0,245,255,1)'
              }
            }
          },
          yAxis: {
            type: 'category',
            nameLocation: 'end',
            name: '城市名',
            nameGap: 16,
            axisLine: {
              show: false,
              lineStyle: {
                color: 'rgba(0,245,255,1)'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: 'rgba(0,245,255,1)'
              }
            },
            axisLabel: {
              interval: 'auto', //0显示全部,1 隔一个显示一个
              formatter: function (value) {
                if (value.length > 8) { //防止y轴文字过长 整个坐标系离开
                  return value.substring(0, 8) + "..."
                } else {
                  return value
                }
              },
              axisLabel: {
                interval: 'auto'
              },
              textStyle: {
                color: '#fff'
              }
            },
            data: data.cn
          },
          series: [
            {
              name: "出港",
              type: 'bar',
              stack: "sum",
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(5, 1, 5, 0, [{
                    offset: 1,
                    color: 'rgba(0,245,255,0.5)'
                  }, {
                    offset: 0,
                    color: '#00fcae'
                  }]),
                },
              },
              data: data.cv
            },
            {
              name: "入港",
              type: 'bar',
              stack: "sum",
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(5, 1, 5, 0, [{
                    offset: 0,
                    color: 'rgba(255,140,0,0.8)'
                  }, {
                    offset: 1,
                    color: '#EE0000'
                  }]),
                },
              },
              data: data.jv
            }
          ]
        };

        let c3All = []
        for (var i = 0; i < data.cn.length && i < 10; i++) {
          c3All.push({"name": data.cn[i], "value": data.cv[i]})
        }
        c3Option = {
          color: [
            '#2ae0c8',
            'rgba(0,245,255,0.5)',
            'rgba(0,255,150,1)',
            '#fbb8ac',
            '#acf6ef',
            '#fad8be',
            '#cbf5fb',
            '#bdf3d4',
            '#e3c887',
            '#e6e2c3',
          ],
          textStyle: {
            color: 'rgba(0,245,255,1)',
            fontWeight: 'lighter'
          },
          title: {
            text: '来往城市热榜',
            left: 'center',
            top: 0,
            textStyle: {
              color: 'rgba(0,245,255,0.8)',
              fontSize: 14
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)<br/>"
          },
          legend: {
            name: '国家图例',
            type: 'scroll',
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            formatter: function (name) {
              return echarts.format.truncateText(name, 60, '10px Microsoft Yahei'); //6个字符(3汉字)省略
            },
            tooltip: {
              show: true
            },
            textStyle: {
              color: 'rgba(0,245,255,1)',
              fontSize: 10
            },
            selectedMode: 'multiple',
            inactiveColor: 'rgba(100,100,100,1)',
          },
          series: [{
            id: "pie",
            name: '进出机场TOP榜',
            type: 'pie',
            radius: [0, "80%"],
            center: ['42%', '50%'],
            hoverAnimation: true,
            data: c3All,
            selectedMode: true, //允许选中 分离
            minAngle: 5, //最小角度
            cursor: "pointer", //hover鼠标样式
            roseType: 'radius',
            label: {
              normal: {
                color: 'rgba(0, 245, 255, 0.6)'
              },
              emphasis: {
                color: 'rgba(0, 255, 255, 1)',
                fontWeight: "bold"
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0,
                length: 6,
                length2: 6
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 1,
                shadowBlur: 10,
                borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                  offset: 0,
                  color: 'rgba(0,245,255,1)'
                }, {
                  offset: 1,
                  color: '#70ffac'
                }]),
                shadowColor: 'rgba(142, 152, 241, 0.6)'
              },
              emphasis: {
                color: 'rgba(0,255,255,1)',
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 1000;
            }
          }]
        };
        c1.setOption(c1Option)
        c3.setOption(c3Option)
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      },
      complete: function(XMLHttpRequest, status) { }
    });
  })();

  //c2
  (function(){
    $.ajax({
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      url: '/server/airportflight',
      //data: JSON.stringify(list),
      success: function (data) {
        c2Option = {
          title: {
            x: 'center',
            text: '进出港机场信息',
            textStyle: {
              fontSize: 14,
              color: 'rgba(0,245,255,0.7)'
            }
          },
          color: [
            'red', 'green', 'white', 'black', 'blue', 'yellow', '#d622ec', '#ed45df', '#fdffdb', '#49c1bf'
          ],
          legend: {
            type: 'scroll',
            data: data.n,
            left: 'right',
            orient: 'vertical',
            selectedMode: 'multiple',
            formatter: function (name) {
              return echarts.format.truncateText(name, 60, '10px Microsoft Yahei'); //6个字符(3汉字)省略
            },
            textStyle: {
              color: 'rgba(0,245,255,1)',
              fontSize: 10,
            },
            inactiveColor: 'rgba(100,100,100,1)',
            tooltip: {
              show: true
            }
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: function (params, ticket, callback) {
              if (params.data[4] == 1)
                return "进港"
              else
                return "出港"
            }
          },
          realtime: false,
          parallelAxis: [ // 这是一个个『坐标轴』的定义
            {
              dim: 0,
              name: '经营规模'
            }, // 每个『坐标轴』有个 'dim' 属性，表示坐标轴的维度号。
            {
              dim: 1,
              name: '延误数'
            },
            {
              dim: 2,
              name: '准点率(%)'
            },
            {
              dim: 3,
              name: '延误时长(分)',
            }
          ],
          parallel: { //坐标系
            left: 30,
            bottom: '9%',
            top: "10%",
            right: 85,
            width: 'auto',
            parallelAxisDefault: { // 『坐标轴』的公有属性可以配置在这里避免重复书写
              type: 'value',
              nameLocation: 'start',
              nameGap: 8,
              triggerEvent: true,
              nameTextStyle: {
                color: 'rgba(0,245,255,0.8)'
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(0,245,255,0.8)',
                  width: 2
                }
              }
            },

          },
          series: [ // 这里三个系列共用一个平行坐标系
            {
              smooth: true,
              name: data.n,
              type: 'parallel', // 这个系列类型是 'parallel'
              lineStyle: {
                color: 'rgba(0,245,255,0.7)'
              },
              data: data.v
            }
          ]
        };
        c2.setOption(c2Option);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      },
      complete: function(XMLHttpRequest, status) { }
    });
  })();

  //c4
  (function() {
    $.ajax({
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      url: '/server/airline',
      //data: JSON.stringify(list),
      success: function (data) {

        var planePath = "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];

            var fromCoord = getChinaCityCoord([dataItem[0].name]);
            var toCoord = getChinaCityCoord([dataItem[1].name]);
            if (fromCoord && toCoord) {
              res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord],
                value: dataItem[1].value
              });
            }
          }
          return res;
        };
        var color = ["#fff", "#fff", "#fff"];
        var series = [];
        data.forEach(function (item, i) {
          series.push(
            {
              name: item[0],
              type: "lines",
              zlevel: 1,
              effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: "red", //arrow箭头的颜色
                symbolSize: 3
              },
              lineStyle: {
                normal: {
                  color: color[i],
                  width: 0,
                  curveness: 0.2
                }
              },
              data: convertData(item[1])
            },
            {
              name: item[0],
              type: "lines",
              zlevel: 2,
              symbol: ["none", "arrow"],
              symbolSize: 10,
              effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbol: planePath,
                symbolSize: 15
              },
              lineStyle: {
                normal: {
                  color: color[i],
                  width: 1,
                  opacity: 0.6,
                  curveness: 0.2
                }
              },
              data: convertData(item[1])
            },
            {
              name: item[0],
              type: "effectScatter",
              coordinateSystem: "geo",
              zlevel: 2,
              rippleEffect: {
                brushType: "stroke"
              },
              label: {
                normal: {
                  show: true,
                  position: "right",
                  formatter: "{b}"
                }
              },
              symbolSize: function (val) {
                return val[2] / 8;
              },
              itemStyle: {
                normal: {
                  color: color[i]
                },
                emphasis: {
                  areaColor: "#2B91B7"
                }
              },
              data: item[1].map(function (dataItem) {
                return {
                  name: dataItem[1].name,
                  value: getChinaCityCoord([dataItem[1].name]).concat(/*[dataItem[1].value]*/70)
                };
              })
            }
          );
        });
        c4Option = {
          title: {
            text: '进出港航线',
            left: 'center',
            textStyle: {
              color: '#fff'
            }
          },

          tooltip: {
            trigger: "item",
            formatter: function (params, ticket, callback) {
              if (params.seriesType == "effectScatter") {
                return "线路：" + params.data.name + "" + params.data.value[2];
              } else if (params.seriesType == "lines") {
                return (
                  params.data.fromName +
                  ">" +
                  params.data.toName +
                  "<br />" +
                  params.data.value
                );
              } else {
                return params.name;
              }
            }
          },

          geo: {
            map: "china",
            label: {
              emphasis: {
                show: true,
                color: "#fff"
              }
            },
            roam: false,
            zoom: 1.2,
            itemStyle: {
              normal: {
                borderWidth: 0.2,
                areaColor: 'rgb(12,97,156)',
                borderColor: '#404a59',
              },
              emphasis: {
                borderColor: 'rgba(0,0,0,0.2)',
                areaColor: 'rgba(0,0,0,0.2)'
              }
            },
            nameMap: {
              'China': '中国'
            }
          },
          series: series
        }
        c4.setOption(c4Option)
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      },
      complete: function(XMLHttpRequest, status) { }
    });
  })();

  //c5
  (function(){
    $.ajax({
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      url: '/server/flight',
      //data: JSON.stringify(list),
      success: function (data) {
        var itemStyle = {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 1, 0, 0, [{
                offset: 0,
                color: '#2af598'
              }, {
                offset: 1,
                color: '#009efd'
              }]
            ),
            barBorderRadius: 8
          },
          emphasis: {
            color: new echarts.graphic.LinearGradient(
              0, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(0,245,255,1)'
              }, {
                offset: 1,
                color: 'red'
              }]
            ),
            barBorderRadius: 4
          }
        };
        let timeData = [];
        let c5All = data;
        for (var n = 0; n < c5All.dataTime.length; n++) {
          timeData.push({
            title: {
              left: 'center',
              text: c5All.dataTime[n] + "航班概览",
              subtext: c5All.dataTime[0] + "~" + c5All.dataTime[3] + "航班概览",
              textStyle: {
                color: 'rgba(0,245,255,1)',
                fontSize: 14
              }
            },
            tooltip: {
              trigger: 'axis'
            },
            calculable: true,
            legend: {
              show: true,
              x: 'right',
              y: 'top',
              orient: 'vertical',
              selectedMode: 'multiple',
              textStyle: {
                color: 'rgba(0,245,255,1)',
              },
              inactiveColor: 'rgba(100,100,100,1)',
              data: ['正常', '延误', '取消'],
            },
            grid: {
              bottom: '60px',
              left: '5%',
              width: "60%"
            },
            xAxis: [{
              type: 'category',
              textStyle: {
                color: 'rgba(0,245,255,1)'
              },
              axisLabel: {
                color: 'rgba(0,245,255,1)',
                interval: 0,
                rotate: 0
              },
              data: c5All.flightsType
            }],
            yAxis: [{
              type: 'value',
              name: '航班数(架次)',
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(0,245,255,1)' //轴文字色取自这
                }
              },
              textStyle: {
                color: 'rgba(0,245,255,0.7)'
              },
              axisLabel: {
                //color:'rgba(0,245,255,1)',
                interval: 0,
                rotate: 45,
                textStyle: {
                  color: 'rgba(0,245,255,0.7)'
                }
              },
            }],
            series: [{
              name: "正常",
              type: 'bar',
            }, {
              name: "延误",
              type: 'bar',
            }, {
              name: "取消",
              type: 'bar',
            },
            {
              name: '航班',
              yAxisIndex: 0,
              type: 'bar',
              itemStyle: itemStyle,
              barWidth: 40,
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(0,245,255,0.5)'
                  },
                  show: true,
                  position: 'top',
                  formatter: '{c}'
                }
              },
              data: c5All.data[n]
            },
            {
              name: '航班', type: 'pie',
              radius: ['65%', "75%"],
              center: ['78%', '45%'],
              labelLine: {
                normal: {
                  length: 3
                }
              },
              bottom: 20,
              hoverAnimation: true,
              data: [{ "name": "正常数", "value": c5All.data[n][1] }, { "name": "取消数", "value": c5All.data[n][2] }, { "name": "延误数", "value": c5All.data[n][3] }]
            },
            ]
          });
        };
        c5Option = {
          baseOption: {
            color: ['green', 'yellow', 'red'],
            timeline: {
              currentIndex: 0,
              left: "5",
              bottom: 0,
              width: "95%",
              axisType: 'category',
              show: true,
              checkpointStyle: {
                symbol: 'diamond',
                symbolSize: 15,
                color: 'rgba(0,245,255,1)',
                borderWidth: 2,
                borderColor: 'rgba(255,0,0,1)',
                animationDuration: 300
              },
              controlStyle: {
                normal: {
                  color: 'rgba(0,245,255,1)',
                  borderColor: "rgba(0,245,255,1)"
                },
              },
              label: {
                normal: {
                  color: 'rgba(0,245,255,0.8)',
                },
                emphasis: {

                }
              },
              lineStyle: {
                color: 'rgba(0,245,255,1)',
              },
              autoPlay: true,
              playInterval: 2000,
              data: c5All.dataTime
            },
          },
          options: timeData
        };
        c5.setOption(c5Option)
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      },
      complete: function(XMLHttpRequest, status) { }
    });
  })();

  //c6
  (function(){
    $.ajax({
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      url: '/server/city',
      //data: JSON.stringify(list),
      success: function (data) {
        c6Option = {
          title: {
            text: '通航城市云图',
            x: 'center',
            textStyle: {
              fontSize: 14,
              color: "rgba(0,245,255,0.7)"
            }
          },
          tooltip: {
            show: true
          },
          series: [{
            name: '城市词云图',
            type: 'wordCloud',
            //sizeRange: [10, 40], //大小范围
            rotationRange: [-90, 90], //倾斜范围
            rotationStep: 5, //倾斜步进度
            shape: 'polygon',
            top: '5%',
            bottom: '2%',
            width: '100%',
            height: '100%',
            textPadding: 0,
            drawOutOfBound: false, //词云大于画布
            gridSize: 2,
            textStyle: {
              normal: {
                color: function () {
                  return 'rgb(' + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                  ].join(',') + ')';
                }
              }
            },
            data: data
          }]
        };
        c6.setOption(c6Option)
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      },
      complete: function(XMLHttpRequest, status) { }
    });
  })();

  //c7
  (function(){
    $.ajax({
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      url: '/server/airport',
      //data: JSON.stringify(list),
      success: function (data) {
        chart7FlightNum.update(data.jc);
        chart7Ranking.update(data.fr);
        chart7SumCity.update(data.tt);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      },
      complete: function(XMLHttpRequest, status) { }
    });
  })();

  //c8
  (function(){
    $.ajax({
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      url: '/server/weather',
      //data: JSON.stringify(list),
      success: function (data) {
        let c8All = data
        c8Option = {
          grid: {
            left: -5,
            right: 50,
            top: 50,
            bottom: 5,
            width: '91%',
            containLabel: true
          },
          title: {
            textStyle: {
              color: 'rgba(0,245,255,0.6)',
              fontSize: 14
            },
            x: 'left',
            text: '天气 ' + c8All.weather + ' ' + c8All.curTemp + '°C 注意天气变化',
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              let txt = '<p style=font-size:0.16rem>时间：' + params[0].name + '</p>'
              for (let all = 0; all < params.length; all++) {
                if (params[all].seriesName == '最高气温') {
                  txt += `<div>${params[all].seriesName}：<span style='color:#FFA54F'>    ${params[all].data}℃</span><div>`
                } else if (params[all].seriesName == '最低气温') {
                  txt += `<div>${params[all].seriesName}：<span style='color:#abf4fc'>    ${params[all].data}℃</span><div>`
                }

              }
            },
          },
          legend: {
            x: 'right',
            selectedMode: 'multiple',
            textStyle: {
              color: 'rgba(0,245,255,1)',
              fontSize: 12,
            },
            inactiveColor: 'rgba(100,100,100,1)',
            tooltip: {
              show: true
            },
            data: ['最高气温', '最低气温']
          },
          toolbox: {
            show: false,
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
              },
              magicType: {
                type: ['line', 'bar']
              },
            },
          },
          xAxis: {
            interval: 'auto',
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              rotate: 0,
              margin: 6,
              textStyle: {
                color: 'rgba(0,245,255,1)'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(0,245,255,1)' //轴文字色取自这
              }
            },
            splitLine: {
              show: false,
            },
            data: c8All.keyTimes
          },
          yAxis: {
            type: 'value',
            axisPointer: {
              label: {
                show: true
              }
            },
            axisLabel: {
              formatter: '{value} °C',
              textStyle: {
                color: 'rgba(0,245,255,1)'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'rgba(0,245,255,1)' //轴文字色取自这
              }
            },
            splitLine: { //刻度轴线
              show: true,
              lineStyle: {
                color: 'rgba(0,245,255,0.2)'
              }
            },
          },
          series: [{
            name: '最高气温',
            type: 'line',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(5, 1, 5, 0, [{
                  offset: 1,
                  color: '#FF3030'
                }, {
                  offset: 0,
                  color: '#FFA54F'
                }]),
              }
            },
            lineStyle: {
              normal: {
                width: 3
              }
            },
            data: c8All.temps.hight,
            markPoint: {
              symbol: 'pin',
              symbolSize: 35,
              data: [{
                type: 'max',
                name: '最大值'
              }]
            },
            markLine: {
              data: [{
                type: 'average',
                name: '平均值',
                label: {
                  normal: {
                    color: '#FFA54F',
                    position: 'end',
                    formatter: '平均值'
                  }
                },
              }]
            }
          },
          {
            name: '最低气温',
            type: 'line',
            data: c8All.temps.low,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(5, 1, 5, 0, [{
                  offset: 1,
                  color: 'rgba(0,245,255,1)'
                }, {
                  offset: 0,
                  color: '#abf4fc'
                }])
              }
            },
            lineStyle: {
              normal: {
                width: 3
              }
            },
            markPoint: {
              symbol: 'pin',
              symbolSize: 35,
              data: [{
                type: 'min',
                name: '最小值'
              }]
            },
            markLine: {
              data: [{
                type: 'average',
                name: '平均值',
                label: {
                  normal: {
                    color: '#abf4fc',
                    position: 'end',
                    formatter: '平均值'
                  }
                },
              }]
            }
          }
          ]
        };
        c8.setOption(c8Option);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      },
      complete: function(XMLHttpRequest, status) { }
    });
  })();
}
