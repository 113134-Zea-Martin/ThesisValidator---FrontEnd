import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  features = [
    {
      icon: 'bi-cloud-upload',
      title: 'Upload Documents',
      description: 'Upload and process your astronomy thesis documents. Our system uses advanced NLP to index your content for intelligent semantic search and analysis.',
      route: '/upload',
      color: 'primary',
      buttonText: 'Go to Upload'
    },
    {
      icon: 'bi-robot',
      title: 'AI Chat Assistant',
      description: 'Ask questions about your research and get context-aware answers with source citations. Chat with our AI powered by Cohere.',
      route: '/chat',
      color: 'success',
      buttonText: 'Go to Chat'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}