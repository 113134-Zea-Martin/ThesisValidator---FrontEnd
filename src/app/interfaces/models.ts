export interface UploadRequest {
  title: string;
  content: string;
}

export interface UploadResponse {
  message: string;
  document_id: string;
}

export interface GenerateEmbeddingsRequest {
  document_id: string;
}

export interface GenerateEmbeddingsResponse {
  message: string;
}

export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
    results: Result[];
}

export interface Result {
    document_id:      string;
    title:            string;
    content_snippet:  string;
    similarity_score: number;
}

export interface AskRequest {
    question: string;
}

export interface AskResponse {
    question:     string;
    answer:       string;
    context_used: ContextUsed[];
    grounded:     boolean;
}

export interface ContextUsed {
    document_id:      string;
    chunk_id:         string;
    chunk_index:      number;
    content_snippet:  string;
    similarity_score: number;
}

export interface ConversationsResponse {
    context_used: ContextUsed[] | undefined;
    id:           number;
    question:     string;
    answer:       string;
    context:      string;
    groundedness: number;
    created_at:   Date;
}