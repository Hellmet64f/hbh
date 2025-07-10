import React from 'react';

interface ChoiceButtonProps {
  text: string;
  onClick: () => void;
  disabled: boolean;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md hover:bg-purple-900/50 hover:border-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <p className="text-gray-300 text-lg">{text}</p>
    </button>
  );
};

export default ChoiceButton;