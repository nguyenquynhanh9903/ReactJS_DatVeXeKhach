import React, { useState, useEffect } from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ThongKeDT = () => {
    const [selectedOption, setSelectedOption] = useState('year');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);

    const tinhDoanhThu = async (option) => {
        try {
            const res = await axios.get('http://192.168.1.109:8000/payment/'); // Replace with your API endpoint
            const vexeData = res.data;
            const revenueData = {};
            vexeData.forEach((ticket) => {
                const date = new Date(ticket.created_date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const quarter = Math.ceil(month / 3);
                const revenue = parseInt(ticket.Gia);

                if (option === 'year') {
                    const label = `${year}`;
                    if (!revenueData[label]) {
                        revenueData[label] = 0;
                    }
                    revenueData[label] += revenue;
                } else if (option === 'month' && year === selectedYear && month === selectedMonth) {
                    const label = `${year}-${month < 10 ? '0' : ''}${month}`;
                    if (!revenueData[label]) {
                        revenueData[label] = 0;
                    }
                    revenueData[label] += revenue;
                } else if (option === 'quarter' && year === selectedYear && quarter === Math.ceil(selectedMonth / 3)) {
                    const label = `${year}-Quý${quarter}`;
                    if (!revenueData[label]) {
                        revenueData[label] = 0;
                    }
                    revenueData[label] += revenue;
                }
            });

            setData(Object.values(revenueData));
            setLabels(Object.keys(revenueData));
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            setData([]);
            setLabels([]);
        }
    };

    useEffect(() => {
        tinhDoanhThu(selectedOption);
    }, [selectedOption, selectedYear, selectedMonth]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Doanh Thu',
                data: data,
                backgroundColor: [
                    '#00FFFF',
                    '#1E90FF',
                    '#0000FF',
                    '#FFFF00',
                    '#FF4500',
                    '#FA8072',
                    '#FF1493',
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: VNĐ ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'VNĐ',
                },
            },
        },
    };

    return (
        <Container style={{ marginTop: 20 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                BIỂU ĐỒ DOANH THU
            </Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel>Chọn tùy chọn</InputLabel>
                <Select value={selectedOption} onChange={handleOptionChange}>
                    <MenuItem value="quarter">Theo Quý</MenuItem>
                    <MenuItem value="year">Theo Năm</MenuItem>
                    <MenuItem value="month">Theo Tháng</MenuItem>
                </Select>
            </FormControl>
            {(selectedOption === 'month' || selectedOption === 'quarter') && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Năm</InputLabel>
                    <Select value={selectedYear} onChange={handleYearChange}>
                        {Array.from({ length: new Date().getFullYear() - 2019 }, (v, i) => (
                            <MenuItem key={2020 + i} value={2020 + i}>
                                {2020 + i}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {selectedOption === 'month' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Tháng</InputLabel>
                    <Select value={selectedMonth} onChange={handleMonthChange}>
                        {Array.from({ length: 12 }, (v, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <Bar data={chartData} options={chartOptions} width={600} height={400} />
        </Container>
    );
};

export default ThongKeDT;