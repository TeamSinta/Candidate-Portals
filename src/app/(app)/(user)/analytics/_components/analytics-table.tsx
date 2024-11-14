"use client";

import { AreaChart, Area, XAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

const data = [
  {
    id: 1,
    name: "7:00 PM",
    action: 0, // Example data point
  },
  {
    id: 2,
    name: "11:00 PM",
    action: 0, // Example data point
  },
  {
    id: 3,
    name: "3:00 AM",
    action: 0, // Example data point
  },
  {
    id: 4,
    name: "7:00 AM",
    action: 0, // Example data point
  },
  {
    id: 5,
    name: "11:00 AM",
    action: 0, // Example data point
  },
  {
    id: 6,
    name: "3:00 PM",
    action: 1, // Peak data point to create the sharp increase
  },
];

// Configure chart
const chartConfig = {
  action: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function AreaChartComponent() {
  return (
    <Card className="shadow-sm rounded-md mx-28 mt-6">
      <CardHeader className="pb-8">
        <CardTitle className="text-md font-regular">Views</CardTitle>

        <CardTitle className="text-4xl ">2</CardTitle>
      </CardHeader>
      <CardContent className="">
      <Separator className="mb-16 bg-gray-200 dark:bg-gray-800" />
        <ChartContainer config={chartConfig} className="h-64  w-full">

          <AreaChart
            width={600} // Adjust width
            height={250} // Adjust height
            data={data}
            margin={{ top: 20, right: 30, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="2 2" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={{ stroke: "rgba(0, 0, 0, 0.1)", strokeWidth: 1 }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              type="monotone"
              dataKey="action"
              stroke="var(--color-action)"
              fill="var(--color-action)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
