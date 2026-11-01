"use client";

import Image from "next/image";
import userImg from "../../assests/images/Niche service marketplace-amico 1.png";
import agentImg from "../../assests/images/Generating new leads-rafiki 1.png";
import bgimage from "../../assests/images/bgSignup.png"; // Import the background image
import { X } from "lucide-react";
import Link from "next/link";

export default function ChooseAccountType() {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgimage.src})` }}
    >
      {/* Dark Overlay with Blur - Matching Signup Page */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Main Container - Relative to sit above overlay */}
      <div className="relative z-10 w-full max-w-6xl rounded-2xl bg-white p-6 md:p-10 shadow-2xl">
        {/* Close button */}
        <button className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 transition-colors">
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Choose Your Account Type
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            Select whether you’re signing up as a Customer or an Agent. Each
            role has different features.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Guest / Customer */}
          <div className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md cursor-pointer">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Guest</h2>
                <span className="text-sm font-medium text-blue-600 group-hover:underline">
                  <Link href="/register" className="hover:underline">
                    Select →
                  </Link>
                </span>
              </div>

              <div className="relative mx-auto mb-6 aspect-[4/3] w-full max-w-sm">
                <Image
                  src={userImg}
                  alt="Guest illustration"
                  fill
                  className="object-contain"
                />
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">
                A customer is someone who comes to the platform to start and
                manage projects. They share what they need, track progress,
                approve work, and make payments securely.
              </p>
            </div>
          </div>

          {/* Agent */}
          <div className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md cursor-pointer">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Agent</h2>
                <span className="text-sm font-medium text-blue-600 group-hover:underline">
                  <Link href="/agent-register" className="hover:underline">
                    Select →
                  </Link>
                </span>
              </div>

              <div className="relative mx-auto mb-6 aspect-[4/3] w-full max-w-sm">
                <Image
                  src={agentImg}
                  alt="Agent illustration"
                  fill
                  className="object-contain"
                />
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">
                An agent is a freelancer who joins the platform to offer skills
                or digital products. They complete assigned projects, upload
                deliverables, and earn commissions for their work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
