"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { supabase } from "@/app/lib/supabase";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const isRegistrationPage = pathname === "/registration";

    async function logout() {
        await supabase.auth.signOut();
        router.push("/login");
    }

    async function exportExcel() {
        try {
            const { data, error } = await supabase
                .from("patients")
                .select("*")
                .order("created_at", { ascending: true });
    
            if (error) {
                console.error("Export error:", error);
                alert("Unable to export patient data.");
                return;
            }
    
            if (!data || data.length === 0) {
                alert("No patient data available to export.");
                return;
            }
    
            // Select only the columns you want in Excel
            const excelData = data.map((patient, index) => ({
                "S.No": index + 1,
                "Name": patient.name,
                "Contact No.": patient.contact_no,
                "Gender": patient.gender,
                "Age": patient.age,
                "Address": patient.address,
                "BMI": patient.bmi,
                "Weight (kg)": patient.weight,
                "BP": patient.bp,
                "Random Blood Sugar": patient.random_blood_sugar,
                "HbA1c": patient.hba1c,
                "Known Diabetes": patient.known_diabetes
                    ? "Yes"
                    : "No",
            }));
    
            const worksheet = XLSX.utils.json_to_sheet(excelData);
    
            const workbook = XLSX.utils.book_new();
    
            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Patients"
            );
    
            XLSX.writeFile(
                workbook,
                "diabetes-screening-patients.xlsx"
            );
    
        } catch (error) {
            console.error("Excel export error:", error);
            alert("Something went wrong while exporting.");
        }
    }

    return (
        <header className="border-b bg-white shadow-sm">

            <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 py-3 sm:px-6 lg:min-h-[80px] lg:flex-row lg:items-center lg:py-0">

                {/* TOP / LEFT SECTION */}
                <div className="flex w-full items-center justify-between lg:w-1/3 lg:justify-start">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src="/Lions.svg"
                            alt="Lions Clubs International"
                            width={120}
                            height={60}
                            className="h-14 w-auto object-contain sm:h-16"
                        />
                    </div>

                    {/* Mobile Title */}
                    <h1 className="text-center text-base font-bold tracking-wide text-blue-900 sm:text-lg lg:hidden">
                        DIABETES SCREENING CAMP
                    </h1>

                </div>

                {/* DESKTOP CENTER TITLE */}
                <div className="hidden w-1/3 justify-center lg:flex">
                    <h1 className="whitespace-nowrap text-xl font-bold tracking-wide text-blue-900">
                        DIABETES SCREENING CAMP
                    </h1>
                </div>

                {/* ACTIONS */}
                <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-2 sm:gap-3 lg:mt-0 lg:w-1/3 lg:justify-end">

                    {/* Registration → Dashboard */}
                    {isRegistrationPage ? (
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="rounded-md bg-blue-700 px-3 py-2 text-xs font-medium text-white hover:bg-blue-800 sm:px-4 sm:text-sm"
                        >
                            Dashboard
                        </button>
                    ) : (
                        <>
                            {/* Dashboard → New Registration */}
                            <button
                                onClick={() => router.push("/registration")}
                                className="rounded-md bg-blue-700 px-3 py-2 text-xs font-medium text-white hover:bg-blue-800 sm:px-4 sm:text-sm"
                            >
                                New Registration
                            </button>

                            {/* Export Excel */}
                            <button
                                onClick={exportExcel}
                                className="rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 sm:px-4 sm:text-sm"
                            >
                                Export Excel
                            </button>
                        </>
                    )}

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-4 sm:text-sm"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </header>
    );
}