import { Table, Select, Button, Popover, Flex, Tabs  } from 'antd';
import { Column } from '@ant-design/plots';
import { useEffect, useState, useRef } from 'react';
import {getAllRunins} from './apiTEMaintenanceRunin';
import Avt from '../Avt/index'
import { WarningOutlined, CheckCircleOutlined, BarChartOutlined } from '@ant-design/icons';

const TEMaintenance = () => {
  const [tableData, setTableData] = useState([]);
  const chartRef = useRef(null);

const data = [
  { type: 'Cabo de rede', value: 14 },
  { type: 'Cabo VGA', value: 3 },
  { type: 'Cabo power NB', value: 2 },
  { type: 'Cabo power DT', value: 1 },
];

const medal = (datum, ranking) => {
    if (ranking > 2) return datum;
    console.log(datum)
    console.log('ranking',ranking)
    const { chart } = chartRef.current;
    const { document } = chart.getContext().canvas;
    const group = document?.createElement('g', {});

    const size = ranking === 0 ? 20 : 15;
    // const icon = document.createElement('image', {
    //   style: {
    //     src: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*1NiMRKb2sfMAAAAAAAAAAAAADmJ7AQ/original',
    //     width: size,
    //     height: size,
    //     anchor: '0.5 0.5',
    //   },
    // });
    const text = [data[0].type, data[1].type, data[2].type, data[3].type][ranking];
    const label = document.createElement('text', {
      style: {
        text,
        fill: 'gray',
        textAlign: 'center',
        transform: `translate(0, 25)`,
      },
    });
    group.appendChild(label);
    return group;
  };

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    colorField: 'type',
    axis: {
      x: {
        size: 40,
        labelFormatter: (datum, index) => medal(datum, index),
      },
    },
    onReady: (plot) => (chartRef.current = plot),
  };

useEffect(() => {
  getAllRunins()
    .then((result) => {
      const rows = result.data.map((r) => ({
        key: r.id,
        runin: r.runin,
        racks: r.racks,
        rack: null,
        position: null,
      }));

      setTableData(rows);
    })
    .catch(console.error);
}, []);

const actionColumn = (_, record) => {
  const content = (
    <div style={{width: '100%'}}>
      <Column {...config} />
    </div>
  );
  return (
  <Flex gap={5}>

  <Button
    type="primary"
    danger
    disabled={!record.rack || !record.position}
    onClick={() => {
      const payload = {
        runin: record.runin,
        rack: record.rack,
        position: record.position,
      };

      console.log('payload:', payload);

      // futuro:
      // api.patch('/maintenance/status', payload)
    }}
  >
    Solid
  </Button>
   <Popover content={content} trigger="hover">
      
    <Button
      icon={<BarChartOutlined />}
      type="primary"
      />
      </Popover>
    </Flex>
)
};

const rackColumn = (_, record) =>{
  const content = (
  <div>
    <p>Existe racks com problemas</p>
  </div>
);
  const content2 = (
  <div>
    <p>Runin sem problemas</p>
  </div>
);
  const hasAnyRackNok = record.racks.some((rk) =>
  rk.positions.some((p) => p.status === 'NOK')
);
  return (
  <Flex gap={5}>
  <Select
    placeholder="Select rack"
    value={record.rack}
    style={{ width: '100%' }}
    options={record.racks.map((rk) => {
      const hasNokRack = rk.positions.some(
        (p) => p.status === 'NOK'
      );

      return {
        value: rk.rack,
        label: (
          <span
            style={{
              color: hasNokRack ? 'red' : 'inherit',
              fontWeight: hasNokRack ? 'bold' : 'normal',
            }}
          >
            {rk.rack}
          </span>
        ),
      };
    })}
    onChange={(value) => {
      setTableData((prev) =>
        prev.map((row) =>
          row.key === record.key
            ? { ...row, rack: value, position: null }
            : row
        )
      );
    }}
  />

  {hasAnyRackNok ? (
     <Popover content={content} trigger="hover">
      
    <Button
      icon={<WarningOutlined />}
      type="primary"
      danger
      />
      </Popover>
  ) : (
    <Popover content={content2} trigger="hover">

    <Button
      icon={<CheckCircleOutlined />}
      type="primary"
      style={{ background: '#52c41a', borderColor: '#52c41a' }}
      />
      </Popover>
  )}
</Flex>
)};


const positionColumn = (_, record) => {
  const rackSelected = record.racks.find(
    (rk) => rk.rack === record.rack
  );

  const options =
    rackSelected?.positions.map((p) => ({
      value: p.position,
      label: (
        <span style={{ color: p.status === 'NOK' ? 'red' : 'inherit' }}>
          {p.position}
        </span>
      ),
    })) || [];

  return (
    <Select
      placeholder="Select position"
      value={record.position}
      disabled={!record.rack}
      style={{ width: '100%' }}
      options={options}
      onChange={(value) => {
        setTableData((prev) =>
          prev.map((row) =>
            row.key === record.key
              ? { ...row, position: value }
              : row
          )
        );
      }}
    />
  );
};

const columns = [
  { title: 'Run In', dataIndex: 'runin' },
  { title: 'Rack', render: rackColumn },
  { title: 'Position', render: positionColumn },
  { title: 'Action', render: actionColumn },
];

const onChange = key => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Run In',
    children: <Table columns={columns} dataSource={tableData} bordered />,
  },
  {
    key: '2',
    label: 'Avt',
    children: <Avt />,
  },
];

  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    // <Table columns={columns} dataSource={tableData} bordered />
  )
};
export default TEMaintenance;