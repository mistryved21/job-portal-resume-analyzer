import React from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiX,
} from "react-icons/fi";

const TemplateOne = ({ formData, themeColor, setFormData, editable }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (key, index, newValue) => {
    const updated = [...formData[key]];
    updated[index] = newValue;
    handleChange(key, updated);
  };

  const removeArrayItem = (key, index) => {
    const updated = [...formData[key]];
    updated.splice(index, 1);
    handleChange(key, updated);
  };

  const removeAdditionalSectionItem = (sectionIndex, itemIndex) => {
    const updated = [...formData.additionalSections];
    updated[sectionIndex].items.splice(itemIndex, 1);
    handleChange("additionalSections", updated);
  };

  const removeAdditionalSection = (sectionIndex) => {
    const updated = [...formData.additionalSections];
    updated.splice(sectionIndex, 1);
    handleChange("additionalSections", updated);
  };

  return (
    <div className={`max-w-3xl mx-auto p-8 rounded-lg shadow bg-white border-t-8 border-${themeColor}-500`}>
      {/* Profile Picture and Name */}
      <div className="flex items-center gap-6">
        {formData.profilePicture && (
          <img
            src={formData.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        )}
        <div>
          <h1 className={`text-3xl font-bold text-${themeColor}-600`}>
            {editable ? (
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="bg-transparent border-b border-gray-300 focus:outline-none"
              />
            ) : (
              formData.fullName
            )}
          </h1>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-4 text-sm text-gray-700 space-y-1">
        <div className="flex items-center gap-2">
          <FiMail />
          {editable ? (
            <input
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
            />
          ) : (
            formData.email
          )}
        </div>
        <div className="flex items-center gap-2">
          <FiPhone />
          {editable ? (
            <input
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
            />
          ) : (
            formData.phoneNumber
          )}
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin />
          {editable ? (
            <input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
            />
          ) : (
            formData.address
          )}
        </div>
        {formData.linkedin && (
          <div className="flex items-center gap-2">
            <FiLinkedin />
            {editable ? (
              <>
                <input
                  value={formData.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                />
                <button onClick={() => handleChange("linkedin", "")} className="ml-auto text-red-500">
                  <FiX />
                </button>
              </>
            ) : (
              <a href={formData.linkedin} className="text-blue-600 underline" target="_blank">
                {formData.linkedin}
              </a>
            )}
          </div>
        )}
        {formData.github && (
          <div className="flex items-center gap-2">
            <FiGithub />
            {editable ? (
              <>
                <input
                  value={formData.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                  className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                />
                <button onClick={() => handleChange("github", "")} className="ml-auto text-red-500">
                  <FiX />
                </button>
              </>
            ) : (
              <a href={formData.github} className="text-blue-600 underline" target="_blank">
                {formData.github}
              </a>
            )}
          </div>
        )}
      </div>

      {/* About Me */}
      <div className="mt-6">
        <h2 className={`text-xl font-semibold text-${themeColor}-600`}>About Me</h2>
        <p className="mt-1 text-gray-700">
          {editable ? (
            <textarea
              value={formData.aboutMe}
              onChange={(e) => handleChange("aboutMe", e.target.value)}
              className="w-full bg-transparent border border-gray-300 rounded p-2 mt-1"
            />
          ) : (
            formData.aboutMe
          )}
        </p>
      </div>

      {/* Skills */}
      <div className="mt-6">
        <h2 className={`text-xl font-semibold text-${themeColor}-600`}>Skills</h2>
        <ul className="text-gray-700 mt-2 space-y-1">
          {formData.skills.map((skill, index) => (
            <li key={index} className="flex items-center justify-between">
              {editable ? (
                <>
                  <input
                    value={skill}
                    onChange={(e) => handleArrayChange("skills", index, e.target.value)}
                    className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                  />
                  <button onClick={() => removeArrayItem("skills", index)} className="text-red-500 ml-2">
                    <FiX />
                  </button>
                </>
              ) : (
                <span>{skill}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Work Experience */}
      <div className="mt-6">
        <h2 className={`text-xl font-semibold text-${themeColor}-600`}>Work Experience</h2>
        <ul className="text-gray-700 mt-2 space-y-1">
          {formData.workExperience.map((exp, index) => (
            <li key={index} className="flex items-center justify-between">
              {editable ? (
                <>
                  <input
                    value={exp}
                    onChange={(e) => handleArrayChange("workExperience", index, e.target.value)}
                    className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                  />
                  <button onClick={() => removeArrayItem("workExperience", index)} className="text-red-500 ml-2">
                    <FiX />
                  </button>
                </>
              ) : (
                <span>{exp}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Education */}
      <div className="mt-6">
        <h2 className={`text-xl font-semibold text-${themeColor}-600`}>Education</h2>
        <ul className="text-gray-700 mt-2 space-y-1">
          {formData.education.map((edu, index) => (
            <li key={index} className="flex items-center justify-between">
              {editable ? (
                <>
                  <input
                    value={edu}
                    onChange={(e) => handleArrayChange("education", index, e.target.value)}
                    className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                  />
                  <button onClick={() => removeArrayItem("education", index)} className="text-red-500 ml-2">
                    <FiX />
                  </button>
                </>
              ) : (
                <span>{edu}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Additional Sections */}
      {formData.additionalSections?.map((section, secIndex) => (
        <div className="mt-6" key={secIndex}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold text-${themeColor}-600`}>
              {editable ? (
                <input
                  value={section.title}
                  onChange={(e) => {
                    const updated = [...formData.additionalSections];
                    updated[secIndex].title = e.target.value;
                    handleChange("additionalSections", updated);
                  }}
                  className="bg-transparent border-b border-gray-300 focus:outline-none"
                />
              ) : (
                section.title
              )}
            </h2>
            {editable && (
              <button onClick={() => removeAdditionalSection(secIndex)} className="text-red-500">
                <FiX />
              </button>
            )}
          </div>
          <ul className="text-gray-700 mt-2 space-y-1">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-center justify-between">
                {editable ? (
                  <>
                    <input
                      value={item}
                      onChange={(e) => {
                        const updated = [...formData.additionalSections];
                        updated[secIndex].items[itemIndex] = e.target.value;
                        handleChange("additionalSections", updated);
                      }}
                      className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                    />
                    <button
                      onClick={() => removeAdditionalSectionItem(secIndex, itemIndex)}
                      className="text-red-500 ml-2"
                    >
                      <FiX />
                    </button>
                  </>
                ) : (
                  <span>{item}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TemplateOne;
