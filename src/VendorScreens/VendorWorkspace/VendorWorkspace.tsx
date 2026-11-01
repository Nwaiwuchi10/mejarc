"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Api from "@/src/Utils/Api";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import "./VendorWorkspace.css";

// Import images
import newProjectsImg from "../../assests/images/To do list-rafiki 1.png";
import inProgressImg from "../../assests/images/To do list-amico 1.png";
import completedImg from "../../assests/images/Done-rafiki 1.png";
import revisionImg from "../../assests/images/Thinking face-cuate 1.png";

export default function VendorWorkspace() {
    const [counts, setCounts] = useState<{
        totalNewProjects: number;
        totalInProgressProjects: number;
        totalRevisionProjects: number;
        totalCompletedProjects: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const { userToken } = useSelector((state: any) => state.auth);

    useEffect(() => {
        const fetchCounts = async () => {
            if (!userToken) return;
            try {
                const res = await Api.get("/agent/project-counts", {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                setCounts(res.data);
            } catch (error) {
                console.error("Error fetching project counts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    const workspaceCards = [
        {
            id: "new",
            number: counts?.totalNewProjects?.toString() || "0",
            label: "New Projects",
            image: newProjectsImg,
            className: "vw__card--new",
            href: "/vendor/workspace/new",
        },
        {
            id: "progress",
            number: counts?.totalInProgressProjects?.toString() || "0",
            label: "In Progress",
            image: inProgressImg,
            className: "vw__card--progress",
            href: "/vendor/workspace/progress",
        },
        {
            id: "completed",
            number: counts?.totalCompletedProjects?.toString() || "0",
            label: "Completed",
            image: completedImg,
            className: "vw__card--completed",
            href: "/vendor/workspace/completed",
        },
        {
            id: "revision",
            number: counts?.totalRevisionProjects?.toString() || "0",
            label: "Revision",
            image: revisionImg,
            className: "vw__card--revision",
            href: "/vendor/workspace/revision",
        },
    ];

    if (loading) {
        return (
            <div className="vw flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#FFC700]" size={48} />
            </div>
        );
    }

    return (
        <div className="vw">
            <header className="vw__header">
                <h1>Workspace</h1>
            </header>

            <div className="vw__grid">
                {workspaceCards.map((card) => (
                    <Link key={card.id} href={card.href} className={`vw__card ${card.className}`}>
                        <div className="vw__card-content">
                            <span className="vw__card-number">{card.number}</span>
                            <span className="vw__card-label">{card.label}</span>
                        </div>
                        <div className="vw__card-image-wrap">
                            <Image
                                src={card.image}
                                alt={card.label}
                                className="vw__card-image"
                                width={200}
                                height={200}
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
