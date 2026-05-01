export const STATUSES = [
  { value: "ON", label: "On Campus", bg: "bg-[#e2f5ea]", text: "text-[#1f9254]", dot: "bg-[#1f9254]" },
  { value: "OFF", label: "Off Campus", bg: "bg-[#fef3c7]", text: "text-[#d97706]", dot: "bg-[#d97706]" },
  { value: "CLASS", label: "In Class", bg: "bg-[#e0e7ff]", text: "text-[#4f46e5]", dot: "bg-[#4f46e5]" },
];

export const getStatusConfig = (statusValue) => {
  return STATUSES.find(s => s.value === statusValue) || STATUSES[0];
};
