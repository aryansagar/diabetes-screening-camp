"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "@/components/Header";
import * as XLSX from "xlsx";

type Patient = {
    id: number;
    name: string;
    contact_no: string;
    gender: string;
    age: number;
    address: string;
    bmi: number;
    weight: number;
    bp: string;
    random_blood_sugar: number;
    hba1c: number;
    known_diabetes: boolean;
    created_at: string;
};

export default function DashboardPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchPatients() {
        setLoading(true);

        const { data, error } = await supabase
            .from("patients")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            console.error("Fetch patients error:", error);
            setLoading(false);
            return;
        }

        setPatients(data || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchPatients();

        const exportHandler = () => {
            exportExcel();
        };

        window.addEventListener("export-excel", exportHandler);

        return () => {
            window.removeEventListener("export-excel", exportHandler);
        };
    }, []);

    function exportExcel() {
        if (patients.length === 0) {
            alert("No patient data available.");
            return;
        }

        const data = patients.map((patient, index) => ({
            "S.No": index + 1,
            Name: patient.name,
            "Contact No.": patient.contact_no,
            Gender: patient.gender,
            Age: patient.age,
            Address: patient.address,
            BMI: patient.bmi,
            "Weight (kg)": patient.weight,
            BP: patient.bp,
            "Random Blood Sugar": patient.random_blood_sugar,
            HbA1c: patient.hba1c,
            "Known Diabetes": patient.known_diabetes
                ? "Yes"
                : "No",
            "Registration Date": new Date(
                patient.created_at
            ).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Patients"
        );

        XLSX.writeFile(
            workbook,
            "diabetes-camp-patients.xlsx"
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-100">

            <Header />

            <main className="w-full px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">

                <div className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-xl bg-white shadow">

                    {/* LOADING */}
                    {loading ? (
                        <div className="p-8 text-center text-sm text-gray-500 sm:p-10">
                            Loading patient details...
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500 sm:p-10">
                            No patient records found.
                        </div>
                    ) : (

                        /* TABLE SCROLL CONTAINER */
                        <div className="max-h-[calc(100vh-220px)] overflow-auto">

                            <table className="min-w-[1200px] w-full text-xs sm:text-sm">

                                {/* TABLE HEADER */}
                                <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">

                                    <tr className="border-b">

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            ID
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            Name
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            Contact No.
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            Gender
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            Age
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            Address
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            BMI
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            Weight
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            BP
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            RBS
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            HbA1c
                                        </th>

                                        <th className="whitespace-nowrap px-3 py-3 text-left font-semibold sm:px-4 sm:py-4">
                                            Diabetes
                                        </th>

                                    </tr>

                                </thead>

                                {/* TABLE BODY */}
                                <tbody>

                                    {patients.map((patient) => (

                                        <tr
                                            key={patient.id}
                                            className="border-b transition hover:bg-gray-50"
                                        >

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.id}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 font-medium sm:px-4 sm:py-4">
                                                {patient.name}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.contact_no}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.gender}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.age}
                                            </td>

                                            <td className="max-w-xs truncate px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.address}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.bmi}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.weight} kg
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.bp}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.random_blood_sugar}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.hba1c}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                                                {patient.known_diabetes
                                                    ? "Yes"
                                                    : "No"}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}