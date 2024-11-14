"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
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
import { MergedEngagedData } from "@/types/portal";

// Updated component name
export function TopEngagingUsersChart({ data }: { data: MergedEngagedData[] }) {
    // Define the chart configuration
    const chartConfig = {
        total_duration: {
            label: "Total Time Spent",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    // Helper function to format duration as "MM:SS"
    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `: ${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    // Array of color variables
    const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
    ];

    // Format the data and assign colors cyclically
    const formattedData = data.map((item, index) => ({
        candidate_name: item.candidate_name,
        total_duration: item.total_duration,
        fill: colors[index % colors.length], // Cycle through the colors
    }));

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle>Top Engaging Users</CardTitle>
                <CardDescription>
                    Showing the top users by engagement
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="max-h-[250px] w-full"
                >
                    <BarChart
                        data={formattedData}
                        layout="vertical"
                        margin={{
                            left: 12,
                        }}
                    >
                        <YAxis
                            dataKey="candidate_name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis dataKey="total_duration" type="number" hide />
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
                            layout="vertical"
                            radius={5}
                            name="Total Time Spent"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
