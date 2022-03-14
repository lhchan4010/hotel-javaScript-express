import 'regenerator-runtime';
import Chart from 'chart.js/auto';
import { async } from 'regenerator-runtime';

const chartContainer = document.getElementById('chart');

const revenueCalculator = (data, type) => {
  return data.reduce((a, b) => {
    if (b.payment === type) {
      return a + b.price;
    }
    return a;
  }, 0);
};

const revenueApi = async () => {
  const res = await fetch(`/user/accounting/revenue`);
  const data = await res.json();
  return data;
};
const paintChart = async () => {
  const data = await revenueApi();
  const dates = new Set(
    data.map((item) => {
      return item.time.checkIn
        .slice(5, 10)
        .replace('-', '/');
    })
  );
  const type = {
    card: 'card',
    cash: 'cash',
    yanolja: 'yanolja',
  };
  const cardRevenue = revenueCalculator(data, type.card);
  const cashRevenue = revenueCalculator(data, type.cash);
  const yanoljaRevenue = revenueCalculator(
    data,
    type.yanolja
  );
  chart(
    [...dates],
    [cashRevenue],
    [cardRevenue],
    [yanoljaRevenue]
  );
};
paintChart();

const chart = (
  labels,
  cashRevenue,
  cardRevenue,
  yanoljaRevenue
) => {
  const ctx = document
    .getElementById('myChart')
    .getContext('2d');
  const type = 'bar';
  const myChart = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [
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
};

const month = async () => {
  const res = await fetch(`/user/accounting/revenue/month`);
  const data = await res.json();
  return data;
};
