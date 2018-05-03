import React, { Component } from 'react'

//

import withField from '../withField'

class SelectWrapper extends Component {

  constructor (props) {
    super(props)
    this.state = SelectWrapper.parseOptions(props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.options !== nextProps.options ||
        this.props.placeholder !== nextProps.placeholder) {
      this.setState(SelectWrapper.parseOptions(nextProps))
    }
  }

  static parseOptions ({ options, placeholder }) {
    const resolvedOpts = options.find(d => d.value === '') || placeholder === false
      ? options
      : [
        {
          label: placeholder || 'Select One...',
          value: '',
          disabled: true,
        },
        ...options,
      ]

    const indexes = resolvedOpts.reduce((acc, cur) => {
      if (cur.options) {
        return [...acc, ...cur.options]
      }
      return [...acc, cur]
    }, [])

    const values = indexes.reduce((acc, cur, i) => {
      acc[cur.value] = i
      return acc
    }, {})

    return { indexes, values, options: resolvedOpts }
  }

  static renderOpt (option, values) {
    return (
      <option key={option.value} value={values[option.value]} disabled={option.disabled}>
        {option.label}
      </option>
    )
  }

  render () {
    const {
      fieldApi: { value, setValue, setTouched },
      onChange,
      onBlur,
      placeholder,
      ...rest
    } = this.props

    const { options, indexes, values } = this.state

    const nullIndex = values['']
    const selectedIndex = values[value]

    return (
      <select
        {...rest}
        value={typeof selectedIndex !== 'undefined' ? selectedIndex : nullIndex}
        onChange={e => {
          const val = indexes[e.target.value].value
          setValue(val)
          if (onChange) {
            onChange(val, e)
          }
        }}
        onBlur={e => {
          setTouched()
          if (onBlur) {
            onBlur(e)
          }
        }}
      >

        {options.map(option => {
          if (option.options) {
            return (
              <optgroup key={option.label} label={option.label}>
                {option.options.map(inneropt => (
                  SelectWrapper.renderOpt(inneropt, values)))}
              </optgroup>
            )
          }
          return SelectWrapper.renderOpt(option, values)
        })}
      </select>
    )
  }
}

const Select = withField(SelectWrapper)

export default Select
