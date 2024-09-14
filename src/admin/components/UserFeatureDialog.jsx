import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { UpdateCustomCourtroomUser } from "../actions/CustomCourtroom.action";

const UserFeatureDialog = ({
  userData,
  handleClose,
  selectedId,
  setUserData,
}) => {
  console.log(userData);
  console.log(selectedId);

  const initialFeatures = [
    { id: 1, name: "Ai Lawyer", enabled: false },
    { id: 2, name: "Ai Judge", enabled: false },
    { id: 3, name: "Evidences", enabled: false },
    { id: 4, name: "AiAssistant", enabled: false },
    { id: 5, name: "FirstDraft", enabled: false },
    { id: 6, name: "LegalGPT", enabled: false },
    { id: 7, name: "MultilingualSupport", enabled: false },
    { id: 8, name: "RelevantCaseLaws", enabled: false },
    { id: 9, name: "Verdict", enabled: false },
    { id: 10, name: "VoiceInput", enabled: false },
    // Add more features as needed
  ];
  // var featuress = ["Ai Lawyer", "Ai Judge", "Evidences"];

  const [features, setFeatures] = useState(initialFeatures);
  const [editing, setEditing] = useState(false);

  const toggleFeature = async (id) => {
    // if (editing) {
    //   setFeatures((prevFeatures) =>
    //     prevFeatures.map((feature) =>
    //       feature.id === id
    //         ? { ...feature, enabled: !feature.enabled }
    //         : feature
    //     )
    //   );
    // }
    if (editing) {
      var data = userData;
      console.log(data[selectedId].features[id]);
      data[selectedId].features[id] = !data[selectedId].features[id];
      setUserData(data);
      const res = await UpdateCustomCourtroomUser(data[selectedId]);
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
          <span className="font-semibold">{userData[selectedId].name}</span>
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
        {Object.entries(userData[selectedId].features)
          .filter(([key, value]) => key != "_id")
          .map(([key, value]) => (
            <div key={key} className="flex gap-4 flex-row items-center">
              <Typography variant="body1">{key}</Typography>
              <button
                onClick={() => toggleFeature(key)}
                disabled={!editing} // Disable button if not in editing mode
                className={`border-black rounded-md p-2 px-5 ${
                  value ? "bg-teal-600" : "bg-gray-600"
                } ${!editing ? "opacity-50 cursor-not-allowed" : ""}`} // Apply styles for disabled state
              >
                {value ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))}
      </div>
    </main>
  );
};

export default UserFeatureDialog;
