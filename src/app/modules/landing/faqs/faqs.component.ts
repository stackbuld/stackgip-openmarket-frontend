import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
})
export class FaqsComponent implements OnInit {
  mainFaqs: { question: string; answer: string }[] = [
    {
      question: 'How do I place an order?',
      answer:
        'To place an order, browse our website, select the products you want, add them to your cart, and proceed to checkout. Follow the prompts to complete your purchase.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept credit cards (Visa, MasterCard), transfer, USSD and cryptocurrency.',
    },
    {
      question: 'Is my personal information safe with you?',
      answer:
        'Yes, we take your privacy seriously. We use industry-standard encryption and security measures to protect your personal information. You can review our Privacy Policy for more details.',
    },
    {
      question: 'How can I track my order?',
      answer:
        "Once your order is confirmed for delivery, you will receive a confirmation email with a tracking number. You can use this number to track your order's progress on our website or through the carrier's website.",
    },
    {
      question: 'What is your return and refund policy?',
      answer:
        'We have a hassle-free return policy. If you are not satisfied with your purchase, you can return it within 3 days of receipt for a full refund or exchange. Please review our Returns and Refunds page for more details.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Shipping times can vary based on your location and the shipping method you choose. We provide estimated delivery times during the checkout process, and you can track your order for real-time updates.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'No',
    },
    {
      question: 'Can I change or cancel my order after it’s been placed?',
      answer:
        "We aim to process orders quickly, but if you need to make changes or cancel an order, please contact our customer support as soon as possible. We'll do our best to assist you.",
    },
    {
      question: 'Are your products covered by a warranty?',
      answer:
        "Some products may come with a manufacturer's warranty. Check the product description for warranty information. Additionally, we offer a satisfaction guarantee for our own-branded products.",
    },
    {
      question: 'How can I contact your customer support?',
      answer:
        'You can reach our customer support team via email at partner@renamarket.com or call 07080639031',
    },
    {
      question: 'Do you offer discounts or promotions?',
      answer:
        'Yes, we regularly run promotions and offer discounts. We also give commissions for successful referral signups. To stay updated, subscribe to our newsletter, or follow us on social media for exclusive offers and deals.',
    },
    {
      question: 'What if I have a specific product question?',
      answer:
        'If you have a question about a specific product, you can find detailed information in the product description. If you need further assistance, feel free to contact our customer support.',
    },
  ];
  faqs: { question: string; answer: string }[] = [];
  previousIndex: number;

  faqsOpened: boolean[] = [];
  faqsLength: number = 3;
  @ViewChild('answer') answerContainer: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.faqs = this.mainFaqs.slice(0, this.faqsLength);
    this.faqsOpened = Array(this.mainFaqs.length).fill(false);
  }

  onOpenFaq(index: number) {
    if (this.previousIndex == index) {
      this.faqsOpened[index] = !this.faqsOpened[index];
      return;
    }
    this.faqsOpened = this.faqsOpened.map((_, i) => i === index);
    this.previousIndex = index;
  }

  onLoadMore() {
    if (this.faqs.length == this.mainFaqs.length) {
      return;
    }
    this.faqsLength += 3;

    this.faqs = this.mainFaqs.slice(0, this.faqsLength);
  }
}
