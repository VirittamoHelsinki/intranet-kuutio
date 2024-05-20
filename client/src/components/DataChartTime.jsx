import { LineChart } from '@mui/x-charts/LineChart';
import React from 'react'

const DataChartTime = ({bookings}) => {

	const timeLabels = [
		'07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
		'11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
		'14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
	];

	const times = Array(timeLabels.length).fill(0);

	bookings.forEach(booking => {
		booking.selectedTime.forEach(time => {
			const index = timeLabels.indexOf(time);

			times[index] += 1;
		})
	});

	const chartSetting = {
		xAxis: [
		{
			label: 'varausten määrä',
		},
		],
		width: 900,
		height: 400,
	};

	const dataset = timeLabels.map((time, index) => ({
		bookings: times[index],
		time,
	}));

	const valueFormatter = (value) => {
		const text = value == 1 ? 'varaus' : 'varausta';
		return `${value} ${text}`;
	};

	return (
		<LineChart
			dataset={dataset}
			xAxis={[{
				scaleType: 'band',
				dataKey: 'time',
				tickLabelStyle: {
					angle: 45,
					textAnchor: 'start',
				},
			}]}
			series={[{ dataKey: 'bookings', label: 'Ajan mukaan', valueFormatter }]}
			width={800}
			height={400}
		/>
	)
}

export default DataChartTime
