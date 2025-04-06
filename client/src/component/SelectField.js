import React from "react";

function SelectField({ label, name, options, value, onChange, className }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange} className={className}>
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;