import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { getUserFeedback } from "./actions/Admin.action";

const UserFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await getUserFeedback();
        setFeedbackData(response.data.feedbackWithDetails);
      } catch (error) {
        console.error("Error fetching feedback:", error.message);
      }
    };

    fetchFeedback();
  }, []);

  const handleGoBack = () => {
    console.log("Go Back button clicked");
  };

  const handleReadMoreClick = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  const truncateText = (text, maxLength = 30) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <section className="h-screen w-full flex flex-row justify-center items-center gap-5 p-5">
      <div className="flex flex-col justify-center h-full w-full items-center">
        <div className="flex flex-col rounded-lg h-full bg-black/30 w-full gap-3 p-3 shadow-md">
          <div className="flex flex-row w-full justify-end gap-2 items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-gray-300 bg-white h-10 text-neutral-900 px-2 font-semibold rounded-lg text-sm w-1/3"
            />
            <Button
              variant="contained"
              onClick={handleGoBack}
              style={{ backgroundColor: "#4fd1c5", color: "white" }}
            >
              Go Back
            </Button>
          </div>

          <div className="border-2 overflow-y-auto overflow-x-auto border-white w-full rounded-md">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-teal-500">
                  <th className="p-2 w-1/5 text-left">Response</th>
                  <th className="p-2 w-1/5 text-left">User Feedback</th>
                  <th className="p-2 w-1/5 text-left">Feedback Type</th>
                  <th className="p-2 w-1/5 text-left">Impression</th>
                  <th className="p-2 w-1/5 text-left">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {feedbackData
                  .filter((val) => {
                    if (!searchTerm) return true;
                    return (
                      val.Response.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      val.feedbackMessage.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  })
                  .map((feedback) => (
                    <tr key={feedback.id} className="border-b border-teal-600">
                      <td className="p-2 text-left">
                        {truncateText(feedback.Response, 30)}
                        {feedback.Response.length > 30 && (
                          <Button
                            onClick={() => handleReadMoreClick(feedback)}
                            style={{ color: "#4fd1c5", fontSize: "0.75rem", marginLeft: "5px" }}
                          >
                            Read More
                          </Button>
                        )}
                      </td>
                      <td className="p-2 text-left">{feedback.feedbackMessage}</td>
                      <td className="p-2 text-left">{feedback.feedbackType}</td>
                      <td className="p-2 text-left">{feedback.impression}</td>
                      <td className="p-2 text-left">{feedback.phoneNumber}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for displaying full response */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Full Response</DialogTitle>
        <DialogContent dividers>
          <p>{selectedFeedback?.Response}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default UserFeedback;
