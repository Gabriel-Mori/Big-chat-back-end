export interface AuthRequest {
  documentId: string;
  documentType: "CPF" | "CNPJ";
  name?: string;
}

export interface AuthResponse {
  token?: string;
  client: {
    id: string;
    name: string;
    documentId: string;
    documentType: "CPF" | "CNPJ";
    balance?: number;
    limit?: number;
    planType?: "prepaid" | "postpaid";
    active?: boolean;
  };
}

export interface JwtPayload {
  id: string;
  documentId: string;
  documentType: "CPF" | "CNPJ";
}
