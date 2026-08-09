import { provideZonelessChangeDetection } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import {
  QueryClient,
  provideTanStackQuery,
} from '@tanstack/angular-query-experimental'
import { AppComponent } from './app.component'
import './styles.css'

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideTanStackQuery(new QueryClient()),
  ],
}).catch((error) => console.error(error))
