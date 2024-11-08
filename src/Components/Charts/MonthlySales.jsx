import React from 'react';

import Chart, {
  ArgumentAxis,
  Legend,
  Series,
  ValueAxis,
  Label,
  Export,
  Tick,
} from 'devextreme-react/chart';

const tempData = [
	{ "day": "January", "sales": 1256962},
	{ "day": "February", "sales": 156466 },
	{ "day": "March", "sales": 5676787 },
	{ "day": "April", "sales": 212311 },
	{ "day": "May", "sales": 4134565 },
	{ "day": "June", "sales": 5696547 },
	{ "day": "July", "sales": 566564},
	{ "day": "August", "sales": 666666 },
	{ "day": "September", "sales": 785566 },
	{ "day": "October", "sales": 100008 },
    { "day": "November", "sales": 765229 },
    { "day": "December", "sales": 568765 }
]

class MonthlySales extends React.Component {
  customizeText(e) {
    return `${e.value}`;
  }

  render() {
    return (
      <Chart
        title="Monthly Sales"
        dataSource={tempData}
        rotated={true}
        id="chart"
      >

        <ArgumentAxis>
          <Label customizeText={this.customizeText} />
        </ArgumentAxis>

        <ValueAxis>
          <Tick visible={false} />
          <Label visible={false} />
        </ValueAxis>

        <Series
          valueField="sales"
          argumentField="day"
          type="bar"
          color="#79cac4"
        >
          <Label visible={true} backgroundColor="#c18e92" />
        </Series>

        <Legend visible={false} />

        <Export enabled={true} />

      </Chart>
    );
  }
}

export default MonthlySales;