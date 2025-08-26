import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  open?: boolean;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help.html',
  styleUrls: ['./help.css']
})
// ✅ تم تغيير اسم الكلاس هنا
export class HelpComponent {
  searchTerm = '';
  selectedCategory = 'all';

  faqs: FAQ[] = [
    { question: 'How do I register as a citizen?', answer: 'Click the "Register" button on the login page and fill in your details.', category: 'Account' },
    { question: 'How to reset my password?', answer: 'Go to "Forgot Password" link and follow the instructions to reset your password.', category: 'Account' },
    { question: 'How to track my service requests?', answer: 'Open the dashboard to see all your active, completed, and pending requests.', category: 'Services' },
    { question: 'How to submit a new service request?', answer: 'Click "New Request" in your dashboard and fill the form with the required information.', category: 'Services' },
    { question: 'How to contact support?', answer: 'Use the support form in the Help Center or call our hotline.', category: 'Support' },
    { question: 'How do I update my profile information?', answer: 'Go to "Profile" in the menu and update your information.', category: 'Account' },
    { question: 'What if my request is delayed?', answer: 'Check the status in your dashboard or contact support for assistance.', category: 'Services' },
  ];

  toggleAccordion(faq: FAQ) {
    faq.open = !faq.open;
  }

  get filteredFaqs() {
    return this.faqs.filter(faq =>
      (this.selectedCategory === 'all' || faq.category === this.selectedCategory) &&
      (faq.question.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
}
