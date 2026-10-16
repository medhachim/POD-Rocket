'use client';

import React from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
  unit?: string;
  formatValue?: (val: number) => string;
}

export function CustomSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit = '',
  formatValue,
}: SliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-400">{label}</span>
          <span className="text-cyan-400 font-semibold font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            {formatValue ? formatValue(value) : `${value.toLocaleString()}${unit}`}
          </span>
        </div>
      )}
      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          style={{
            background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(6, 182, 212) ${percentage}%, rgb(30, 41, 59) ${percentage}%, rgb(30, 41, 59) 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}
