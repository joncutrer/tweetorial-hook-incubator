
import React from 'react';
import { Step } from '../types';

interface StepIndicatorProps {
  currentStep: Step;
}

const steps = [
  "Topic",
  "Everyday Examples",
  "Experiences",
  "Anecdote",
  "Refinement",
  "Sample Hook",
  "Final Review"
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center flex-1 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors ${
                index <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-[10px] sm:text-xs font-medium text-center hidden md:block ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
