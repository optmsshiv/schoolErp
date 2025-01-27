
var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'],
      datasets: [
        {
          label: 'Income Of the Year 2025 monthly',
          data: [105000, 124000, 113000, 94000, 56000, 128000, 92000, 130000, 121000, 102000,216000, 107000], // Example data
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(41, 175, 175, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(203, 37, 73, 0.35)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(54, 173, 17, 0.2)',
            'rgba(216, 102, 14, 0.45)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgb(206, 174, 14)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


  /***********pie chart  *************

  var options = {
    series: [10, 5, 15], // Example data
    chart: {
      type: 'donut'
    },
    labels: ['Paid', 'Pending', 'Overdue'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();*/

  /**************pie chart classwiese****************/
  var classData = {
    1: [10, 5, 5], // Example data for Class 1: Paid, Pending, Overdue
    2: [8, 7, 5],  // Example data for Class 2: Paid, Pending, Overdue
    3: [12, 3, 5]  // Example data for Class 3: Paid, Pending, Overdue
  };

  var options = {
    series: [],
    chart: {
      type: 'pie'
    },
    labels: ['Paid', 'Pending', 'Overdue'],
    title: {
      text: ''
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 100
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();

  document.getElementById('classSelect').addEventListener('change', function() {
    var classValue = this.value;
    if (classValue != 0) {
      options.series = classData[classValue];
      options.title.text = 'Class ' + classValue + ' Fee Status';
      chart.updateOptions(options);
    }
  });




