import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from 'src/app/services/user.service';
import { geText, query } from 'src/testing';

import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  beforeEach(async () => {

    const spy = jasmine.createSpyObj('UsersService', ['create']);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegisterFormComponent],
      providers: [
        { provide: UsersService, useValue: spy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the emailField be invalid', () => {
    // Arrange
    component.form.get('email')?.setValue('esto no es un correro');
    expect(component.form.get('email')?.invalid).withContext('wrong email').toBeTruthy();

    component.form.get('email')?.setValue(' ');
    expect(component.form.get('email')?.invalid).withContext('emty email').toBeTruthy();
  });

  it('should the passwordField be invalid', () => {
    // Arrange
    component.form.get('password')?.setValue(' ');
    expect(component.form.get('password')?.invalid).withContext('emty password').toBeTruthy();

    component.form.get('password')?.setValue('12345');
    expect(component.form.get('password')?.invalid).withContext('wrong password').toBeTruthy();

    component.form.get('password')?.setValue('jjajhhhdhdhdhd');
    expect(component.form.get('password')?.invalid).withContext('No tiene número').toBeTruthy();

    component.form.get('password')?.setValue('jjajh3hhd2hdhdhd');
    expect(component.form.get('password')?.valid).withContext('Valido').toBeTruthy();
  });
  it('should the form be invalid', () => {
    // Arrange
    component.form.patchValue({
      name: 'Manuel',
      email: 'manuel@gmail.com',
      password: '123456',
      confirmPassword: '123456',
      checkTerms: false
    });
    // Assert
    expect(component.form.invalid).toBeTruthy();
  });



  it('should the emailField be invalid from UI', () => {
    // Arrange
    const inputDebug = query(fixture, 'input#email');
    const inputELement: HTMLInputElement = inputDebug.nativeElement;
    inputELement.value = 'esto no es un correro';
    inputELement.dispatchEvent(new Event('input'));
    inputELement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.form.get('email')?.invalid).withContext('wrong email').toBeTruthy();

    const textError = geText(fixture, 'emailField-email');
    expect(textError).toContain("*It's not a email")

  });
});
