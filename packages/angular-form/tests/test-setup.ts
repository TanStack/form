import '@analogjs/vitest-angular/setup-snapshots'
import '@testing-library/jest-dom/vitest'

import { NgModule, provideZonelessChangeDetection } from '@angular/core'
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing'
import { getTestBed } from '@angular/core/testing'

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
export class ZonelessTestModule {}

getTestBed().initTestEnvironment(
  [BrowserTestingModule, ZonelessTestModule],
  platformBrowserTesting(),
)
