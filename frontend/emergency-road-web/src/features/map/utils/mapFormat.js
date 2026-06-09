export function displayValue(value) {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return value;
  }

export function formatDateTime(value) {
    if (!value) {
      return "-";
    }

    return String(value).replace("T", " ").substring(0, 16);
  }