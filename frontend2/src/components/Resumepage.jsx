import React, { useState } from "react";
import { MdQrCodeScanner } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import TemplateOne from "./templates/TemplateOne";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [themeColor, setThemeColor] = useState("blue");
  const [ATSscore, setATSscore] = useState("");
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Shruti Prajapati",
    email: "shruti@gmail.com",
    phoneNumber: "9624575846",
    address: "Baroda, India 39420",
    linkedin: "https://linkedin.com/in/shruti",
    github: "https://github.com/shrutidev",
    aboutMe:
      "Adaptable professional with a quick-learning ability and a talent for adjusting to new environments. Skilled in rapidly acquiring new knowledge and applying it effectively.",
    skills: [
      "Written communication",
      "Data entry",
      "Multitasking",
      "Google Drive",
      "Project planning",
      "Research",
      "Team building",
    ],
    workExperience: [
      "Backend Developer, HR, Mumbai, India (03/2025 - Current)",
      "Implemented coaching mechanisms to improve application performance and reduce server load.",
      "Coordinated installation of software systems and collaborated with user experience team.",
    ],
    education: ["S. High Secondary, Baroda", "BCA: MCA (Expected in 05/2026)"],
    profilePicture: "",
    additionalSections: [],
  });

  const addSection = () => {
    const newSection = prompt("Enter new section title (e.g., Certifications):");
    if (newSection) {
      setFormData((prev) => ({
        ...prev,
        additionalSections: [
          ...(prev.additionalSections || []),
          { title: newSection, items: ["New Item"] },
        ],
      }));
    }
  };

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (ATSscore / 100) * circumference;

  const getAtsScore = async () => {
    setIsLoading(true);
    setATSscore("");
    setMissingKeywords([]);
    setSuggestions([]);

    const GOOGLE_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    const prompt = `
You are an ATS (Applicant Tracking System) scanner.
Given this resume data:\n${JSON.stringify(formData)}

1. Provide the ATS score (0 to 100).
2. List any missing keywords commonly expected in modern resumes.
3. Suggest improvements to increase the ATS score.

Respond in this exact JSON format:
{
  "score": number,
  "missingKeywords": [ "keyword1", "keyword2" ],
  "suggestions": [ "suggestion1", "suggestion2" ]
}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }], role: "user" }],
        }),
      });

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonStart = reply.indexOf("{");
      const jsonEnd = reply.lastIndexOf("}") + 1;
      const jsonString = reply.slice(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonString);

      setATSscore(parsed.score || "Error");
      setMissingKeywords(parsed.missingKeywords || []);
      setSuggestions(parsed.suggestions || []);
    } catch (error) {
      console.error("ATS scan error:", error);
      setATSscore("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) return;

    const canvas = await html2canvas(resumeElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  const handleDownloadDOC = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: formData.fullName, bold: true, size: 32 })],
            }),
            new Paragraph(`${formData.email} | ${formData.phoneNumber}`),
            new Paragraph(formData.address),
            new Paragraph({ text: "About Me", bold: true }),
            new Paragraph(formData.aboutMe),
            new Paragraph({ text: "Skills", bold: true }),
            ...formData.skills.map((skill) => new Paragraph("• " + skill)),
            new Paragraph({ text: "Work Experience", bold: true }),
            ...formData.workExperience.map((exp) => new Paragraph("• " + exp)),
            new Paragraph({ text: "Education", bold: true }),
            ...formData.education.map((edu) => new Paragraph("• " + edu)),
            ...formData.additionalSections.map((section) => [
              new Paragraph({ text: section.title, bold: true }),
              ...section.items.map((item) => new Paragraph("• " + item)),
            ]).flat(),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Left Sidebar */}
      <div className="w-[250px] bg-white p-4 shadow-md flex flex-col gap-6">
        <h2 className="text-lg font-bold text-gray-700">Templates</h2>
        <div className="flex flex-col gap-2">
          <button
            className={`border rounded p-1 ${
              selectedTemplate === "template1" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedTemplate("template1")}
          >
            <img src="/template1-thumb.png" alt="Template 1" />
          </button>
        </div>

        <h2 className="mt-6 text-lg font-bold text-gray-700">Colors</h2>
        <div className="flex gap-3">
          {["blue", "gray", "green", "red", "purple"].map((color) => (
            <div
              key={color}
              onClick={() => setThemeColor(color)}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                themeColor === color ? "border-black" : "border-white"
              } bg-${color}-500`}
            ></div>
          ))}
        </div>

        <button
          className="mt-6 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded"
          onClick={addSection}
        >
          + Add Section
        </button>
      </div>

      {/* Center Preview */}
      <div className="flex-1 p-6 overflow-auto">
        <div id="resume-preview">
          {selectedTemplate === "template1" && (
            <TemplateOne
              formData={formData}
              themeColor={themeColor}
              setFormData={setFormData}
              editable
            />
          )}
        </div>

        {/* Show Score */}
        {ATSscore && ATSscore !== "Error" && (
          <div className="mt-6 text-center">
            <div className="relative w-40 h-40 mx-auto">
              <svg className="transform -rotate-90" width="100%" height="100%" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
                <circle
                  cx={radius}
                  cy={radius}
                  r={normalizedRadius}
                  fill="transparent"
                  stroke="gray"
                  strokeWidth={stroke}
                  strokeOpacity="0.2"
                />
                <circle
                  cx={radius}
                  cy={radius}
                  r={normalizedRadius}
                  fill="transparent"
                  stroke="blue"
                  strokeWidth={stroke}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-blue-600">{ATSscore}%</h1>
              </div>
            </div>

            {/* Show Missing Keywords */}
            {missingKeywords.length > 0 && (
              <div className="mt-6 text-left max-w-xl mx-auto">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Missing Keywords:</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {missingKeywords.map((kw, i) => (
                    <li key={i}>{kw}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-6 text-left max-w-xl mx-auto">
                <h2 className="text-xl font-semibold text-green-600 mb-2">Suggestions to Improve:</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {ATSscore === "Error" && (
          <p className="text-center text-red-600 font-semibold mt-4">
            Error fetching ATS score. Try again.
          </p>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-[250px] bg-white p-4 shadow-md flex flex-col items-center gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded flex items-center gap-2 w-full justify-center"
          onClick={getAtsScore}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <MdQrCodeScanner className="animate-spin text-xl" /> Scanning...
            </>
          ) : (
            <>
              <MdQrCodeScanner className="text-xl" />
              Scan ATS
            </>
          )}
        </button>

        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded flex items-center gap-2 w-full justify-center"
          onClick={handleDownloadPDF}
        >
          <FiDownload className="text-xl" /> Download PDF
        </button>

        <button
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded flex items-center gap-2 w-full justify-center"
          onClick={handleDownloadDOC}
        >
          <FiDownload className="text-xl" /> Download DOCX
        </button>
      </div>
    </div>
  );
};

export default ResumeBuilder;
