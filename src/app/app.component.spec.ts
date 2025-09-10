import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it('should render title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="form-title"]')?.textContent
      ).toContain('Your check-in details');
    });

    it('should initialize all accordions as expanded', () => {
      expect(component.personalInfoExpanded()).toBe(true);
      expect(component.addressExpanded()).toBe(true);
      expect(component.paymentDetailsExpanded()).toBe(true);
    });

    it('should initialize form with empty values', () => {
      expect(component.form.get('personalInfo.firstName')?.value).toBe('');
      expect(component.form.get('personalInfo.lastName')?.value).toBe('');
      expect(component.form.get('personalInfo.email')?.value).toBe('');
      expect(component.form.get('personalInfo.phoneNumber')?.value).toBe('');
      expect(component.form.get('address.street')?.value).toBe('');
      expect(component.form.get('address.houseNumber')?.value).toBe('');
      expect(component.form.get('address.zipCode')?.value).toBe('');
      expect(component.form.get('address.city')?.value).toBe('');
      expect(component.form.get('address.country')?.value).toBe('');
      expect(component.form.get('paymentDetails.creditCardNumber')?.value).toBe(
        ''
      );
      expect(component.form.get('paymentDetails.expiryDate')?.value).toBe('');
      expect(component.form.get('paymentDetails.cvv')?.value).toBe('');
      expect(component.form.get('paymentDetails.cardHolderName')?.value).toBe(
        ''
      );
    });
  });

  describe('Accordion Functionality', () => {
    it('should toggle personal info accordion on click', () => {
      const button = fixture.debugElement.nativeElement.querySelector(
        '[data-testid="personal-info-accordion-button"]'
      );

      expect(component.personalInfoExpanded()).toBe(true);

      button.click();
      fixture.detectChanges();

      expect(component.personalInfoExpanded()).toBe(false);

      button.click();
      fixture.detectChanges();

      expect(component.personalInfoExpanded()).toBe(true);
    });

    it('should toggle address accordion on click', () => {
      const button = fixture.debugElement.nativeElement.querySelector(
        '[data-testid="address-accordion-button"]'
      );

      expect(component.addressExpanded()).toBe(true);

      button.click();
      fixture.detectChanges();

      expect(component.addressExpanded()).toBe(false);
    });

    it('should toggle payment details accordion on click', () => {
      const button = fixture.debugElement.nativeElement.querySelector(
        '[data-testid="payment-details-accordion-button"]'
      );

      expect(component.paymentDetailsExpanded()).toBe(true);

      button.click();
      fixture.detectChanges();

      expect(component.paymentDetailsExpanded()).toBe(false);
    });

    it('should toggle accordion on Enter key press', () => {
      expect(component.personalInfoExpanded()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onAccordionToggle('personalInfo', event);
      fixture.detectChanges();

      expect(component.personalInfoExpanded()).toBe(false);
    });

    it('should toggle accordion on Space key press', () => {
      expect(component.personalInfoExpanded()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.onAccordionToggle('personalInfo', event);
      fixture.detectChanges();

      expect(component.personalInfoExpanded()).toBe(false);
    });

    it('should ignore other key presses', () => {
      expect(component.personalInfoExpanded()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      component.onAccordionToggle('personalInfo', event);
      fixture.detectChanges();

      expect(component.personalInfoExpanded()).toBe(true);
    });

    it('should update aria-expanded attribute when accordion state changes', () => {
      const button = fixture.debugElement.nativeElement.querySelector(
        '[data-testid="personal-info-accordion-button"]'
      );

      expect(button.getAttribute('aria-expanded')).toBe('true');

      button.click();
      fixture.detectChanges();

      expect(button.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Form Validation', () => {
    describe('Personal Information Validation', () => {
      it('should validate required fields', () => {
        const firstNameControl = component.form.get('personalInfo.firstName');
        const lastNameControl = component.form.get('personalInfo.lastName');
        const emailControl = component.form.get('personalInfo.email');
        const phoneControl = component.form.get('personalInfo.phoneNumber');

        firstNameControl?.markAsTouched();
        lastNameControl?.markAsTouched();
        emailControl?.markAsTouched();
        phoneControl?.markAsTouched();

        expect(firstNameControl?.hasError('required')).toBe(true);
        expect(lastNameControl?.hasError('required')).toBe(true);
        expect(emailControl?.hasError('required')).toBe(true);
        expect(phoneControl?.hasError('required')).toBe(true);
      });

      it('should validate email format', () => {
        const emailControl = component.form.get('personalInfo.email');

        emailControl?.setValue('invalid-email');
        emailControl?.markAsTouched();

        expect(emailControl?.hasError('email')).toBe(true);

        emailControl?.setValue('valid@email.com');
        expect(emailControl?.hasError('email')).toBe(false);
      });

      it('should validate minimum length for names', () => {
        const firstNameControl = component.form.get('personalInfo.firstName');
        const lastNameControl = component.form.get('personalInfo.lastName');

        firstNameControl?.setValue('A');
        lastNameControl?.setValue('B');
        firstNameControl?.markAsTouched();
        lastNameControl?.markAsTouched();

        expect(firstNameControl?.hasError('minlength')).toBe(true);
        expect(lastNameControl?.hasError('minlength')).toBe(true);

        firstNameControl?.setValue('John');
        lastNameControl?.setValue('Doe');

        expect(firstNameControl?.hasError('minlength')).toBe(false);
        expect(lastNameControl?.hasError('minlength')).toBe(false);
      });

      it('should validate phone number format', () => {
        const phoneControl = component.form.get('personalInfo.phoneNumber');

        phoneControl?.setValue('invalid-phone');
        phoneControl?.markAsTouched();

        expect(phoneControl?.hasError('pattern')).toBe(true);

        phoneControl?.setValue('+49123456789');
        expect(phoneControl?.hasError('pattern')).toBe(false);
      });
    });

    describe('Address Validation', () => {
      it('should validate required address fields', () => {
        const streetControl = component.form.get('address.street');
        const houseNumberControl = component.form.get('address.houseNumber');
        const zipCodeControl = component.form.get('address.zipCode');
        const cityControl = component.form.get('address.city');
        const countryControl = component.form.get('address.country');

        streetControl?.markAsTouched();
        houseNumberControl?.markAsTouched();
        zipCodeControl?.markAsTouched();
        cityControl?.markAsTouched();
        countryControl?.markAsTouched();

        expect(streetControl?.hasError('required')).toBe(true);
        expect(houseNumberControl?.hasError('required')).toBe(true);
        expect(zipCodeControl?.hasError('required')).toBe(true);
        expect(cityControl?.hasError('required')).toBe(true);
        expect(countryControl?.hasError('required')).toBe(true);
      });

      it('should validate house number format', () => {
        const houseNumberControl = component.form.get('address.houseNumber');

        houseNumberControl?.setValue('abc');
        houseNumberControl?.markAsTouched();

        expect(houseNumberControl?.hasError('pattern')).toBe(true);

        houseNumberControl?.setValue('123');
        expect(houseNumberControl?.hasError('pattern')).toBe(false);
      });

      it('should validate zip code format', () => {
        const zipCodeControl = component.form.get('address.zipCode');

        zipCodeControl?.setValue('invalid@zip');
        zipCodeControl?.markAsTouched();

        expect(zipCodeControl?.hasError('pattern')).toBe(true);

        zipCodeControl?.setValue('12345');
        expect(zipCodeControl?.hasError('pattern')).toBe(false);

        zipCodeControl?.setValue('12345-6789');
        expect(zipCodeControl?.hasError('pattern')).toBe(false);
      });
    });

    describe('Payment Details Validation', () => {
      it('should validate required payment fields', () => {
        const cardNumberControl = component.form.get(
          'paymentDetails.creditCardNumber'
        );
        const expiryControl = component.form.get('paymentDetails.expiryDate');
        const cvvControl = component.form.get('paymentDetails.cvv');
        const cardHolderControl = component.form.get(
          'paymentDetails.cardHolderName'
        );

        cardNumberControl?.markAsTouched();
        expiryControl?.markAsTouched();
        cvvControl?.markAsTouched();
        cardHolderControl?.markAsTouched();

        expect(cardNumberControl?.hasError('required')).toBe(true);
        expect(expiryControl?.hasError('required')).toBe(true);
        expect(cvvControl?.hasError('required')).toBe(true);
        expect(cardHolderControl?.hasError('required')).toBe(true);
      });

      it('should validate credit card number format', () => {
        const cardNumberControl = component.form.get(
          'paymentDetails.creditCardNumber'
        );

        cardNumberControl?.setValue('123');
        cardNumberControl?.markAsTouched();

        expect(cardNumberControl?.hasError('pattern')).toBe(true);

        cardNumberControl?.setValue('1234567890123456');
        expect(cardNumberControl?.hasError('pattern')).toBe(false);

        cardNumberControl?.setValue('1234 5678 9012 3456');
        expect(cardNumberControl?.hasError('pattern')).toBe(false);
      });

      it('should validate expiry date format', () => {
        const expiryControl = component.form.get('paymentDetails.expiryDate');

        expiryControl?.setValue('13/25');
        expiryControl?.markAsTouched();

        expect(expiryControl?.hasError('pattern')).toBe(true);

        expiryControl?.setValue('12/25');
        expect(expiryControl?.hasError('pattern')).toBe(false);

        expiryControl?.setValue('01/30');
        expect(expiryControl?.hasError('pattern')).toBe(false);
      });

      it('should validate CVV format', () => {
        const cvvControl = component.form.get('paymentDetails.cvv');

        cvvControl?.setValue('12');
        cvvControl?.markAsTouched();

        expect(cvvControl?.hasError('pattern')).toBe(true);

        cvvControl?.setValue('123');
        expect(cvvControl?.hasError('pattern')).toBe(false);

        cvvControl?.setValue('1234');
        expect(cvvControl?.hasError('pattern')).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should return correct error message for required field', () => {
      const firstNameControl = component.form.get('personalInfo.firstName');
      firstNameControl?.markAsTouched();

      const error = component.getFieldError('personalInfo.firstName');
      expect(error).toBe('This field is required');
    });

    it('should return correct error message for email field', () => {
      const emailControl = component.form.get('personalInfo.email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      const error = component.getFieldError('personalInfo.email');
      expect(error).toBe('Please enter a valid email address');
    });

    it('should return correct error message for minlength', () => {
      const firstNameControl = component.form.get('personalInfo.firstName');
      firstNameControl?.setValue('A');
      firstNameControl?.markAsTouched();

      const error = component.getFieldError('personalInfo.firstName');
      expect(error).toBe('Minimum length is 2 characters');
    });

    it('should return correct error message for pattern', () => {
      const phoneControl = component.form.get('personalInfo.phoneNumber');
      phoneControl?.setValue('invalid');
      phoneControl?.markAsTouched();

      const error = component.getFieldError('personalInfo.phoneNumber');
      expect(error).toBe('Please enter a valid format');
    });

    it('should return empty string for valid field', () => {
      const firstNameControl = component.form.get('personalInfo.firstName');
      firstNameControl?.setValue('John');
      firstNameControl?.markAsTouched();

      const error = component.getFieldError('personalInfo.firstName');
      expect(error).toBe('');
    });

    it('should return empty string for untouched field', () => {
      const error = component.getFieldError('personalInfo.firstName');
      expect(error).toBe('');
    });

    it('should correctly identify invalid fields', () => {
      const firstNameControl = component.form.get('personalInfo.firstName');
      firstNameControl?.markAsTouched();

      expect(component.isFieldInvalid('personalInfo.firstName')).toBe(true);

      firstNameControl?.setValue('John');
      expect(component.isFieldInvalid('personalInfo.firstName')).toBe(false);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Reset form before each test to ensure clean state
      component.form.reset();
    });

    it('should submit form when valid', () => {
      // Fill in valid form data
      const formData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+49123456789',
        },
        address: {
          street: 'Main Street',
          houseNumber: '123',
          zipCode: '12345',
          city: 'Berlin',
          country: 'Germany',
        },
        paymentDetails: {
          creditCardNumber: '1234567890123456',
          expiryDate: '12/25',
          cvv: '123',
          cardHolderName: 'John Doe',
        },
      };

      component.form.patchValue(formData);

      const consoleSpy = jest.spyOn(console, 'log');
      component.onSubmit();

      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', formData);
      consoleSpy.mockRestore();
    });

    it('should not submit form when invalid', () => {
      // Ensure form is empty (invalid state)
      component.form.reset();

      const consoleSpy = jest.spyOn(console, 'log');
      component.onSubmit();

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should mark all fields as touched when form is invalid on submit', () => {
      // Ensure form is empty (invalid state)
      component.form.reset();

      const markAllAsTouchedSpy = jest.spyOn(
        component.form,
        'markAllAsTouched'
      );
      component.onSubmit();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      markAllAsTouchedSpy.mockRestore();
    });

    it('should reset form after successful submission', () => {
      // Fill in valid form data
      component.form.patchValue({
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+49123456789',
        },
        address: {
          street: 'Main Street',
          houseNumber: '123',
          zipCode: '12345',
          city: 'Berlin',
          country: 'Germany',
        },
        paymentDetails: {
          creditCardNumber: '1234567890123456',
          expiryDate: '12/25',
          cvv: '123',
          cardHolderName: 'John Doe',
        },
      });

      const resetSpy = jest.spyOn(component.form, 'reset');
      component.onSubmit();

      expect(resetSpy).toHaveBeenCalled();
      resetSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on accordion buttons', () => {
      const personalInfoButton =
        fixture.debugElement.nativeElement.querySelector(
          '[data-testid="personal-info-accordion-button"]'
        );
      const addressButton = fixture.debugElement.nativeElement.querySelector(
        '[data-testid="address-accordion-button"]'
      );
      const paymentButton = fixture.debugElement.nativeElement.querySelector(
        '[data-testid="payment-details-accordion-button"]'
      );

      expect(personalInfoButton.getAttribute('aria-expanded')).toBe('true');
      expect(personalInfoButton.getAttribute('aria-controls')).toBe(
        'personal-info-content'
      );

      expect(addressButton.getAttribute('aria-expanded')).toBe('true');
      expect(addressButton.getAttribute('aria-controls')).toBe(
        'address-content'
      );

      expect(paymentButton.getAttribute('aria-expanded')).toBe('true');
      expect(paymentButton.getAttribute('aria-controls')).toBe(
        'payment-details-content'
      );
    });

    it('should have proper labels for all form inputs', () => {
      const inputs = fixture.debugElement.nativeElement.querySelectorAll(
        '[data-testid$="-input"]'
      );

      inputs.forEach((input: HTMLInputElement) => {
        const label = fixture.debugElement.nativeElement.querySelector(
          `label[for="${input.id}"]`
        );
        expect(label).toBeTruthy();
        expect(label.textContent).toContain('*'); // Required fields should have asterisk
      });
    });

    it('should have proper form structure', () => {
      const form = fixture.debugElement.nativeElement.querySelector(
        '[data-testid="checkin-form"]'
      );
      expect(form).toBeTruthy();

      const submitButton = form.querySelector('[data-testid="submit-button"]');
      expect(submitButton).toBeTruthy();
      expect(submitButton.textContent.trim()).toBe('Save');
    });
  });
});
