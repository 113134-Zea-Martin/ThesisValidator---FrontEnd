import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GenerateEmbeddingsRequest, UploadRequest, UploadResponse } from '../../interfaces/models';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe, RouterLink],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit, OnDestroy {
  thesisTitle: string = '';
  fullText: string = '';
  isProcessing: boolean = false;
  progressPercentage: number = 0;
  currentFile: string = '';
  processedFiles: { name: string; date: Date }[] = [];
  successMessage: string = '';


  subscriptions: Subscription[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProcessedDocuments();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

    loadProcessedDocuments() {
    const sus = this.apiService.getProcessedDocuments().subscribe({
      next: (docs) => {
        // Ajusta los campos según tu API: aquí se asume { title, processed_at } o { document_id, title }
        this.processedFiles = docs.map(d => ({
          name: (d as any).message ?? `Documento ${d.document_id}`,
          date: new Date((d as any).processed_at ?? Date.now())
        }));
      },
      error: (err) => console.error('Error al obtener documentos:', err)
    });
    this.subscriptions.push(sus);
  }

    get isFormInvalid(): boolean {
    return !this.thesisTitle?.trim() || !this.fullText?.trim();
  }

  clearDocuments() {
    this.processedFiles = [];
    this.progressPercentage = 0;
    this.currentFile = '';
    this.isProcessing = false;
  }

  uploadThesis(thesisData: UploadRequest) {
    this.isProcessing = true;
    this.progressPercentage = 10;
    this.currentFile = thesisData.title;

    const sus = this.apiService.uploadThesis(thesisData).subscribe({
      next: (response: UploadResponse) => {
        this.progressPercentage = 50;

        const embeddingsReq: GenerateEmbeddingsRequest = {
          document_id: response.document_id
        };

        const susEmbeddings = this.apiService.generateEmbeddings(embeddingsReq).subscribe({
          next: () => {
            this.progressPercentage = 100;
            this.processedFiles.unshift({
              name: thesisData.title,
              date: new Date()
            });
            this.isProcessing = false;
            this.currentFile = '';
              this.successMessage = '¡Documento procesado! Ya puedes acceder al chat.';
              // Redirigir automáticamente después de 2 segundos (opcional)
              // setTimeout(() => this.router.navigate(['/chat']), 2000);
          },
          error: (err) => {
            console.error('Embeddings failed:', err);
            this.isProcessing = false;
          }
        });
        this.subscriptions.push(susEmbeddings);
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.isProcessing = false;
      }
    });
    this.subscriptions.push(sus);
  }

  onSubmit() {
    if (!this.thesisTitle?.trim() || !this.fullText?.trim()) {
      return;
    }
    const thesisData: UploadRequest = {
      title: this.thesisTitle.trim(),
      content: this.fullText
    };
    this.uploadThesis(thesisData);
  }
}