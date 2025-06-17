import '@analogjs/vitest-angular/setup-snapshots'
import '@testing-library/jest-dom/vitest'

import { NgModule, provideZonelessChangeDetection } from '@angular/core'
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing'
import { getTestBed } from '@angular/core/testing'

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
export class ZonelessTestModule {}

getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule, ZonelessTestModule],
  platformBrowserDynamicTesting(),
)
