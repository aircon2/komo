"use client";

import React, { useState } from "react";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    // use your preferred promise‑chain syntax
    fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching search results", err);
        setResults([]);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
        fetch(`http://localhost:3000/api/summarize?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setSummary(data.summary ? JSON.stringify(data.summary, null, 2) : "");
        })
        .catch((err) => {
          console.error("Error fetching summary", err);
          setSummary("Error fetching summary");
        });
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your query..."
        style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
      />

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          marginTop: "1rem",
          borderRadius: "4px",
        }}
      >
        <h3>Search Results</h3>
        <pre>{results.length ? JSON.stringify(results, null, 2) : "No results"}</pre>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          marginTop: "1rem",
          borderRadius: "4px",
        }}
      >
        <h3>Summary</h3>
        <pre>{summary || "No summary"}</pre>
      </div>
    </div>
  );
};

export default SearchPage;