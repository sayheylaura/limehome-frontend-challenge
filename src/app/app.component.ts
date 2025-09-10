import { Component, ElementRef, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  // Accordion state management
  personalInfoExpanded = signal(true);
  addressExpanded = signal(true);
  paymentDetailsExpanded = signal(true);

  onAccordionToggle(
    section: 'personalInfo' | 'address' | 'paymentDetails',
    event?: Event
  ) {
    // Handle keyboard events
    if (event && event instanceof KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return; // Ignore other keys
      }
      event.preventDefault();
    }

    this.toggleAccordion(section);
  }

  private toggleAccordion(
    section: 'personalInfo' | 'address' | 'paymentDetails'
  ) {
    switch (section) {
      case 'personalInfo':
        this.personalInfoExpanded.update((expanded) => !expanded);
        break;
      case 'address':
        this.addressExpanded.update((expanded) => !expanded);
        break;
      case 'paymentDetails':
        this.paymentDetailsExpanded.update((expanded) => !expanded);
        break;
    }
  }

  form = new FormGroup({
    personalInfo: new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/),
      ]),
    }),
    address: new FormGroup({
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      houseNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      zipCode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9 \-]+$/),
      ]),
      city: new FormControl('', [Validators.required, Validators.minLength(2)]),
      country: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    }),
    paymentDetails: new FormGroup({
      creditCardNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d[\d\s\-]{11,18}\d$/),
      ]),
      expiryDate: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
      ]),
      cvv: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{3,4}$/),
      ]),
      cardHolderName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    }),
  });

  // Helper methods for form validation
  getFieldError(fieldPath: string): string {
    const field = this.form.get(fieldPath);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'This field is required';
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid format';
      }
    }
    return '';
  }

  isFieldInvalid(fieldPath: string): boolean {
    const field = this.form.get(fieldPath);
    return !!(field?.invalid && field.touched);
  }

  // Form submission
  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      // TODO: Handle form submission here
      this.form.reset();
    } else {
      // Mark all fields as touched to show validation errors
      this.form.markAllAsTouched();
    }
  }
}
