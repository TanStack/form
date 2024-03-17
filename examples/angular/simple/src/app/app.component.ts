import { Component } from '@angular/core'
import { TestComponent } from '@tanstack/angular-form'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TestComponent],
  template: `<test-component/>`,
})
export class AppComponent {}
