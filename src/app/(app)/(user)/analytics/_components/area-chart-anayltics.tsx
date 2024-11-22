"use client";

import { AreaChart, Area, XAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

const data = [
    { name: "7:00 PM", action: 0 },
    { name: "11:00 PM", action: 3 },
    { name: "3:00 AM", action: 0 },
    { name: "7:00 AM", action: 8 },
    { name: "11:00 AM", action: 2 },
    { name: "3:00 PM", action: 0 },
];

// Function to check if all data points have zero action values
const isAllZeroData = data.every((point) => point.action === 0);

const chartConfig = {
    action: {
        label: "Views",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export default function AreaChartComponent() {
    return (
        <Card className="mx-28 mt-6 rounded-md shadow-sm">
            <CardHeader className="pb-8">
                <CardTitle className="text-lg font-semibold">Views</CardTitle>
                <CardTitle className="text-4xl font-medium">3</CardTitle>
            </CardHeader>
            <CardContent>
                <Separator className="mb-16 bg-gray-200 dark:bg-gray-800" />
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <AreaChart
                        width={600}
                        height={250}
                        data={data.map((point) => ({
                            ...point,
                            action: isAllZeroData ? 0.5 : point.action, // Center line if all values are zero
                        }))}
                        margin={{ top: 20, right: 30, left: -10, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="gradient"
                                x1="0"
                                y1="1"
                                x2="1"
                                y2="0"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#4481eb"
                                    stopOpacity={0}
                                />
                                <stop
                                    offset="50%"
                                    stopColor="#6297DB"
                                    stopOpacity={0.1}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#04befe"
                                    stopOpacity={0.2}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="2 2" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <ChartTooltip
                            cursor={{
                                stroke: "rgba(0, 0, 0, 0.1)",
                                strokeWidth: 1,
                            }}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            type="monotone"
                            dataKey="action"
                            stroke="#4481eb" // Line color
                            strokeWidth={3} // Thicker line
                            fill="url(#gradient)" // Use the new gradient for the area
                            fillOpacity={1}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
