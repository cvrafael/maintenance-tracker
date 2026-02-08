import { Table, Select, Button, Popover, Flex, Tabs, Spin, Modal, Form, Input } from 'antd';
import { Column } from '@ant-design/plots';
import { useEffect, useState, useRef } from 'react';
import { getAllRunins } from './apiTEMaintenanceRunin';
import Avt from '../Avt/index'
import { WarningOutlined, CheckCircleOutlined, BarChartOutlined } from '@ant-design/icons';

const TEMaintenance = () => {
  const [tableData, setTableData] = useState([]);
  const [runinDatas, setRuninDatas] = useState([]);
  const chartRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const showLoading = (payload) => {
    console.log(payload)
    setRuninDatas(payload)
    setOpen(true);
    setLoading(true);
    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const data = [
    { type: 'Cabo de rede', value: 14 },
    { type: 'Cabo VGA', value: 3 },
    { type: 'Cabo power NB', value: 2 },
    { type: 'Cabo power DT', value: 1 },
  ];

  const stylesObject = {
    indicator: {
      color: '#00d4ff',
    },
  };
  const sharedProps = {
    spinning: true,
    percent: 0,
  };

  const medal = (datum, ranking) => {
    if (ranking > 2) return datum;
    console.log(datum)
    console.log('ranking', ranking)
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
    const payload = {
        runin: record.runin,
        rack: record.rack,
        position: record.position,
      };
      // futuro:
      // api.patch('/maintenance/status', payload)
    
     return (
      <Flex gap={5}>

        <Modal
          title={<p>Loading Modal</p>}
          loading={loading}
          mask={false}
          open={open}
          footer={false}
          onCancel={() => setOpen(false)}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            initialValues={''}
            onValuesChange={''}
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Run In">
              <Input value={runinDatas.runin} disabled />
            </Form.Item>
            <Form.Item label="Rack">
              <Input value={runinDatas.rack} disabled />
            </Form.Item>
            <Form.Item label="Position">
              <Input value={runinDatas.position} disabled />
            </Form.Item>
            <Form.Item label="Status">
              <Select options={[{ label: 'OK', value: 'OK' }, { label: 'NOK', value: 'NOK' }]} />
            </Form.Item>
            <Form.Item label="Defect">
              <Select options={
                [
                  { 
                    label: 'Cabo de rede', 
                    value: 'Cabo de rede' 
                  },
                  { 
                    label: 'Cabo VGA', 
                    value: 'Cabo VGA' 
                  },
                  { 
                    label: 'Cabo power NB', 
                    value: 'Cabo power NB' 
                  },
                  { 
                    label: 'Cabo power DT', 
                    value: 'Cabo power DT' 
                  }
                ]
              }
               />
            </Form.Item>
            <Form.Item label="Button">
              <Button 
              //  onClick={() => {}}
              >Submit</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Button
          type="primary"
          danger
          disabled={!record.rack || !record.position}
          onClick={()=>showLoading(payload)}
        >
          Solid
        </Button>

        <Button
          icon={<BarChartOutlined />}
          type="primary"
        />
      </Flex>
    )
  };

  const rackColumn = (_, record) => {
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
      !tableData ? <Spin {...sharedProps} styles={stylesObject} /> :
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
    )
  };


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
      !tableData ? <Spin {...sharedProps} styles={stylesObject} /> :
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