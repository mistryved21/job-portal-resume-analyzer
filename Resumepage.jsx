import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import { FiDownload } from "react-icons/fi";
import { MdQrCodeScanner } from "react-icons/md";


function ATSScoreChecker() {
  const [formData, setFormData] = useState({
    jobDescription: "",
    fullName: "",
    aboutMe: "",
    phoneNumber: "",
    email: "",
    profilePicture: "",
    skills: [],
    workExperience: [],
    education: [],
    certifications: [],
  });


  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newWorkExperience, setNewWorkExperience] = useState("");
  const [newEducation, setNewEducation] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [ATSscore, setATSscore] = useState("");

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

  const radius = 60; // Circle radius
  const stroke = 10; // Stroke width
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (ATSscore / 100) * circumference;

  const getAtsScore = async () => {
    setIsLoading(true); // Start loading
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
    }finally {
      setIsLoading(false); // Stop loading
    }
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Add content to PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Resume", 105, 15, null, null, "center");
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  
    let y = 30; // Initial Y position
  
    const addText = (title, text) => {
      doc.setFont("helvetica", "bold");
      doc.text(title, 10, y);
      doc.setFont("helvetica", "normal");
      y += 6;
      doc.text(text, 10, y);
      y += 10;
    };
  
    addText("Full Name:", formData.fullName || "N/A");
    addText("Email:", formData.email || "N/A");
    addText("Phone:", formData.phoneNumber || "N/A");
    addText("About Me:", formData.aboutMe || "N/A");
    addText("Job Description:", formData.jobDescription || "N/A");
  
    if (formData.skills.length > 0) addText("Skills:", formData.skills.join(", "));
    if (formData.workExperience.length > 0) addText("Work Experience:", formData.workExperience.join("\n"));
    if (formData.education.length > 0) addText("Education:", formData.education.join("\n"));
    if (formData.certifications.length > 0) addText("Certifications:", formData.certifications.join("\n"));
  
    // Save and trigger download
    doc.save("Resume.pdf");
  };


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      {ATSscore === "Error" ? (
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <p className="text-red-600">Error calculating ATS score. Try again.</p>
         
          <button
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setATSscore("")}
          >
            Retry
          </button>
        </div>
      ) : ATSscore ? (
        <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full min-h-screen flex flex-col justify-center items-center">
          <p className="text-gray-700 text-lg font-bold">Your ATS Score is</p>
          {/* Circular Progress Bar */}
          <div className="relative w-40 h-40">
            <svg
              className="transform -rotate-90"
              width="100%"
              height="100%"
              viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            >
              {/* Background Circle */}
              <circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                fill="transparent"
                stroke="gray"
                strokeWidth={stroke}
                strokeOpacity="0.2"
              />
              {/* Progress Circle */}
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
                className="transition-all duration-500"
              />
            </svg>
            {/* Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-blue-500">{ATSscore}%</h1>
            </div>
          </div>
          {/* Retry Button */}
          <button
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setATSscore("")}
          >
            Check Again
          </button>
        </div>
   
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">ATS Score Checker</h1>

           {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-4">
          {formData.profilePicture && (
            <img src={formData.profilePicture} alt="Profile" className="w-24 h-24 rounded-full mb-2" />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <label className="block text-gray-700">Full Name</label>
          <input
            name="fullName"
            className="w-full p-2 border border-gray-300 rounded-md mb-3"
            value={formData.fullName}
            onChange={handleChange}
          />
         {/* Contact Details */}
        
               
        <label className="block text-gray-700">Email</label>
        <input name="email" type="email" className="w-full p-2 border border-gray-300 rounded-md mb-3" 
        value={formData.email} onChange={handleChange} />
        
        <label className="block text-gray-700">Phone Number</label>
        <input name="phoneNumber" className="w-full p-2 border border-gray-300 rounded-md mb-3" 
        value={formData.phoneNumber} onChange={handleChange} />

        
          <label className="block text-gray-700">Job Description</label>
          <textarea
            name="jobDescription"
            className="w-full p-2 border border-gray-300 rounded-md mb-3"
            value={formData.jobDescription}
            onChange={handleChange}
          />
          <label className="block text-gray-700">About Me</label>
          <textarea
            name="aboutMe"
            className="w-full p-2 border border-gray-300 rounded-md mb-3"
            value={formData.aboutMe}
            onChange={handleChange}
          />

          {/* Skills */}
          <label className="block text-gray-700">Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills.map((item, index) => (
              <span key={index} className="flex items-center bg-blue-100 px-3 py-1 rounded-lg">
                {item} <IoCloseOutline className="ml-2 text-red-500 cursor-pointer" onClick={() => handleRemoveItem("skills", index)} />
              </span>
            ))}
          </div>
          <input
            placeholder="Add Skill"
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4" onClick={() => handleAddItem("skills", newSkill, setNewSkill)}>
            Add
          </button>

          {/* Work Experience */}
          <label className="block text-gray-700">Work Experience</label>
          <input
            placeholder="Add Work Experience"
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            value={newWorkExperience}
            onChange={(e) => setNewWorkExperience(e.target.value)}
          />

         {/* Education Certification List */}
        <label className="block text-gray-700">Education Certification</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.education.map((item, index) => (
            <span key={index} className="flex items-center bg-blue-100 px-3 py-1 rounded-lg">
              {item}
              <IoCloseOutline
                className="ml-2 text-red-500 cursor-pointer"
                onClick={() => handleRemoveItem("education", index)}
              />
            </span>
          ))}
        </div>
        <input
          placeholder="Add Education"
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          value={newEducation}
          onChange={(e) => setNewEducation(e.target.value)}
        />
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
            onClick={() => handleAddItem("education", newEducation, setNewEducation)}
          >
            Add
          </button>

          {/* Certifications List */}
          <label className="block text-gray-700">Other Certifications</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.certifications.map((item, index) => (
              <span key={index} className="flex items-center bg-green-100 px-3 py-1 rounded-lg">
                {item}
                <IoCloseOutline
                  className="ml-2 text-red-500 cursor-pointer"
                  onClick={() => handleRemoveItem("certifications", index)}
                />
              </span>
            ))}
          </div>
          <input
            placeholder="Add Certification"
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
            onClick={() => handleAddItem("certifications", newCertification, setNewCertification)}
          >
            Add
          </button>
          <div className="flex items-center gap-x-4 mt-4">
  {/* Scan Button - Left */}
  <button
    className="bg-white-500 text-black px-6 py-3 rounded-md font-bold text-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
    onClick={getAtsScore}
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <MdQrCodeScanner className="animate-spin text-xl" /> Scanning...
      </>
    ) : (
      <>
        <MdQrCodeScanner className="text-xl" /> Scan
      </>
    )}
  </button>
<button
  className="bg-white-500 text-black px-3 py-3 rounded-md font-bold text-sm flex items-center justify-right gap-2"
  onClick={handleDownloadPDF}
  disabled={isDownloading}
>
  {isDownloading ? (
    <>
      <FiDownload className="animate-spin text-lg" /> Downloading...
    </>
  ) : (
    <>
      <FiDownload className="text-lg" />
      Download Resume
    </>
  )}
</button>
</div>
        </div>
      )}
    </div>
  );
}

export default ATSScoreChecker;
