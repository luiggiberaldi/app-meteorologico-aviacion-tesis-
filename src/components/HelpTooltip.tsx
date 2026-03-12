"use client";

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  term: string;
  definition: string;
  className?: string;
}

export default function HelpTooltip({ term, definition, className = "" }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`relative inline-flex items-center group cursor-help ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      <span className="border-b border-dotted border-gray-400 font-medium text-inherit">{term}</span>
      <HelpCircle size={12} className="ml-1 text-gray-500 group-hover:text-indigo-400 transition-colors" />
      
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl text-xs text-gray-300 font-normal leading-relaxed before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-700">
          {definition}
        </div>
      )}
    </div>
  );
}
