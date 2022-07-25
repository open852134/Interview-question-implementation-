import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import "./CustomInputNumber.scss";

const ACTION_CODE = {
  MINUS: "MINUS",
  ADD: "ADD",
};

const CustomInputNumber = ({
  min,
  max,
  step,
  name,
  value,
  wrapperClass,
  disabled,
  onChange,
  onBlur,
  ...reset
}) => {
  const inputEl = useRef({});
  const [isPressed, setIsPressed] = useState(null);
  const [errorMessage, setErrorMessage] = useState(" ");

  useEffect(() => {
    inputEl.current.value = value;
  }, [value]);

  useEffect(() => {
    let timer = null;
    if (!isPressed) {
      clearInterval(timer);
      return;
    }

    timer = setInterval(() => {
      isPressed === ACTION_CODE.ADD && addNumber();
      isPressed === ACTION_CODE.MINUS && minusNumber();
    }, 350);

    return () => {
      clearInterval(timer);
    };
  }, [isPressed]);

  const validate = (value) => {
    if (isNaN(value)) {
      setErrorMessage("請輸入數字");
      return false;
    }

    if (value < min) {
      setErrorMessage(`數值不可低於 ${min}`);
      return false;
    }

    if (value > max) {
      setErrorMessage(`數值不可大於 ${max}`);
      return false;
    }

    return true;
  };

  const eventTrigger = (nextValue) => {
    if (disabled || !validate(nextValue)) {
      return;
    }

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeInputValueSetter.call(inputEl.current, nextValue);
    inputEl.current.dispatchEvent(new Event("input", { bubbles: true }));

    setErrorMessage("");
  };

  const minusNumber = () => {
    const nextValue = Number(inputEl.current.value) - step;

    eventTrigger(nextValue);
  };

  const addNumber = () => {
    const nextValue = Number(inputEl.current.value) + step;

    eventTrigger(nextValue);
  };

  const handleChange = (e) => {
    const nextValue = Number(e.target.value);

    if (isNaN(nextValue) || nextValue > max || nextValue < min) return;

    eventTrigger(nextValue);
    onChange(e);
  };

  return (
    <div className={["custom-input-number", wrapperClass].join(" ")}>
      <div className="custom-input-number__wrapper" disabled={disabled}>
        <button
          type="button"
          onClick={minusNumber}
          className="custom-input-number__button"
          onMouseDown={() => setIsPressed(ACTION_CODE.MINUS)}
          onMouseUp={() => setIsPressed(null)}
        >
          ﹣
        </button>
        <input
          type="text"
          name={name}
          ref={inputEl}
          disabled={disabled}
          value={inputEl.current.value || 0}
          className="custom-input-number__input"
          onBlur={onBlur}
          onChange={handleChange}
          {...reset}
        />
        <button
          type="button"
          className="custom-input-number__button"
          onClick={addNumber}
          onMouseDown={() => setIsPressed(ACTION_CODE.ADD)}
          onMouseUp={() => setIsPressed(null)}
        >
          ﹢
        </button>
      </div>
      <div className="custom-input-number__errorMessage">{errorMessage}</div>
    </div>
  );
};

CustomInputNumber.defaultProps = {
  step: 1,
  min: 0,
  max: 5,
  disabled: false,
};

CustomInputNumber.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  name: PropTypes.string,
  value: PropTypes.number,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomInputNumber;
