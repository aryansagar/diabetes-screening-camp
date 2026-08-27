"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "@/components/Header";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  contact_no: "",
  gender: "",
  age: "",
  address: "",
  bmi: "",
  weight: "",
  bp: "",
  random_blood_sugar: "",
  hba1c: "",
  known_diabetes: "",
};

export default function RegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      !form.name ||
      !form.contact_no ||
      !form.gender ||
      !form.age ||
      !form.address ||
      !form.bmi ||
      !form.weight ||
      !form.bp ||
      !form.random_blood_sugar ||
      !form.hba1c ||
      !form.known_diabetes
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Authentication error:", userError);

      setLoading(false);

      toast.error("You are not logged in. Please login again.");

      return;
    }

    const { error } = await supabase
      .from("patients")
      .insert({
        name: form.name.trim(),
        contact_no: form.contact_no.trim(),
        gender: form.gender,
        age: Number(form.age),
        address: form.address.trim(),
        bmi: Number(form.bmi),
        weight: Number(form.weight),
        bp: form.bp.trim(),
        random_blood_sugar: Number(form.random_blood_sugar),
        hba1c: Number(form.hba1c),
        known_diabetes: form.known_diabetes === "Yes",
      });

    setLoading(false);

    if (error) {
      console.error("Supabase insert error:", error);

      toast.error(error.message);

      return;
    }

    toast.success("Patient registered successfully!");

    setForm(initialForm);
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <Header />

      <main className="w-full px-3 py-5 sm:px-5 sm:py-7 md:px-6 md:py-10">

        <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-4 shadow-sm sm:p-6 md:p-8">

          {/* TITLE */}
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900 sm:mb-8 sm:text-2xl md:text-left">
            Patient Registration
          </h2>

          <form onSubmit={handleSubmit}>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">

              {/* NAME */}
              <div>
                <label className="label">
                  Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter patient name"
                  disabled={loading}
                />
              </div>

              {/* CONTACT */}
              <div>
                <label className="label">
                  Contact No. *
                </label>

                <input
                  name="contact_no"
                  value={form.contact_no}
                  onChange={handleChange}
                  type="tel"
                  inputMode="numeric"
                  className="input"
                  placeholder="Enter contact number"
                  disabled={loading}
                />
              </div>

              {/* GENDER */}
              <div>
                <label className="label">
                  Gender *
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input"
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* AGE */}
              <div>
                <label className="label">
                  Age *
                </label>

                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="120"
                  inputMode="numeric"
                  className="input"
                  placeholder="Enter age"
                  disabled={loading}
                />
              </div>

              {/* ADDRESS */}
              <div className="md:col-span-2">
                <label className="label">
                  Address *
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="input resize-y"
                  placeholder="Enter address"
                  disabled={loading}
                />
              </div>

              {/* BMI */}
              <div>
                <label className="label">
                  BMI *
                </label>

                <input
                  name="bmi"
                  value={form.bmi}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  className="input"
                  placeholder="Enter BMI"
                  disabled={loading}
                />
              </div>

              {/* WEIGHT */}
              <div>
                <label className="label">
                  Weight (kg) *
                </label>

                <input
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  className="input"
                  placeholder="Enter weight"
                  disabled={loading}
                />
              </div>

              {/* BP */}
              <div>
                <label className="label">
                  BP *
                </label>

                <input
                  name="bp"
                  value={form.bp}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. 120/80"
                  disabled={loading}
                />
              </div>

              {/* RANDOM BLOOD SUGAR */}
              <div>
                <label className="label">
                  Random Blood Sugar *
                </label>

                <input
                  name="random_blood_sugar"
                  value={form.random_blood_sugar}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  className="input"
                  placeholder="mg/dL"
                  disabled={loading}
                />
              </div>

              {/* HBA1C */}
              <div>
                <label className="label">
                  HbA1c *
                </label>

                <input
                  name="hba1c"
                  value={form.hba1c}
                  onChange={handleChange}
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  className="input"
                  placeholder="%"
                  disabled={loading}
                />
              </div>

              {/* DIABETES */}
              <div>
                <label className="label">
                  Known Diabetes *
                </label>

                <select
                  name="known_diabetes"
                  value={form.known_diabetes}
                  onChange={handleChange}
                  className="input"
                  disabled={loading}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => setForm(initialForm)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading ? "Saving..." : "Submit"}
              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}