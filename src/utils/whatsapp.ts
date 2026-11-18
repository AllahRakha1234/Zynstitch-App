export const getWhatsAppUrl = (phone: string, name?: string): string | null => {
  const cleaned = phone.replace(/\D/g, '');
  let formattedPhone = '';

  if (cleaned.startsWith('0') && cleaned.length === 11) {
    formattedPhone = '92' + cleaned.substring(1);
  } else if (cleaned.startsWith('92') && cleaned.length === 12) {
    formattedPhone = cleaned;
  } else {
    return null;
  }

  const greeting = name ? `Hello ${name}, ` : 'Hello, ';
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(greeting)}`;
};
