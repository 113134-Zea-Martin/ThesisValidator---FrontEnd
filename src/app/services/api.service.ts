import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UploadRequest,
  UploadResponse,
  GenerateEmbeddingsRequest,
  GenerateEmbeddingsResponse,
  SearchResponse,
  SearchRequest,
  AskRequest,
  AskResponse,
  ConversationsResponse
} from '../interfaces/models';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_MAIN_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadThesis(thesisData: UploadRequest) : Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.API_MAIN_URL}/upload`, thesisData);
  }

  generateEmbeddings(request: GenerateEmbeddingsRequest) : Observable<GenerateEmbeddingsResponse> {
    return this.http.post<GenerateEmbeddingsResponse>(`${this.API_MAIN_URL}/generate-embeddings`, request);
  }

  getProcessedDocuments(): Observable<UploadResponse[]> {
    return this.http.get<UploadResponse[]>(`${this.API_MAIN_URL}/documents`);
  }

  generateSearch(searchQuery: SearchRequest) : Observable<SearchResponse> {
    return this.http.post<SearchResponse>(`${this.API_MAIN_URL}/search`, searchQuery);
  }

  generateAsk(ask: AskRequest) : Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.API_MAIN_URL}/ask`, ask);
  }

  getConversations(): Observable<ConversationsResponse[]> {console.log(environment.apiUrl);

    return this.http.get<ConversationsResponse[]>(`${this.API_MAIN_URL}/conversations`);
  }
}