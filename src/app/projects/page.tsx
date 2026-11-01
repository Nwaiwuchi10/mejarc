import CustomerLayout from "@/src/Screens/CustomerLayout/CustomerLayout";
import ProjectScreen from "@/src/Screens/Customer/Project/ProjectScreen";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

const ProjectsPage = () => {
    return (
        <CustomerLayout>
            <Suspense fallback={
                <div className="flex h-[60vh] items-center justify-center bg-white">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                </div>
            }>
                <ProjectScreen />
            </Suspense>
        </CustomerLayout>
    );
};

export default ProjectsPage;
