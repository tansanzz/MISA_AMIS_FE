/* eslint-disable */
import { isObject, isFunction } from "@/utils/validate/validators";

const validate = (rules, value) => {
  var results = [];
  for (const ruleName in rules) {
    const validator = rules[ruleName];
    if (isFunction(validator)) {
      const result = excuteValidator(validator, value);
      if(!result.success) results.push(result.message);
    }
  }
  return results;
};

const excuteValidator = (validator, value) => {
  return validator(value);
};

export { validate };
