export interface S3ActionRequest {
  action: "upload" | "download" | "presign";
  key: string;
  body?: string;
}

export interface DynamoRequest {
  action: "put" | "get" | "query";
  item?: Record<string, any>;
  key?: string;
}
