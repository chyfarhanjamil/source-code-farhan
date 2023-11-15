// client/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [publishers, setPublishers] = useState([]);
  const [newPublisherName, setNewPublisherName] = useState("");
  const [newPublisherTags, setNewPublisherTags] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/publishers")
      .then((response) => setPublishers(response.data))
      .catch((error) => console.error("Error fetching publishers:", error));
  }, []);

  const handleAddPublisher = () => {
    axios
      .post("http://localhost:5000/publishers", {
        name: newPublisherName,
        tags: newPublisherTags.split(",").map((tag) => tag.trim()),
      })
      .then((response) => {
        setPublishers([...publishers, response.data]);
        setNewPublisherName("");
        setNewPublisherTags("");
      })
      .catch((error) => console.error("Error adding publisher:", error));
  };

  return (
    <div>
      <h1>News Portal</h1>
      <h2>Publishers</h2>
      <ul>
        {publishers.map((publisher) => (
          <li key={publisher._id}>
            {publisher.name} - Tags: {publisher.tags.join(", ")}
          </li>
        ))}
      </ul>
      <h2>Add New Publisher</h2>
      <label>Name: </label>
      <input
        type="text"
        value={newPublisherName}
        onChange={(e) => setNewPublisherName(e.target.value)}
      />
      <br />
      <label>Tags (comma-separated): </label>
      <input
        type="text"
        value={newPublisherTags}
        onChange={(e) => setNewPublisherTags(e.target.value)}
      />
      <br />
      <button onClick={handleAddPublisher}>Add Publisher</button>
    </div>
  );
}

export default App;
