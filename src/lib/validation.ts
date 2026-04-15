export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  if (!phone.trim()) return true; // optional
  return /^\d{10}$/.test(phone.trim().replace(/[\s-]/g, ""));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateNumeric = (value: string): boolean => {
  if (!value.trim()) return true;
  return /^\d+(\.\d+)?$/.test(value.trim());
};

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDonationForm = (form: any, tab: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (tab === "corporate") {
    if (!validateRequired(form.companyName || "")) errors.push({ field: "companyName", message: "Company name is required" });
    if (!validateRequired(form.contactPerson || "")) errors.push({ field: "contactPerson", message: "Contact person is required" });
  } else {
    if (!validateRequired(form.name || "")) errors.push({ field: "name", message: "Name is required" });
  }

  if (!validateRequired(form.email || "")) errors.push({ field: "email", message: "Email is required" });
  else if (!validateEmail(form.email)) errors.push({ field: "email", message: "Invalid email format" });

  if (form.phone && !validatePhone(form.phone)) errors.push({ field: "phone", message: "Phone must be 10 digits" });

  if (form.amount && !validateNumeric(form.amount)) errors.push({ field: "amount", message: "Amount must be a number" });

  return errors;
};

export const validateVolunteerForm = (form: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!validateRequired(form.firstName || "")) errors.push({ field: "firstName", message: "First name is required" });
  if (!validateRequired(form.email || "")) errors.push({ field: "email", message: "Email is required" });
  else if (!validateEmail(form.email)) errors.push({ field: "email", message: "Please enter a valid email address" });
  if (!validateRequired(form.phone || "")) errors.push({ field: "phone", message: "Phone number is required" });
  else if (!validatePhone(form.phone)) errors.push({ field: "phone", message: "Phone must be exactly 10 digits" });
  return errors;
};

export const validateContactForm = (form: { name: string; email: string; subject: string; message: string }): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!validateRequired(form.name)) errors.push({ field: "name", message: "Name is required" });
  if (!validateRequired(form.email)) errors.push({ field: "email", message: "Email is required" });
  else if (!validateEmail(form.email)) errors.push({ field: "email", message: "Invalid email format" });
  if (!validateRequired(form.subject)) errors.push({ field: "subject", message: "Subject is required" });
  if (!validateRequired(form.message)) errors.push({ field: "message", message: "Message is required" });
  return errors;
};
