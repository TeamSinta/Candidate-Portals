"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { MergedSectionData } from "@/types/portal";

// Helper function to format duration in seconds to "MM:SS"
function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `: ${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Props interface
interface BarChartComponentProps {
    data: MergedSectionData[];
}

export function BarChartComponent({ data }: BarChartComponentProps) {
    const chartConfig = {
        time_spent: {
            label: "Time Spent",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle>Progress Duration</CardTitle>
                <CardDescription>Time Spent Per Section (Avg.)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="section_title"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 15)} // Shorten title if needed
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        valueFormatter={formatDuration} // Pass the formatDuration function
                                    />
                                }
                            />
                            <Bar
                                dataKey="total_duration"
                                fill="hsl(var(--chart-1))"
                                radius={8}
                                name="Time Spent"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
