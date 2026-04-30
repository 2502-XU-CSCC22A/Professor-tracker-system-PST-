const TIME_24H_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const TIME_12H_RE = /^(1[0-2]|0?[1-9]):([0-5]\d)\s*(am|pm)$/i;

const normalize24Hour = (value = "") => {
  const trimmed = String(value).trim();
  if (TIME_24H_RE.test(trimmed)) return trimmed;

  const short24Match = trimmed.match(/^(\d):([0-5]\d)$/);
  if (short24Match) return `0${short24Match[1]}:${short24Match[2]}`;

  return "";
};

const convert12To24 = (value = "") => {
  const trimmed = String(value).trim();
  const match = trimmed.match(TIME_12H_RE);
  if (!match) return "";

  const hourRaw = Number(match[1]);
  const minute = match[2];
  const period = match[3].toLowerCase();

  let hour = hourRaw;
  if (period === "am" && hour === 12) hour = 0;
  if (period === "pm" && hour !== 12) hour += 12;

  return `${String(hour).padStart(2, "0")}:${minute}`;
};

const convert24To12 = (value = "") => {
  const normalized = normalize24Hour(value);
  if (!normalized) return "";

  const [hourStr, minute] = normalized.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute}${period}`;
};

const parseSingleTime = (value = "") => normalize24Hour(value) || convert12To24(value);

export const parseScheduleTimeRange = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return { startTime: "", endTime: "" };

  const parts = raw.split("-").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return { startTime: "", endTime: "" };

  if (parts.length === 1) {
    return { startTime: parseSingleTime(parts[0]), endTime: "" };
  }

  return {
    startTime: parseSingleTime(parts[0]),
    endTime: parseSingleTime(parts[1]),
  };
};

export const buildScheduleTimeRange = (startTime = "", endTime = "") => {
  const start = normalize24Hour(startTime);
  const end = normalize24Hour(endTime);
  if (!start || !end) return "";
  return `${start} - ${end}`;
};

export const formatScheduleTimeRange = (value = "") => {
  const { startTime, endTime } = parseScheduleTimeRange(value);

  if (startTime && endTime) {
    const formattedStart = convert24To12(startTime);
    const formattedEnd = convert24To12(endTime);
    if (formattedStart && formattedEnd) return `${formattedStart} - ${formattedEnd}`;
  }

  if (startTime) {
    const formattedStart = convert24To12(startTime);
    if (formattedStart) return formattedStart;
  }

  return String(value || "");
};
