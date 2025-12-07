"use client";
import { useCompletion } from '@ai-sdk/react';
import { useState } from 'react';

interface Suggestion {
  title: string;
  content: string;
}

const suggestions: Suggestion[] = [
  {
    title: "Course Quality",
    content: "The explanation was clear and easy to understand. The instructor provided lots of helpful examples."
  },

];

const specialChar = "||"

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const SuggestedFeedback = () => {



  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Suggested Feedback
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Not sure what to write? Here are some suggestions you can use for inspiration:
      </p>

      <div className="space-y-4">
        {suggestions.map((item, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg hover:shadow-md transition bg-gray-50"
          >
            <p className="text-gray-600 text-sm mt-1">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedFeedback;
