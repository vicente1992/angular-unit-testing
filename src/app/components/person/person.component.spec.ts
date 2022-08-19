import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Person } from './../../models/person';

import { PersonComponent } from './person.component';
import { first } from 'rxjs/operators';
import { clickEvent, geText, queryById } from 'src/testing';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, PersonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.person = new Person('Nicolas', 'Molina', 28, 68, 1.65);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should the name be 'nicolas'", () => {
    expect(component.person.name).toEqual('Nicolas');
  });

  it('should have <h3> with person name', () => {
    const expectMsg = `Hola, ${component.person.name}`;
    const texyRta = geText(fixture, 'title');
    expect(texyRta).not.toBeNull();
    expect(texyRta).toEqual(expectMsg);
  });

  it('should have <p> with person height', () => {
    const expectMsg = `Mi altura es ${component.person.height}`;
    const texyRta = geText(fixture, 'text');
    expect(texyRta).not.toBeNull();
    expect(texyRta).toEqual(expectMsg);
  });

  it('should display a different height', () => {
    // Arrange
    component.person.height = 999;
    const expectMsg = `Mi altura es ${component.person.height}`;
    const pDebug = debugElement.query(By.css('p'));
    const p: HTMLElement = pDebug.nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(p?.textContent).toEqual(expectMsg);
  });

  it('should have <h3> contain  person name', () => {
    // Arrange
    const expectName = 'Valentina';
    component.person.name = expectName;
    const h3: HTMLElement = debugElement.query(By.css('h3')).nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(h3?.textContent).toContain(expectName);
  });

  it('should display un text with IMC', () => {
    // Arrange
    const expectText = 'overweight';
    // Act
    component.calcIMC();
    fixture.detectChanges();
    // Assert
    const textBtn = geText(fixture, 'btn-imc');
    expect(textBtn).toContain(expectText);
  });

  it('should display un text with IMC with click', () => {
    // Arrange
    const expectText = 'overweight';
    // Act
    clickEvent(fixture, 'btn-imc', true)
    fixture.detectChanges();
    // Assert
    const textBtn = geText(fixture, 'btn-imc');
    expect(textBtn).toContain(expectText);
  });

  it('should raise selected event when clicked', () => {
    // Arrange
    const expectedPerson = new Person('Nicolas', 'Molina', 28, 68, 1.65);
    const buttonDe = queryById(fixture, 'btn-person');
    let selectedPerson: Person | undefined;
    component.onSelected
      .pipe(first())
      .subscribe((person: Person) => {
        selectedPerson = person;
      });
    // Act
    component.person = expectedPerson;
    buttonDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(selectedPerson).toEqual(expectedPerson);
  });
});

@Component({
  template: `
    <app-person
      [person]="person" (onSelected)="onSelected($event)">
    </app-person>`
})
class TestHostComponent {
  person: Person = new Person('Nicolas', 'Molina', 28, 68, 1.65);;
  selectedPerson: Person | undefined;
  onSelected(person: Person) {
    this.selectedPerson = person;
  }
}

describe('PersonComponent from HostComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, PersonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display person name', () => {
    const expectedName = component.person.name;
    const personDe = debugElement.query(By.css('app-person h3'));
    const personEl = personDe.nativeElement;
    expect(personEl.textContent).toContain(expectedName);
  });

  it('should raise selected event when clicked', () => {
    clickEvent(fixture, 'btn-person', true)
    fixture.detectChanges();
    expect(component.selectedPerson).toEqual(component.person);
  });
});
