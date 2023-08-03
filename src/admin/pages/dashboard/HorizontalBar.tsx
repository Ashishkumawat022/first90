import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import React from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    indexAxis: "y" as const,
    responsive: true,
    scrollbar: {
        enabled: true
    },
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart',
        },
    }

};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data: any = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: [990, 90, 90, 90, 89, 90, 890, 900, 90, 90, 90, 89, 90, 890, 900, 90, 90, 90, 89, 90, 890, 900, 980],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

export function HorizontalBar() {
    return <Bar options={options} data={data} />;
}
