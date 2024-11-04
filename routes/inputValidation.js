import Joi from "joi";

const validation = (schema) =>
  function validateInfo(information) {
    return schema.validate(information, { abortEarly: false });
  };

const readingsObjSchema = Joi.object({
  equipmentId: Joi.string().min(4).max(20).required(),
  value: Joi.number().required(),
  timestamp: Joi.date().required(),
});

const windowDurationSchema = Joi.number().min(1).required();

export const validateSensorDataInsertionObj = validation(readingsObjSchema);
export const validateWindowDurationProvided = validation(windowDurationSchema);
