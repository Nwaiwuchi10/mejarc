"use client";

import React, { useState } from "react";
import {
  Upload,
  MessageSquare,
  CheckCircle2,
  FileText,
  AlertCircle,
  Clock,
  ArrowRight,
  User,
} from "lucide-react";

interface ActivityLogProps {
  activities: any[];
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  const [filter, setFilter] = useState<string>("all");

  const getIcon = (type: string) => {
    if (!type) return <AlertCircle className="w-5 h-5 text-gray-600" />;
    
    switch (type.toLowerCase()) {
      case "upload":
      case "file_upload":
        return <Upload className="w-5 h-5 text-blue-600" />;
      case "message":
      case "comment":
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case "milestone_completed":
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "milestone_created":
      case "update":
        return <FileText className="w-5 h-5 text-purple-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const groupActivitiesByDate = (acts: any[]) => {
    if (!acts) return {};
    const grouped: { [key: string]: any[] } = {};
    acts.forEach((activity) => {
      const date = new Date(activity.createdAt).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const displayDate = date === today ? "Today" : date;
      
      if (!grouped[displayDate]) {
        grouped[displayDate] = [];
      }
      grouped[displayDate].push(activity);
    });
    return grouped;
  };

  const filteredActivities = (!activities ? [] : activities).filter((a) => {
    if (filter === "all") return true;
    if (filter === "upload") return a.type.includes("upload") || a.type.includes("file");
    if (filter === "message") return a.type.includes("message") || a.type.includes("comment");
    if (filter === "completed") return a.type.includes("completed");
    return a.type === filter;
  });

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8 rounded-md border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end border-b border-gray-50 pb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Project Activity Log
          </h1>
          <p className="text-gray-400 text-sm">
            Automatic tracking of all modifications and communications
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-blue-600 text-xs font-bold">
           <Clock size={14} />
           {activities?.length || 0} Total Actions
        </div>
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        {["all", "upload", "message", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all border ${
              filter === f
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === "all" ? "Activities" : ""}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Continuous timeline line */}
        <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gray-50"></div>

        {Object.entries(groupedActivities).length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-300">
             <Clock size={48} className="mb-4 opacity-20" />
             <p className="text-sm italic">No activities found matching segments.</p>
          </div>
        ) : (
          Object.entries(groupedActivities).map(([date, dayActivities], dateIdx) => (
            <div key={date} className="mb-12 relative">
              {/* Date Header */}
              <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white border-4 border-gray-50 flex items-center justify-center z-10 shadow-sm font-bold text-gray-800 text-[10px]">
                   {date === "Today" ? "NOW" : (dateIdx + 1)}
                </div>
                <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  {date}
                </h2>
              </div>

              {/* Activities for this date */}
              <div className="space-y-10 pl-14">
                {dayActivities.map((activity) => (
                  <div key={activity.id} className="relative group">
                    {/* Activity content card */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 group-hover:border-blue-200 transition-all group-hover:shadow-lg group-hover:shadow-blue-50/50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                            {getIcon(activity.type)}
                          </div>
                          <div>
                            <h3 className="text-[14px] font-bold text-gray-800">
                              {activity.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                              <User size={10} />
                              <span className="font-semibold">{activity.user?.name || "System"}</span>
                              <span className="opacity-30">•</span>
                              <span>{new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[13px] text-gray-500 leading-relaxed border-l-2 border-gray-100 pl-4 py-1 ml-2">
                        {activity.description}
                      </p>

                      <div className="mt-4 flex justify-end">
                        <button className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Details <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary Footer */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-50 pt-10">
          <div className="p-4 bg-gray-50 rounded-xl">
             <p className="text-[10px] font-bold text-gray-400 uppercase">Updates</p>
             <p className="text-xl font-black text-gray-800 mt-1">{activities?.filter(a => a.type.includes('update')).length || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
             <p className="text-[10px] font-bold text-gray-400 uppercase">Files</p>
             <p className="text-xl font-black text-gray-800 mt-1">{activities?.filter(a => a.type.includes('upload')).length || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
             <p className="text-[10px] font-bold text-gray-400 uppercase">Messages</p>
             <p className="text-xl font-black text-gray-800 mt-1">{activities?.filter(a => a.type.includes('message') || a.type.includes('comment')).length || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
             <p className="text-[10px] font-bold text-gray-400 uppercase">Milestones</p>
             <p className="text-xl font-black text-gray-800 mt-1">{activities?.filter(a => a.type.includes('completed')).length || 0}</p>
          </div>
      </div>
    </div>
  );
}
