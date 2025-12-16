import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AskRequest, AskResponse, ContextUsed, SearchRequest, SearchResponse, Result, ConversationsResponse } from '../../interfaces/models';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  contextUsed?: ContextUsed[];
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  inputMessage = '';
  isLoading = false;
  showSources = false;
  currentResults: Result[] = [];
  groupedResults: Record<string, Result[]> = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.messages.push({
      role: 'assistant',
      content: 'Welcome to ThesisValidator AI! Ask me anything about your thesis documents.',
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    if (!this.inputMessage.trim() || this.isLoading) return;

    const question = this.inputMessage;
    this.messages.push({
      role: 'user',
      content: question,
      timestamp: new Date()
    });

    this.inputMessage = '';
    this.isLoading = true;

    const askRequest: AskRequest = { question };

    this.apiService.generateAsk(askRequest).subscribe({
      next: (response: AskResponse) => {
        this.messages.push({
          role: 'assistant',
          content: response.answer,
          contextUsed: response.context_used,
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, there was an error processing your request. Please try again.',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }

  loadPreviousConversations(): void {
    this.isLoading = true;
    
    this.apiService.getConversations().subscribe({
      next: (conversations: ConversationsResponse[]) => {
        // Limpiar mensajes actuales excepto el de bienvenida
        this.messages = [{
          role: 'assistant',
          content: 'Loading previous conversations...',
          timestamp: new Date()
        }];

                // Ordenar conversaciones de más antigua a más reciente
        const sortedConversations = conversations.sort((a, b) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });

        // Convertir conversaciones a mensajes
        sortedConversations.forEach(conv => {
          // Agregar pregunta del usuario
          this.messages.push({
            role: 'user',
            content: conv.question,
            timestamp: new Date(conv.created_at)
          });

          // Agregar respuesta del asistente
          this.messages.push({
            role: 'assistant',
            content: conv.answer,
            contextUsed: conv.context_used,
            timestamp: new Date(conv.created_at)
          });
        });

        // Mensaje final
        if (conversations.length > 0) {
          this.messages.push({
            role: 'assistant',
            content: `Loaded ${conversations.length} previous conversation(s). You can continue asking questions!`,
            timestamp: new Date()
          });
        } else {
          this.messages.push({
            role: 'assistant',
            content: 'No previous conversations found. Start by asking a question!',
            timestamp: new Date()
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
        this.messages = [{
          role: 'assistant',
          content: 'Sorry, there was an error loading previous conversations. Please try again.',
          timestamp: new Date()
        }];
        this.isLoading = false;
      }
    });
  }

  viewSources(contextUsed?: ContextUsed[]): void {
    const lastUserMessage = [...this.messages].reverse().find(m => m.role === 'user');
    const query = lastUserMessage?.content ?? (contextUsed && contextUsed[0]?.content_snippet) ?? '';
    
    this.isLoading = true;
    const searchRequest: SearchRequest = { query };

    this.apiService.generateSearch(searchRequest).subscribe({
      next: (response: SearchResponse) => {
        this.currentResults = response.results;
        this.groupedResults = this.groupByTitle(this.currentResults);
        this.showSources = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching sources:', error);
        this.currentResults = [];
        this.groupedResults = {};
        this.showSources = true;
        this.isLoading = false;
      }
    });
  }

  private groupByTitle(results: Result[]): Record<string, Result[]> {
    return results.reduce((acc, res) => {
      const key = res.title || 'Unknown document';
      (acc[key] ||= []).push(res);
      return acc;
    }, {} as Record<string, Result[]>);
  }

  trackByDocTitle(index: number, item: { key: string; value: Result[] }) {
    return item.key;
  }

  closeSources(): void {
    this.showSources = false;
  }

  clearChat(): void {
    this.messages = [];
    this.inputMessage = '';
  }

  newConversation(): void {
    this.clearChat();
    this.messages.push({
      role: 'assistant',
      content: 'New conversation started. What would you like to know?',
      timestamp: new Date()
    });
  }
}