var chartDom = document.getElementById('mains');
if (chartDom) {
  var myChart = echarts.init(chartDom);
} else {
  console.error('Chart container element not found');
}
