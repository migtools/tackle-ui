import { AxiosError } from "axios";

// Axios error

export const getAxiosErrorMessage = (axiosError: AxiosError) => {
  if (axiosError.response?.data.message) {
    return axiosError.response?.data.message;
  }
  return axiosError.message;
};

// Formik

export const getValidatedFromError = (
  error: any
): "success" | "warning" | "error" | "default" => {
  return error ? "error" : "default";
};

export const getValidatedFromErrorTouched = (
  error: any,
  touched: boolean | undefined
): "success" | "warning" | "error" | "default" => {
  return error && touched ? "error" : "default";
};
