import { useEffect, useState } from "react";

function InputText({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  disabled,
}) {
  const [value, setValue] = useState(defaultValue);

  const regexPattern = /^[0-9]+$/;
  const regex = new RegExp(regexPattern);
  const updateInputValue = (val) => {
    if (updateType === "phoneNumber") {
      if (
        val.startsWith("+92") &&
        val.length <= 13 &&
        regex.test(Number(val))
      ) {
        setValue(val);
        updateFormValue({ updateType, value: val });
      }
    } else {
      setValue(val);
      updateFormValue({ updateType, value: val });
    }
  };
  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <input
        type={type || "text"}
        value={value}
        placeholder={placeholder || ""}
        onChange={(e) => updateInputValue(e.target.value)}
        className="input  input-bordered w-full "
        disabled={disabled || false}
      />
    </div>
  );
}

export default InputText;
