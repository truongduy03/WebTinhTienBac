import React, { useEffect, useState } from "react";
import { getAllBill } from "../api/api";
import { Table } from "antd";
import dayjs from "dayjs";

interface DataType {
  key: React.Key;
  inputEnergy: number;
  totalAmount: number;
  timestamp: string;
}

const AllBill: React.FC = () => {
  const [datas, setData] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllBill();
        const reversedData = response.data.reverse();
        setData(reversedData);
      } catch (error) {
        console.error("Đã xảy ra lỗi", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);
  const formatCurrency = (value: number) => {
    return value.toFixed(3);
  };
  const columns = [
    {
      title: "Số điện",
      dataIndex: "inputEnergy",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      render: (text: number) => formatCurrency(text),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "timestamp",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (timestamp: any) => dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <div>
      <div>
        <Table<DataType>
          columns={columns}
          dataSource={datas}
          pagination={{
            pageSize: 5,
          }}
        />
      </div>
    </div>
  );
};

export default AllBill;
