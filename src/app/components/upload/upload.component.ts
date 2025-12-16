import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GenerateEmbeddingsRequest, UploadRequest, UploadResponse } from '../../interfaces/models';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {
  thesisTitle: string = '';
  fullText: string = '';
  isProcessing: boolean = false;
  progressPercentage: number = 0;
  currentFile: string = '';
  processedFiles: { name: string; date: Date }[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProcessedDocuments();
  }

    loadProcessedDocuments() {
    this.apiService.getProcessedDocuments().subscribe({
      next: (docs) => {
        // Ajusta los campos según tu API: aquí se asume { title, processed_at } o { document_id, title }
        this.processedFiles = docs.map(d => ({
          name: (d as any).message ?? `Documento ${d.document_id}`,
          date: new Date((d as any).processed_at ?? Date.now())
        }));
      },
      error: (err) => console.error('Error al obtener documentos:', err)
    });
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

    this.apiService.uploadThesis(thesisData).subscribe({
      next: (response: UploadResponse) => {
        this.progressPercentage = 50;

        const embeddingsReq: GenerateEmbeddingsRequest = {
          document_id: response.document_id
        };

        this.apiService.generateEmbeddings(embeddingsReq).subscribe({
          next: () => {
            this.progressPercentage = 100;
            this.processedFiles.unshift({
              name: thesisData.title,
              date: new Date()
            });
            this.isProcessing = false;
            this.currentFile = '';
          },
          error: (err) => {
            console.error('Embeddings failed:', err);
            this.isProcessing = false;
          }
        });
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.isProcessing = false;
      }
    });
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