var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

option = {
  dataset: {
    source: [
      ['income', 'amount', 'day'],
      [65.0, 1000, 'Sunday '],
      [90.0, 7900, 'Saturday'],
      [100.0, 2014, 'Friday'],
      [80.0, 1275, 'Thrusday'],
      [53.2, 4103, 'Wednseday'],
      [82.2, 7825, 'Tuesday '],
      [55.0, 5821, 'Monday']
    ]
  },
  grid: { containLabel: true },
  xAxis: { name: 'amount' },
  yAxis: { type: 'category' },
  visualMap: {
    orient: 'horizontal',
    left: 'center',
    min: 10,
    max: 100,
    text: ['High Income', 'Low Income'],
    dimension: 0,
    inRange: {
      color: ['#FFCE34', '#FD665F', '#FF9F7F', '#65B581']
    }
  },
  series: [
    {
      type: 'bar',
      encode: {
        x: 'amount',
        y: 'day'
      }
    }
  ]
};

if (chartDom && myChart) {
  myChart.setOption(option);
} else {
  console.error('Failed to initialize the chart');
}
