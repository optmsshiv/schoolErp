var options = {
  series: [{
  name: 'Nursery',
  type: 'column',
  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
}, {
  name: 'LKG',
  type: 'area',
  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
}, {
  name: 'UKG',
  type: 'line',
  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
},{
  name: 'Class 1',
  type: 'line',
  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]

},
{
  name: 'Class 2',
  type: 'line',
  data: [28, 22, 33, 29, 41, 32, 60, 50, 55, 34, 37]
},
{
  name: 'Class 3',
  type: 'column',
  data: [32, 27, 38, 33, 47, 38, 68, 56, 62, 40, 43]
},
{
  name: 'Class 4',
  type: 'line',
  data: [35, 30, 41, 36, 50, 41, 72, 60, 66, 44, 47]
},
{
  name: 'Class 5',
  type: 'line',
  data: [38, 33, 44, 39, 53, 44, 76, 64, 70, 48, 51]
},
{
  name: 'Class 6',
  type: 'line',
  data: [41, 36, 47, 42, 56, 47, 80, 68, 74, 52, 55]
},
{
  name: 'Class 7',
  type: 'line',
  data: [44, 39, 50, 45, 59, 50, 84, 72, 78, 56, 59]
},
{
  name: 'Class 8',
  type: 'line',
  data: [47, 42, 53, 48, 62, 53, 88, 76, 82, 60, 63]
},
{
  name: 'Class 9',
  type: 'line',
  data: [50, 45, 56, 51, 65, 56, 92, 80, 86, 64, 67]
},
{
  name: 'Class 10',
  type: 'line',
  data: [53, 48, 59, 54, 68, 59, 96, 84, 90, 68, 71]
},

],
  chart: {
  height: 350,
  type: 'line',
  stacked: false,
},
stroke: {
  width: [0, 2, 5],
  curve: 'smooth'
},
plotOptions: {
  bar: {
    columnWidth: '50%'
  }
},

fill: {
  opacity: [0.85, 0.25, 1],
  gradient: {
    inverseColors: false,
    shade: 'light',
    type: "vertical",
    opacityFrom: 0.85,
    opacityTo: 0.55,
    stops: [0, 100, 100, 100]
  }
},
labels: ['01/01/2024', '02/01/2024', '03/01/2024', '04/01/2024', '05/01/2024', '06/01/2024', '07/01/2024',
  '08/01/2024', '09/01/2024', '10/01/2024', '11/01/2024'
],
markers: {
  size: 0
},
xaxis: {
  type: 'datetime'
},
yaxis: {
  title: {
    text: 'Income',
  }
},
tooltip: {
  shared: true,
  intersect: false,
  y: {
    formatter: function (y) {
      if (typeof y !== "undefined") {
        return y.toFixed(0) + " Income";
      }
      return y;

    }
  }
}
};

var chart = new ApexCharts(document.querySelector("#collectionChart"), options);
chart.render();
