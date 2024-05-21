import DataChartDay from './DataChartDay'
import DataChartTime from './DataChartTime'

const Statistics = ({bookings}) => {
  return (
	<>
	<h2 style={{textAlign: 'center', marginRight: '430px'}}>
		Varaukset
	</h2>
	<div className="datachart">
		<DataChartDay bookings={bookings}/>
		<DataChartTime bookings={bookings}/>
	</div>
	</>
  )
}

export default Statistics
