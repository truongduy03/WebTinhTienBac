import React, { useEffect, useState } from "react";
import { Divider, Space, Table, Form, Button, Input } from "antd";
import "../index.css";
import { getAllEnergyUsed, saveBill } from "../api/api";
import AllBill from "./AllBill";

interface DataType {
  key: React.Key;
  name: string;
  price: number;
  range: string;
  energyUsed: number;
  sum?: number;
}

const Layout: React.FC = () => {
  const [datas, setData] = useState<DataType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [dataInput,setDataInput]= useState('')
  const [calculatedData, setCalculatedData] = useState<DataType[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    getAllEnergyUsed()
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Đã xảy ra lỗi:", error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    const inputNumber = parseFloat(inputValue);
    setErrorInput("");
    let hasError = false;

    if (!inputNumber && inputNumber !== 0) {
      setErrorInput("Phải nhập số điện");
      hasError = true;
    } else if (isNaN(inputNumber)) {
      setErrorInput("Dữ liệu nhập vào phải là số");
      hasError = true;
    }
    if (hasError) {
      return;
    }

    let remainingEnergy = inputNumber;
    let totalAmount = 0;

    const newCalculatedData = datas.map((tier) => {
      let energyUsedInTier = 0;
      let sum = 0;
      const range = tier.range.split("-");
      const lowerBound = parseInt(range[0]);
      const upperBound = range[1] === "+" ? Infinity : parseInt(range[1]);

      if (remainingEnergy > 0) {
        if (lowerBound === 0) {
          energyUsedInTier = Math.min(remainingEnergy, 50);
        } else if (remainingEnergy > upperBound - lowerBound) {
          energyUsedInTier = upperBound - lowerBound + 1;
        } else {
          energyUsedInTier = remainingEnergy;
        }

        sum = energyUsedInTier * tier.price;
        totalAmount += sum;
        remainingEnergy -= energyUsedInTier;
      }

      return { ...tier, energyUsed: energyUsedInTier, sum };
    });
    setDataInput(inputValue)
    setCalculatedData(newCalculatedData);
    setTotalAmount(parseFloat(totalAmount.toFixed(3)));

    const billData = {
      inputEnergy: inputNumber,
      totalAmount: parseFloat(totalAmount.toFixed(3)),
      timestamp: new Date().toISOString(),
    };

    try {
      await saveBill(billData);
      console.log("Hóa đơn đã được lưu thành công:", billData);
      setInputValue("");
    } catch (error) {
      console.error("Lỗi khi lưu hóa đơn:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toFixed(3);
  };

  const columns = [
    {
      title: "Bậc tiền",
      dataIndex: "name",
    },
    {
      title: "Giá tiền theo bậc",
      dataIndex: "price",
      render: (text: number) => formatCurrency(text),
    },
    {
      title: "Số sử dụng theo bậc",
      dataIndex: "energyUsed",
    },
    {
      title: "Tổng tiền theo bậc",
      dataIndex: "sum",
      render: (text: number) => formatCurrency(text),
    },
  ];

  return (
    <>
      <div className="flex justify-center">
        <div className="w-[50%] border-2 ">
          <Divider>
            <h1 className="text-3xl">Chức năng tính tiền theo bậc</h1>
          </Divider>
          <Space direction="vertical">
            <Form.Item label="Nhập số điện ở đây" className="m-5">
              <div className="text-xl flex flex-row gap-x-2">
                <Input
                  type="text"
                  placeholder="Nhập số điện"
                  className="flex-1.5"
                  onChange={handleInputChange}
                  value={inputValue}
                />
                {errorInput && (
                  <p className="text-red-500 text-sm mt-1">{errorInput}</p>
                )}
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  className="flex-0.5"
                  htmlType="submit"
                >
                  Xử lý
                </Button>
              </div>
            </Form.Item>
          </Space>
            <h2 className="m-5">Số vừa nhập: {dataInput} </h2>
          <Table<DataType>
            columns={columns}
            dataSource={calculatedData}
            pagination={false}
            rowClassName={(record) =>
              record.key === "total" ? "total-row" : ""
            }
          />
         
          <h1 className="m-5">
            Tổng số tiền phải trả: {formatCurrency(totalAmount)} VND
          </h1>
          <AllBill />
        </div>
      </div>
    </>
  );
};

export default Layout;
