/* */

var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

option = {
  title: {
    text: 'Every Day Collection'
  },
  tooltip: {},
  legend: {
    data: ['payment']
  },
  dataset: {
    source: [
      ['income', 'amount', 'day'],
      [10.0, 11000, 'Mon '],
      [90.0, 71900, 'Tue'],
      [100.0, 22014, 'Wed'],
      [80.0, 12075, 'Thru'],
      [53.2, 41023, 'Fri'],
      [82.2, 78251, 'Sat'],
      [55.0, 58212, 'Sun']
    ]
  },
  grid: { containLabel: true },
  xAxis: { type: 'category' },
  yAxis: {},

  visualMap: {
    orient: 'horizontal',
    left: 'center',
    min: 0,
    max: 100,
    text: ['High Income', 'Low Income'],
    dimension: 0,
    inRange: {
      color: ['#FFCE34', '#FD665F', '#FF9F7F', '#65B581']
    }
  },
  series: [
    {
      name: 'payment',
      type: 'bar',
      encode: {
        x: 'day',
        y: 'amount'
      }
    },
    {
      name: 'payment',
      type: 'line',
      smooth: true,
      encode: {
        x: 'day',
        y: 'amount'
      }
    }
  ]
};

if (chartDom && myChart) {
  myChart.setOption(option);
} else {
  console.error('Failed to initialize the chart');
}



/*
var myChart = echarts.init(document.getElementById('main'));
var option;

option = {
  color: ['#61a0a8', '#d48265',],
  title: {
    text: 'Every Day Collection'
  },
  tooltip: {},
  legend: {
    data: ['payment']
  },

  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {},

  series: [
    {
      name: 'payment',
      type: 'bar',
      data: [12000, 17900, 12014, 11275, 24103, 17825, 15821,]
    },
    {
      name: 'payment',
      type: 'line',
      smooth: true,
      data: [12000, 17900, 12014, 11275, 24103, 17825, 15821,]
    }

  ]
};

myChart.setOption(option);
*/
