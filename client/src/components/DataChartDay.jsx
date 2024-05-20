import { BarChart } from '@mui/x-charts/BarChart';

const DataChartDay = ({bookings}) => {

	const weekdays = Array(7).fill(0);

	bookings.forEach(booking => {
		const date = new Date(booking.selectedDate);
		const dayOfWeek = date.getDay();
		weekdays[dayOfWeek] += 1;
	});

	const chartSetting = {
		xAxis: [
		{
			label: 'varausten määrä',
		},
		],
		width: 400,
		height: 400,
	};

	const dataset = [
		{
		bookings: weekdays[1],
		day: 'Maanantai',
		},
		{
		bookings: weekdays[2],
		day: 'Tiistai',
		},
		{
		bookings: weekdays[3],
		day: 'Keskiviikko',
		},
		{
		bookings: weekdays[4],
		day: 'Torstai',
		},
		{
		bookings: weekdays[5],
		day: 'Perjantai',
		},
	];

	const valueFormatter = (value) => {
		const text = value == 1 ? 'varaus' : 'varausta';
		return `${value} ${text}`;
	};

	return (
		<BarChart
			dataset={dataset}
			yAxis={[{ scaleType: 'band', dataKey: 'day' }]}
			series={[{ dataKey: 'bookings', label: 'Päivän mukaan', valueFormatter }]}
			layout="horizontal"
			{...chartSetting}
		/>
	)
}

export default DataChartDay
