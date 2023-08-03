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
  ResponsiveContainer,
  Scatter,
  LabelList,
  Label,
} from "recharts";

const data = [
  {
    name: "Onboarding Simulation",
    uv: 590,
    teams: 968,
  },
  {
    name: "Litigation Onboarding",
    uv: 868,
    teams: 967,
  },
];

const CustomizedLabel = () => {
  return <div className="customY">{Children}</div>;
};

export default function SquareChart(props: any) {
  return (
    <ResponsiveContainer width={"99%"} height={160+(props.perSimulationTeams?.length*10)}>
      <ComposedChart layout="vertical" data={props.perSimulationTeams}>
        {/* <CartesianGrid stroke="#f5f5f5" /> */}
        <XAxis type="number" stroke="#A0ABBB" />
        <YAxis
          dataKey="name"
          stroke="#A0ABBB"
          orientation="left"
          width={92}
          padding={{ top: 20, bottom: 30 }}
          tick={{ fontSize: 12 }}
          type="category"
          allowDataOverflow={false}
        />
        <Tooltip />
        <Bar dataKey="teams" barSize={25} fill="#8486F4B2">
          <LabelList dataKey="content" position="right" />
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
}
