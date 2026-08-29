import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { MdQrCodeScanner } from "react-icons/md";
import jsPDF from "jspdf";

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    Summary: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    profilePicture: "",
    skills: [],
    workExperience: [],
    education: [],
    certifications: [],
  });

  const [templateColor, setTemplateColor] = useState("#2563EB"); // Tailwind's blue-600
  const [fontStyle, setFontStyle] = useState("sans-serif");
  const [ATSscore, setATSscore] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newEducation, setNewEducation] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = (type, value, setter) => {
    if (value.trim() !== "") {
      setFormData({ ...formData, [type]: [...formData[type], value] });
      setter("");
    }
  };

  const handleRemoveItem = (type, index) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getAtsScore = async () => {
    setIsLoading(true);
    const GOOGLE_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = `
      Given the following resume:
      ${JSON.stringify(formData)}
      Estimate the ATS score (0-100) and provide only the numerical value.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }], role: "user" }],
        }),
      });

      const resJson = await response.json();
      const rawScore = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || "Error";
      const parsedScore = parseFloat(rawScore);
      setATSscore(
        isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100 ? "Error" : parsedScore.toString()
      );
    } catch (error) {
      console.error("API Error:", error);
      setATSscore("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Resume", 105, 15, null, null, "center");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let y = 30;

    const addText = (title, text) => {
      doc.setFont("helvetica", "bold");
      doc.text(title, 10, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(text, 10, y);
      y += 10;
    };

    addText("Full Name:", formData.fullName || "N/A");
    addText("Email:", formData.email || "N/A");
    addText("Phone:", formData.phoneNumber || "N/A");
    addText("Summary:", formData.Summary || "N/A");
    if (formData.skills.length > 0) addText("Skills:", formData.skills.join(", "));
    if (formData.education.length > 0) addText("Education:", formData.education.join("\n"));
    if (formData.certifications.length > 0) addText("Certifications:", formData.certifications.join("\n"));

    doc.save("Resume.pdf");
  };

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (ATSscore / 100) * circumference;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Panel */}
      <div className="w-full md:w-1/4 bg-white p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Customize</h2>
        <label className="block text-sm mb-1">Color Theme</label>
        <input
          type="color"
          value={templateColor}
          onChange={(e) => setTemplateColor(e.target.value)}
          className="w-16 h-8 mb-4 border rounded"
        />
        <label className="block text-sm mb-1">Font Style</label>
        <select
          value={fontStyle}
          onChange={(e) => setFontStyle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="sans-serif">Sans</option>
          <option value="serif">Serif</option>
          <option value="monospace">Mono</option>
        </select>
        <label className="block text-sm font-semibold mb-2">Profile Picture</label>
        {formData.profilePicture && (
          <img src={formData.profilePicture} alt="Profile" className="w-24 h-24 rounded-full mb-2" />
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* Center Resume Preview */}
      <div className="w-full md:w-2/4 overflow-y-auto p-6" style={{ fontFamily: fontStyle }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: templateColor }}>
          {formData.fullName || "Your Name"}
        </h1>
        <p>{formData.email} | {formData.phoneNumber}</p>
        <hr className="my-3" />
        <h2 className="font-bold text-xl mb-1">Summary</h2>
        <textarea
          className="w-full border p-2 mb-4"
          name="Summary"
          value={formData.Summary}
          onChange={handleChange}
        />
        <h2 className="font-bold text-xl mb-1">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.skills.map((skill, i) => (
            <span key={i} className="bg-blue-100 px-2 py-1 rounded">
              {skill}{" "}
              <IoCloseOutline
                className="inline text-red-500 cursor-pointer"
                onClick={() => handleRemoveItem("skills", i)}
              />
            </span>
          ))}
        </div>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Add Skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => handleAddItem("skills", newSkill, setNewSkill)}
        >
          Add Skill
        </button>

        <h2 className="font-bold text-xl mt-4 mb-1">Education</h2>
        {formData.education.map((edu, i) => (
          <p key={i} className="mb-1">
            {edu}{" "}
            <IoCloseOutline
              className="inline text-red-500 cursor-pointer"
              onClick={() => handleRemoveItem("education", i)}
            />
          </p>
        ))}
        <input
          className="border p-2 w-full mb-2"
          placeholder="Add Education"
          value={newEducation}
          onChange={(e) => setNewEducation(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => handleAddItem("education", newEducation, setNewEducation)}
        >
          Add Education
        </button>

        <h2 className="font-bold text-xl mt-4 mb-1">Certifications</h2>
        {formData.certifications.map((cert, i) => (
          <p key={i} className="mb-1">
            {cert}{" "}
            <IoCloseOutline
              className="inline text-red-500 cursor-pointer"
              onClick={() => handleRemoveItem("certifications", i)}
            />
          </p>
        ))}
        <input
          className="border p-2 w-full mb-2"
          placeholder="Add Certification"
          value={newCertification}
          onChange={(e) => setNewCertification(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => handleAddItem("certifications", newCertification, setNewCertification)}
        >
          Add Certification
        </button>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/4 bg-white p-6 border-l flex flex-col items-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center gap-2"
          onClick={getAtsScore}
          disabled={isLoading}
        >
          <MdQrCodeScanner className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Scanning..." : "Scan ATS"}
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 mb-4"
          onClick={handleDownloadPDF}
        >
          <FiDownload /> Download
        </button>

        {ATSscore && ATSscore !== "Error" && (
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold mb-2">ATS Score</h3>
            <div className="relative w-32 h-32">
              <svg
                className="transform -rotate-90"
                width="100%"
                height="100%"
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
              >
                <circle
                  cx={radius}
                  cy={radius}
                  r={normalizedRadius}
                  fill="transparent"
                  stroke="#ccc"
                  strokeWidth={stroke}
                  strokeOpacity="0.3"
                />
                <circle
                  cx={radius}
                  cy={radius}
                  r={normalizedRadius}
                  fill="transparent"
                  stroke={templateColor}
                  strokeWidth={stroke}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-blue-600">{ATSscore}%</h1>
              </div>
            </div>
          </div>
        )}

        {ATSscore === "Error" && (
          <div className="text-red-500 mt-4">Error fetching ATS Score</div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
