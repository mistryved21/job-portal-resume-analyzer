import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const FilterData = [
  {
    filterType: "Location",
    array: ["Delhi", "Bangalore", "Pune", "Mumbai", "Hyderabad", "Surat", "Noida", "Ahmedabad"],
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Data Science",
      "Full Stack Developer",
      "DevOps",
      "UI/UX Developer",
      "Software Engineering",
      "Software Tester",
      "Android Developer",
    ],
  },
  {
    filterType: "Job Type",
    array: ["Full Time", "Part Time", "Internship", "Freelance"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [searchQuery, setSearchQuery] = useState({}); // Stores search input per filter type
  const dispatch = useDispatch();

  // Handle radio selection
  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  // Dispatch selected value
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  // Handle search input change
  const handleSearchChange = (filterType, value) => {
    setSearchQuery((prev) => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg max-h-[800px] overflow-y-auto">
      <h1 className="font-bold text-lg text-gray-800 mb-3">Filter Jobs</h1>
      <hr className="mb-3" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {FilterData.map((data, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-semibold text-md text-gray-700 mb-2">{data.filterType}</h2>
            {/* Search input for filtering options */}
            <input
              type="text"
              placeholder={`Search ${data.filterType.toLowerCase()}...`}
              value={searchQuery[data.filterType] || ""}
              onChange={(e) => handleSearchChange(data.filterType, e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="space-y-1 max-h-[150px] overflow-y-auto">
              {data.array
                .filter((item) =>
                  item.toLowerCase().includes((searchQuery[data.filterType] || "").toLowerCase())
                )
                .map((item, idx) => {
                  const itemId = `r${index}-${idx}`;
                  return (
                    <div
                      key={itemId}
                      className="flex items-center space-x-2 p-1 cursor-pointer hover:bg-gray-100 rounded-md transition"
                    >
                      <RadioGroupItem value={item} id={itemId} className="h-4 w-4" />
                      <Label htmlFor={itemId} className="text-sm text-gray-700">
                        {item}
                      </Label>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
