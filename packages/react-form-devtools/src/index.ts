'use client'
import React from 'react'
import * as Devtools from './FormDevtools'

export const FormDevtools: (typeof Devtools)['FormDevtools'] =
  process.env.NODE_ENV !== 'development'
    ? function () {
        return React.createElement('div')
      }
    : Devtools.FormDevtools

export { FormDevtoolsPlugin } from './plugin'
