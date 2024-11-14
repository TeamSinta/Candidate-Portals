"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlurFade from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/ui/dot-pattern";

export default function PageWithLoadingEffect({ children }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 3000); // 2 seconds delay to simulate loading effect

        return () => clearTimeout(timer);
    }, []);

    if (!isLoaded) {
        return (
            <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background">
                {/* Dot Pattern Background */}
                <DotPattern
                    className={cn(
                        "absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                    )}
                    width={16}
                    height={16}
                    x={0}
                    y={0}
                    cx={1}
                    cy={1}
                    cr={1}
                />

                {/* Blur Fade Text Centered */}
                <section className="relative z-10 text-start">
                    <BlurFade delay={0.25} inView>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                            Hello James 👋
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.5} inView>
                        <span className="text-pretty text-xl tracking-tighter sm:text-3xl xl:text-4xl">
                            Welcome to your resource hub
                        </span>
                    </BlurFade>
                </section>
            </div>
        );
    }

    return <div>{children}</div>;
}
