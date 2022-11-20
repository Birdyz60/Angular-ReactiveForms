import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomerComponent } from './customer.component';

describe('CustomerComponent', () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Check initial form values', () => {
    const customerForm = component.customerForm;

    const expectedCustomerFormValue = {
      firstName: '',
      lastName: '',
      emailGroup: {
        email: '',
        confirmEmail: ''
      },
      phone: '',
      notification: 'email',
      rating: null,
      sendCatalog: false,
      addresses: [{
        addressType: 'home',
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
      }]
    };

    expect(customerForm.value).toEqual(expectedCustomerFormValue);
  });

  it('Check value when an address is added', () => {
    const customerForm = component.customerForm;
    component.addAddress();

    const expectedCustomerFormValue = {
      firstName: '',
      lastName: '',
      emailGroup: {
        email: '',
        confirmEmail: ''
      },
      phone: '',
      notification: 'email',
      rating: null,
      sendCatalog: false,
      addresses: [{
        addressType: 'home',
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
      }, {
        addressType: 'home',
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
      }]
    };

    expect(customerForm.value).toEqual(expectedCustomerFormValue);
  });
});
