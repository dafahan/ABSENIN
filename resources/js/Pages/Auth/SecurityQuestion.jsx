import React, { useState } from "react";
import { router } from "@inertiajs/react";


const SecurityQuestion = ({ questions }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post("/securityQuestion", { question, answer });
  };

  return (
    <div className="w-full flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Pertanyaan Keamanan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Pilih pertanyaan:</label>
          <select
            className="w-full border rounded p-2"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          >
            <option value="">-- Pilih pertanyaan --</option>
            {questions.map((q, index) => (
              <option key={index} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Jawaban Anda:</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Jawaban
        </button>
      </form>
    </div>
  );
};

export default SecurityQuestion;

