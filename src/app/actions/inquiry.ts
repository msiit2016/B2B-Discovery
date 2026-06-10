"use server";

export interface InquiryData {
  supplierId: string;
  supplierName: string;
  name: string;
  mobile: string;
  email: string;
  productRequirement: string;
  message: string;
}

// In-memory storage for MVP
const inquiries: InquiryData[] = [];

export async function submitInquiry(data: InquiryData): Promise<{ success: boolean; message: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Quick validation
  if (!data.name || !data.mobile || !data.email || !data.productRequirement) {
    return {
      success: false,
      message: "Please fill in all required fields."
    };
  }

  // Store in memory
  inquiries.push({
    ...data,
  });

  // Log on the server side
  console.log("================ INQUIRY RECEIVED ================");
  console.log(`Supplier: ${data.supplierName} (ID: ${data.supplierId})`);
  console.log(`From: ${data.name} (${data.email} | Mobile: ${data.mobile})`);
  console.log(`Product Requirement: ${data.productRequirement}`);
  console.log(`Message: ${data.message}`);
  console.log(`Total Inquiries in Memory: ${inquiries.length}`);
  console.log("==================================================");

  return {
    success: true,
    message: "Your inquiry has been submitted successfully."
  };
}

export async function getInquiries(): Promise<InquiryData[]> {
  return inquiries;
}
