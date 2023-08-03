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


export default function RectangleChart(props:any) {
    return (
        <ResponsiveContainer width={'99%'} height={233}>
            <ComposedChart
                layout="vertical"
                data={props.studentRating}
            >
                {/* <CartesianGrid stroke="#f5f5f5" /> */}
                <XAxis type="number" stroke="#A0ABBB" ticks={[1, 2, 3, 4, 5]}/>
                <YAxis dataKey="name" stroke="#A0ABBB" orientation='left' width={92} padding={{ top: 20, bottom: 30 }} tick={{ fontSize: 12 }} type="category" allowDataOverflow={false} />
                <Tooltip />
                <Bar dataKey="type" barSize={25} fill="#8486F4B2" />
            </ComposedChart>
        </ResponsiveContainer>
    );
}

