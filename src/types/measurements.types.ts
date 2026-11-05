export interface IMeasurement {
  _id?: string;
  ownerId?: string;
  customerId: string;
  measurementName: string;
  measurementDate?: string;
  customerPhone?: string;
  customerName?: string;
  kameezLength?: string | number;
  sleeveLength?: string | number;
  shoulderWidth?: string | number;
  neck?: string | number;
  chest?: string | number;
  waist?: string | number;
  bottomWidth?: string | number;
  shalwarLength?: string | number;
  bottomOpening?: string | number;
  cuff?: string | number;
  collarStyle?: string;
  hasChakPattiKaaj?: boolean;
  hasChestPocket?: boolean;
  hasSidePockets?: boolean;
  hasShalwarPocket?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MeasurementResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
