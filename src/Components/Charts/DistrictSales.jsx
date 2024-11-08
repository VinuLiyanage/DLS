import React from 'react';

import PieChart, {
  Legend,
  Series,
  Tooltip,
  Format,
  Label,
  Connector,
  Export,
} from 'devextreme-react/pie-chart';


const populationByRegions = [{
    region: 'Colombo',
    val: 41196293,
  }, {
    region: 'Gampaha',
    val: 10126064,
  }, {
    region: 'Matale',
    val: 3441220,
  }, {
    region: 'Kandy',
    val: 5909440,
  }, {
    region: 'Kurunegala',
    val: 7270822,
  }, {
    region: 'Anuradhapura',
    val: 3510756,
  }];

class DistrictSales extends React.Component {
  render() {
    return (
      <PieChart
        id="pie"
        type="doughnut"
        title="Sales by Area"
        palette="Soft Pastel"
        dataSource={populationByRegions}
      >
        <Series argumentField="region">
          <Label visible={true} format="millions">
            <Connector visible={true} />
          </Label>
        </Series>
        <Export enabled={true} />
        <Legend
          margin={0}
          horizontalAlignment="right"
          verticalAlignment="top"
        />
        <Tooltip enabled={true} customizeTooltip={this.customizeTooltip}>
          <Format type="millions" />
        </Tooltip>
      </PieChart>
    );
  }

  customizeTooltip(arg) {
    return {
      text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`,
    };
  }
}

export default DistrictSales;
