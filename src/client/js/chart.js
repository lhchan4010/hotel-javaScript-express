import 'regenerator-runtime';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { async } from 'regenerator-runtime';
Chart.register(ChartDataLabels);

const range = document.querySelector('form');
const chartContainer = document.getElementById('revenue');

const revenueCalculator = (data, labels) => {
  const totalRevenue = [];
  const cashRevenue = [];
  const cardRevenue = [];
  const yanoljaRevenue = [];
  for (const label of labels) {
    let cash = 0;
    let card = 0;
    let yanolja = 0;
    data.map((item) => {
      if (item.createAt === label) {
        switch (item.payment) {
          case 'cash':
            cash = cash + item.price;
            break;
          case 'card':
            card = card + item.price;
            break;
          case 'yanolja':
            yanolja = yanolja + item.price;
            break;
          default:
            break;
        }
      }
    });
    totalRevenue.push(cash + card + yanolja);
    cashRevenue.push(cash);
    cardRevenue.push(card);
    yanoljaRevenue.push(yanolja);
  }
  return {
    totalRevenue,
    cashRevenue,
    cardRevenue,
    yanoljaRevenue,
  };
};

const getRevenue = async (event) => {
  event.preventDefault();
  const range = event.target[0].value;
  const res = await fetch(
    `/user/accounting/revenue/${range}`
  );
  const data = await res.json();
  const labels = new Set(
    data.map((item) => {
      item.createAt = item.createAt.slice(5, 10);
      return item.createAt;
    })
  );

  const revenue = revenueCalculator(data, labels);
  const revenueChart = chart([...labels], revenue);
  const previousCanvas = document.querySelector('canvas');
  if (previousCanvas) {
    previousCanvas.remove();
  }
  chartContainer.appendChild(revenueChart);
};

const chart = (
  labels,
  { totalRevenue, cashRevenue, cardRevenue, yanoljaRevenue }
) => {
  const canvas = document.createElement('canvas');
  canvas.id = 'revenueChart';
  canvas.setAttribute('width', '400');
  canvas.setAttribute('height', '400');
  const ctx = canvas.getContext('2d');
  const revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'total',
          datalabels: {
            font: { size: 16 },
            color: 'white',
          },
          data: totalRevenue,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          borderColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 1,
        },
        {
          label: 'cash',
          data: cashRevenue,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'card',
          data: cardRevenue,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
        {
          label: 'yanolja',
          data: yanoljaRevenue,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
  return canvas;
};
range.addEventListener('submit', getRevenue);
