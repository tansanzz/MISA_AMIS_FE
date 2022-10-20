/* eslint-disable */

const required = (message) => {
  return (value) => {
    if (!value) {
      return {
        success: false,
        message: message,
      };
    }
    if (typeof value === "string")
      return {
        success: !!value.trim(),
        message: !!value.trim() ? message : "",
      };
    return {
      success: true,
      message: "",
    };
  };
};

const maxLength = (maxLength, message) => {
  return (value) => {
    if (typeof value === "string" && value.length <= maxLength)
      return {
        success: true,
        message: "",
      };
    return {
      success: false,
      message: message,
    };
  };
};

const email = (message) => {
  try {
    return (value) => {
      if (!value || (typeof value === "string" && !value.trim()))
        return {
          success: true,
          message: "",
        };
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return {
          success: true,
          message: "",
        };
      }
      return {
        success: false,
        message: message,
      };
    };
  } catch (error) {
    console.log(error);
  }
};

const number = (value) => {
  try {
    var number = Math.floor(Number(value));
    return number !== Infinity && String(number) === value && number >= 0;
  } catch (error) {
    console.log(error);
  }
};

const isObject = (value) => {
  return typeof value === "object";
};

const isFunction = (value) => {
  return typeof value === "function";
};

export { required, maxLength, email, number, isObject, isFunction };
