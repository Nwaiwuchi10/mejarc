"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Edit3, Check, X, Camera, Loader2, Save } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/src/store/authSlice";
import Api from "@/src/Utils/Api";
import CustomModal from "@/src/components/Message/Message";

export default function ProfileSettingsScreen() {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Modal state
    const [modal, setModal] = useState<{
        isVisible: boolean;
        type: "success" | "error";
        message: string;
        title?: string;
    }>({
        isVisible: false,
        type: "success",
        message: "",
    });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        bio: "",
        address: {
            country: "",
            city: "",
            state: "",
            zipcode: "",
        }
    });

    // ... (rest of the state and useEffect)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.bio || "",
                address: {
                    country: user.address?.country || "",
                    city: user.address?.city || "",
                    state: user.address?.state || "",
                    zipcode: user.address?.zipcode || "",
                }
            });
            setPreviewUrl(user.profilePics || null);
        }
    }, [user]);

    const handleToggleEdit = () => {
        if (isEditing) {
            // If canceling, reset form data
            if (user) {
                setFormData({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    phoneNumber: user.phoneNumber || "",
                    bio: user.bio || "",
                    address: {
                        country: user.address?.country || "",
                        city: user.address?.city || "",
                        state: user.address?.state || "",
                        zipcode: user.address?.zipcode || "",
                    }
                });
                setPreviewUrl(user.profilePics || null);
            }
            setSelectedFile(null);
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const formDataToSubmit = new FormData();

            if (selectedFile) {
                formDataToSubmit.append("imgFile", selectedFile);
            }

            const dto = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                bio: formData.bio,
                address: formData.address,
            };

            formDataToSubmit.append("dto", JSON.stringify(dto));

            const res = await Api.patch("/user/profile", formDataToSubmit);

            const updatedUser = res.data;
            dispatch(setUser(updatedUser));
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setIsEditing(false);
            setModal({
                isVisible: true,
                type: "success",
                title: "Profile Updated",
                message: "Your profile information has been successfully updated.",
            });
        } catch (error: any) {
            console.error("Error updating profile:", error);
            setModal({
                isVisible: true,
                type: "error",
                title: "Update Failed",
                message: error?.response?.data?.message || "Failed to update profile. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Profile Header */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md transform transition-transform group-hover:scale-105">
                            <Image
                                src={previewUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName)}+${encodeURIComponent(formData.lastName)}&background=1a1a2e&color=fff&bold=true`}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                            />
                            {isEditing && (
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>
                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center border-4 border-white shadow-lg transition-colors ${isEditing ? 'bg-green-600' : 'bg-blue-600'}`}>
                            {isEditing ? <Check size={14} className="text-white" /> : <Edit3 size={14} className="text-white" />}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-[#1a1a2e] mb-1">
                            {isEditing ? `${formData.firstName} ${formData.lastName}` : (user.firstName + (user.lastName ? " " + user.lastName : ""))}
                        </h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{user.userType || "User"}</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                            {user.address?.city && user.address?.country ? `${user.address.city}, ${user.address.country}` : "Address not set"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Edit Mode</span>
                        <button
                            onClick={handleToggleEdit}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEditing ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditing ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>

                    {isEditing && (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all active:scale-95 disabled:bg-blue-400"
                        >
                            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
            </div>

            {/* Information Grid */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Personal Information</h3>
                    {isEditing && (
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest animate-pulse">Editing</span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">First Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="text-xs font-bold text-gray-900 py-3 border-b border-blue-200 focus:border-blue-600 outline-none w-full transition-colors bg-blue-50/30 px-2 rounded-t-lg"
                            />
                        ) : (
                            <div className="text-xs font-bold text-gray-900 py-3 border-b border-gray-50 w-full hover:border-blue-100 transition-colors">
                                {user.firstName || "Not provided"}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="text-xs font-bold text-gray-900 py-3 border-b border-blue-200 focus:border-blue-600 outline-none w-full transition-colors bg-blue-50/30 px-2 rounded-t-lg"
                            />
                        ) : (
                            <div className="text-xs font-bold text-gray-900 py-3 border-b border-gray-50 w-full hover:border-blue-100 transition-colors">
                                {user.lastName || "Not provided"}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="text-xs font-bold text-gray-900 py-3 border-b border-blue-200 focus:border-blue-600 outline-none w-full transition-colors bg-blue-50/30 px-2 rounded-t-lg"
                            />
                        ) : (
                            <div className="text-xs font-bold text-gray-900 py-3 border-b border-gray-50 w-full hover:border-blue-100 transition-colors">
                                {user.email || "Not provided"}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="text-xs font-bold text-gray-900 py-3 border-b border-blue-200 focus:border-blue-600 outline-none w-full transition-colors bg-blue-50/30 px-2 rounded-t-lg"
                            />
                        ) : (
                            <div className="text-xs font-bold text-gray-900 py-3 border-b border-gray-50 w-full hover:border-blue-100 transition-colors">
                                {user.phoneNumber || "Not provided"}
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bio</label>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={2}
                                className="text-xs font-bold text-gray-900 py-3 border-b border-blue-200 focus:border-blue-600 outline-none w-full transition-colors bg-blue-50/30 px-2 rounded-t-lg resize-none"
                            />
                        ) : (
                            <div className="text-xs font-bold text-gray-900 py-3 border-b border-gray-50 w-full hover:border-blue-100 transition-colors">
                                {user.bio || "Not provided"}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-12 mb-8 border-b border-gray-50 pb-4">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Address</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Country</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="country"
                                value={formData.address.country}
                                onChange={handleAddressChange}
                                className="text-xs font-bold text-gray-900 py-3 border-b border-blue-200 focus:border-blue-600 outline-none w-full transition-colors bg-blue-50/30 px-2 rounded-t-lg"
                            />
                        ) : (
                            <div className="text-xs font-bold text-gray-900 py-3 border-b border-gray-50 w-full hover:border-blue-100 transition-colors">
                                {user.address?.country || "Not provided"}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="city"
                                value={formData.address.city}
                                onChange={handleAddressChange}
                                className="text-xs font-bold text-gray-900 py-3 border-b border-blue-200 focus:border-blue-600 outline-none w-full transition-colors bg-blue-50/30 px-2 rounded-t-lg"
                            />
                        ) : (
                            <div className="text-xs font-bold text-gray-900 py-3 border-b border-gray-50 w-full hover:border-blue-100 transition-colors">
                                {user.address?.city || "Not provided"}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">State</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="state"
                                value={formData.address.state}
                                onChange={handleAddressChange}
                                className="text-xs font-bold text-gray-900 py-3 border-b border-blue-200 focus:border-blue-600 outline-none w-full transition-colors bg-blue-50/30 px-2 rounded-t-lg"
                            />
                        ) : (
                            <div className="text-xs font-bold text-gray-900 py-3 border-b border-gray-50 w-full hover:border-blue-100 transition-colors">
                                {user.address?.state || "Not provided"}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Postal Code</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="zipcode"
                                value={formData.address.zipcode}
                                onChange={handleAddressChange}
                                className="text-xs font-bold text-gray-900 py-3 border-b border-blue-200 focus:border-blue-600 outline-none w-full transition-colors bg-blue-50/30 px-2 rounded-t-lg"
                            />
                        ) : (
                            <div className="text-xs font-bold text-gray-900 py-3 border-b border-gray-50 w-full hover:border-blue-100 transition-colors">
                                {user.address?.zipcode || "Not provided"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Message Modal */}
            {modal.isVisible && (
                <CustomModal
                    type={modal.type}
                    title={modal.title}
                    message={modal.message}
                    onClose={() => setModal({ ...modal, isVisible: false })}
                />
            )}
        </div>
    );
}
