"use strict";

let doc = document;
let sys = {
  getSelectorAll: function (o) {
    return doc.querySelectorAll(o);
  }
}

//相关进出港信息
let c1Option = {
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
    data: ["北京", "成都", "纽约", "上海", "洛杉矶", "伦敦", "柏林", "曼谷", "东京"]
  },
  series: [{
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
      emphasis: {
        //color: 'rgba(100,245,255,1)'
      }
    },
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
      emphasis: {
        //color: 'rgba(100,245,255,1)'
      }
    },
    label: {
      //							normal: {
      //								show: true,
      //								position: 'right',
      //								formatter: function(p){
      //									//console.log(p)
      //									//return sumData()[p.dataIndex]
      //								},
      //								textStyle: {
      //									color: 'rgba(255,245,255,1)'
      //								}
      //							}
    },
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
  ]
};

//相关航司信息
let c2Option = {
  title: {
    x: 'center',
    text: '进出港航司信息',
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
    data: ['上海', '广州', '北京123456789', '纽约'],
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
    formatter: "加油"
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
      //							type: 'category', // 坐标轴也可以支持类别型数据
      //							data: ['分段','二','优秀'],
      //color:"rgba(0,245,255,0.8)"
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
      name: '北京123456789',
      type: 'parallel', // 这个系列类型是 'parallel'
      data: [
        [1, 0.05, 9, 1],
        [2, 0.69, 11, 1],
      ]
    },
    {
      name: '上海',
      type: 'parallel',
      lineStyle: {
        color: 'black'
      },
      data: [
        [3, 0.9, 7, 0.1],
        [4, 0.78, 7, 0.5],
      ]
    },
    {
      name: '广州',
      type: 'parallel',
      lineStyle: {},
      data: [
        [4, 0.9, 7, 0.6],
        [5, 0.1, 24, 0.9],
      ]
    },
    {
      name: '纽约',
      type: 'parallel',
      lineStyle: {},
      data: [
        [4, 0, 158, 0.6],
        [5, 0.9, 214, 0.9],
      ]
    }
  ]
};

//相关进出港TOP榜单
let c3Option = {
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
    //data: ['aaaaaaaaaa', '北京首都机场'],
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
    name: '来往国家',
    type: 'pie',
    radius: [0, "80%"],
    center: ['42%', '50%'],
    hoverAnimation: true,
    data: [{ "name": "北京首都机场", value: "1111" }, { "name": "北京大兴机场", value: "111" }, { "name": "北京大兴机场2", value: "111" }, { "name": "北京大兴机场3", value: "111" }, { "name": "北京大兴机场4", value: "111" }, { "name": "北京大兴机场5", value: "111" }, { "name": "北京大兴机场6", value: "111" }],
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
///进出港航线
let c4All = [
  ["重庆",
    [
      [{ name: "重庆" }, { name: "北京", value: 100 }],
      [{ name: "重庆" }, { name: "潍坊", value: 90 }],
      [{ name: "重庆" }, { name: "广州", value: 80 }],
      [{ name: "重庆" }, { name: "哈尔滨", value: 70 }],
      [{ name: "重庆" }, { name: "拉萨", value: 60 }],
      [{ name: "重庆" }, { name: "乌鲁木齐", value: 1 }]
    ]
  ],
  [
    "北京", [[{ name: "北京" }, { name: "重庆", value: 100 }]]
  ],
  [
    "潍坊", [[{ name: "潍坊" }, { name: "重庆", value: 100 }]]
  ],
  [
    "广州", [[{ name: "广州" }, { name: "重庆", value: 100 }]]
  ],
  [
    "哈尔滨", [[{ name: "哈尔滨" }, { name: "重庆", value: 100 }]]
  ],
  [
    "拉萨", [[{ name: "拉萨" }, { name: "重庆", value: 100 }]]
  ],
  [
    "乌鲁木齐", [[{ name: "乌鲁木齐" }, { name: "重庆", value: 100 }]]
  ]
];
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
c4All.forEach(function (item, i) {
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
let c4Option = {
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//航班概览
let c5All = {
  "data": [
    [500, 450, 20, 30],
    [400, 350, 30, 20],
    [341, 313, 82, 41],
    [441, 413, 2, 4]
  ],
  "flightsType": ["航班总数", "正常数", "延误数", "取消数"],
  "dataTime": ["2月3日", "2月4日", "2月5日", "2月6日"],
}
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
//timeLine  baseOption为基础组件,后面的options的data按顺序对应
for (var n = 0; n < 4; n++) {
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
let c5Option = {
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//城市云图
let c6Option = {
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
    data: [{ "name": "重庆", "value": 1446 }, { "name": "上海", "value": 14010 }]
  }]
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//天气
let c8All = {
  "weather": "晴",
  "curTemp": "9",
  "keyTimes": ["今天", "3月21", "3月22"],
  "temps": { "hight": [9, 8, 7], "low": [4, 3, 2] }
}
let c8Option = {
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
      let index = params[0].dataIndex;//根据索引 自定义数据 进入tooltip

      txt += `<p style='font-size:0.16rem'>白天：</p>
        <div>天气概述：${jsonData[keys[index]].day[0]}</div>
        <div>风向： ${jsonData[keys[index]].day[2]}，风力级别：${jsonData[keys[index]].day[3]}</div>
        <p style='font-size:0.16rem'>夜间：</p>
        <div>天气概述：${jsonData[keys[index]].night[0]}</div>
        <div>风向： ${jsonData[keys[index]].night[2]}，风力级别：${jsonData[keys[index]].night[3]}</div>`
      return txt;
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
}


let charts = sys.getSelectorAll("[chart]");
let c1 = echarts.init(charts[0]);
let c2 = echarts.init(charts[1]);
let c3 = echarts.init(charts[2]);
let c4 = echarts.init(charts[3]);
let c5 = echarts.init(charts[4]);
let c6 = echarts.init(charts[5]);
let c8 = echarts.init(charts[7]);
c1.setOption(c1Option);
c2.setOption(c2Option);
c3.setOption(c3Option);
c4.setOption(c4Option);
c5.setOption(c5Option);
c6.setOption(c6Option);
c8.setOption(c8Option);

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
              //console.log("您的浏览器不支持全屏状态检测：");
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
      chart7FlightNum.update(1000);
      //10/100
      chart7Ranking.update(10);
      chart7SumCity.update(100);
    }
  });
};

window.onload = function () {
  tool.fullScreen("[tool=FullScreen]");

  function funWeather(){
    $.ajax({
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      url: '/server/weather',
      //data: JSON.stringify(list),
      success: function (data) {
          console.log(data)
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(XMLHttpRequest.status);
          console.log(XMLHttpRequest.readyState);
      },
      complete: function(XMLHttpRequest, status) { }
    });
  }
  funWeather();
}
