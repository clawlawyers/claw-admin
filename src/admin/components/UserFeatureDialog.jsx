import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

const UserFeatureDialog = ({ userData, handleClose }) => {
  const initialFeatures = [
    { id: 1, name: "Ai Lawyer", enabled: false },
    { id: 2, name: "Ai Judge", enabled: false },
    { id: 3, name: "Feature 1", enabled: false },
    { id: 4, name: "Feature 2", enabled: false },
    { id: 5, name: "Feature 3", enabled: false },
    { id: 6, name: "Feature 4", enabled: false },
    { id: 7, name: "Feature 5", enabled: false },
    { id: 8, name: "Feature 6", enabled: false },
    // Add more features as needed
  ];
  
  const [features, setFeatures] = useState(initialFeatures);
  const [editing, setEditing] = useState(false);

  const toggleFeature = (id) => {
    if (editing) {
      setFeatures((prevFeatures) =>
        prevFeatures.map((feature) =>
          feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
        )
      );
    }
  };

  const handleEditClick = () => {
    setEditing((prevEditing) => !prevEditing);
  };

  return (
    <main className="flex flex-col space-y-14 w-full justify-center items-center">
      {/* header starts */}
      <section className="w-full flex flex-row justify-between items-center">
        <div className="text-white text-2xl">
          Custom Courtroom Features for <br />
          <span className="font-semibold">{"Aditya Goel"}</span>
        </div>

        <div className="flex flex-row items-center space-x-5">
          <button
            onClick={handleEditClick}
            className="p-2 bg-neutral-900/50 text-white rounded-md"
          >
            {editing ? "Save Features" : "Edit Features"}
          </button>
          <Close
            onClick={handleClose}
            className="text-[#0E5156] scale-125 rounded-full bg-neutral-900/70 cursor-pointer"
          />
        </div>
      </section>
      {/* //header ends */}

      {/* features */}
      <div className="flex flex-wrap text-white justify-between items-center gap-4 w-full">
        {features.map((feature) => (
          <div key={feature.id} className="flex gap-4 flex-row items-center">
            <Typography variant="body1">{feature.name}</Typography>
            <button
              onClick={() => toggleFeature(feature.id)}
              disabled={!editing} // Disable button if not in editing mode
              className={`border-black rounded-md p-2 px-5 ${
                feature.enabled ? "bg-gray-600" : "bg-teal-600"
              } ${!editing ? "opacity-50 cursor-not-allowed" : ""}`} // Apply styles for disabled state
            >
              {feature.enabled ? "Disabled" : "Enabled"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default UserFeatureDialog;
