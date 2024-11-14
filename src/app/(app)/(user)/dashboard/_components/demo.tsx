import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { LinkIcon, MousePointerClick } from "lucide-react";

const reviews = [
    {
        icon: <LinkIcon className="h-6 w-6 text-gray-500" />,
        actionIcon: <MousePointerClick className="h-6 w-6 text-gray-400" />,
    },
    {
        icon: <LinkIcon className="h-6 w-6 text-gray-500" />,
        actionIcon: <MousePointerClick className="h-6 w-6 text-gray-400" />,
    },
];

const ReviewCard = ({
    icon,
    actionIcon,
    name,
}: {
    icon: JSX.Element;
    actionIcon: JSX.Element;
    name: string;
}) => {
    return (
        <div
            className={cn(
                "relative flex h-16 w-full max-w-sm items-center justify-between p-4",
                "rounded-lg border border-gray-200 bg-white shadow-md",
                "dark:border-gray-800 dark:bg-gray-900 dark:shadow-none",
            )}
        >
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    {icon}
                    <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-500"></div>
                </div>
                {actionIcon}
            </div>
        </div>
    );
};

export function MarqueeCardVertical() {
    return (
        <div className="relative flex h-36 w-full items-center justify-center overflow-hidden">
            <Marquee vertical className="[--duration:20s]">
                {reviews.map((review, index) => (
                    <ReviewCard key={index} {...review} />
                ))}
            </Marquee>
        </div>
    );
}
