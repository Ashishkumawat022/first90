import React, { Children } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ResponsiveContainer
} from "recharts";

const data = [
  {
    name: "Attention to Detail",
    uv: 590,
    pv: 800,
    amt: 1400,
    cnt: 490
  },
  {
    name: "Written Communication",
    uv: 868,
    pv: 967,
    amt: 1506,
    cnt: 590
  },
  {
    name: "Verbal Communication",
    uv: 1397,
    pv: 1098,
    amt: 989,
    cnt: 350
  },
  {
    name: "Knowledge of APS Contracts",
    uv: 1480,
    pv: 1200,
    amt: 1228,
    cnt: 480
  },
  {
    name: "Research Ability",
    uv: 1520,
    pv: 1108,
    amt: 1100,
    cnt: 460
  }
];

const CustomizedLabel = () => {
  return <div className="customY">{Children}</div>
}

export default function BarChart() {
  return (
    <ResponsiveContainer width={'99%'} height={339}>
      <ComposedChart
        layout="vertical"
        data={data}
      >
        {/* <CartesianGrid stroke="#f5f5f5" /> */}
        <XAxis type="number" stroke="#A0ABBB" />
        <YAxis dataKey="name" stroke="#A0ABBB" orientation='left' width={92} padding={{ top: 20, bottom: 30 }} tick={{ fontSize: 12 }} type="category" allowDataOverflow={false} />
        <Tooltip />
        <Bar dataKey="pv" barSize={25} fill="#8486F4B2" />
      </ComposedChart>
    </ResponsiveContainer >
  );
}

