import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn {
  return function ratingRange(c: AbstractControl): { [key: string]: boolean } | null {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range': true };
    }
    return null;
  }
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  if (emailControl?.pristine || confirmEmailControl?.pristine)
    return null;

  if (emailControl?.value === confirmEmailControl?.value) {
    return null;
  }
  return { 'match': true };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();
  emailMessage!: string;

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required]
      }, { validator: emailMatcher } as AbstractControlOptions /* CF https://stackoverflow.com/questions/65594627/angular-formbuilder-group-is-deprecated */),
      phone: [''],
      notification: ['email'],
      rating: [null, ratingRange(1, 5)],
      sendCatalog: false,
      addresses: this.formBuilder.array([this.buildAddress()])
    });
    this.customerForm.get('notification')?.valueChanges
      .subscribe(value => this.setNotification(value));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      () => {
        this.setMessage(emailControl);
      }
    );
  }

  private buildAddress(): FormGroup {
    return this.formBuilder.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Harkness',
      email: 'jack@torchwood.com',
      sendCatalog: false
    });
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (phoneControl) {
      if (notifyVia === 'text') {
        phoneControl.setValidators([Validators.required]);
      } else {
        phoneControl.clearValidators();
      }
      phoneControl.updateValueAndValidity();
    }
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map<string>(
        // CF https://bobbyhadz.com/blog/typescript-element-implicitly-has-any-type-expression#:~:text=The%20error%20%22Element%20implicitly%20has,one%20of%20the%20object's%20keys.
        key => this.validationMessages[key as keyof typeof this.validationMessages]).join(' ');
    }
  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }
}
