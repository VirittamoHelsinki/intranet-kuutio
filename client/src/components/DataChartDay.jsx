import { BarChart } from '@mui/x-charts/BarChart';

const DataChartDay = ({bookings}) => {

	const weekdays = Array(7).fill(0);

	bookings.forEach(booking => {
		const date = new Date(booking.selectedDate);
		const dayOfWeek = date.getDay();
		weekdays[dayOfWeek] += 1;
	})

	const chartSetting = {
		xAxis: [
		{
			label: 'varausten määrä',
		},
		],
		width: 500,
		height: 400,
	};

	const dataset = [
		{
		bookings: weekdays[1],
		day: 'Ma',
		},
		{
		bookings: weekdays[2],
		day: 'Ti',
		},
		{
		bookings: weekdays[3],
		day: 'Ke',
		},
		{
		bookings: weekdays[4],
		day: 'To',
		},
		{
		bookings: weekdays[5],
		day: 'Pe',
		},
	];

	const valueFormatter = (value) => {
		const text = value == 1 ? 'varaus' : 'varausta';
		return `${value} ${text}`;
	}

	return (
		<BarChart
			dataset={dataset}
			yAxis={[{ scaleType: 'band', dataKey: 'day' }]}
			series={[{ dataKey: 'bookings', label: 'Käyttöaste', valueFormatter }]}
			layout="horizontal"
			{...chartSetting}
		/>
	)
}

export default DataChartDay
