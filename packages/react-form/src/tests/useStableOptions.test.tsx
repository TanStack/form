/// <reference lib="dom" />
import { describe, it } from 'vitest'
import React, { useState } from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { useStableOpts } from '../utils/useStableOptions'

const user = userEvent.setup()

describe('useStableOpts', () => {
  it('should not re-render keys to stabilize', async () => {
    const Child = ({ options }: { options: { a: number } }) => {
      return <div>{options.a}</div>
    }

    const Parent = () => {
      const [opts, setOpts] = useState({
        a: 1,
      })

      const options = useStableOpts(opts, {
        unstableKeys: [],
        stableKeys: ['a'],
      } as const)
      return (
        <div>
          <Child options={options} />
          <button onClick={() => setOpts({ a: 2 })}>Change a</button>
        </div>
      )
    }

    const { getByText } = render(<Parent />)
    expect(getByText('1')).toBeInTheDocument()
    await user.click(getByText('Change a'))
    expect(getByText('1')).toBeInTheDocument()
  })

  it('should re-render unstable keys', async () => {
    const Child = ({ options }: { options: { a: () => number } }) => {
      return <div>{options.a()}</div>
    }

    const Parent = () => {
      const [opts, setOpts] = useState({
        a: () => 1 as number,
      })

      const options = useStableOpts(opts, {
        unstableKeys: ['a'],
        stableKeys: [],
      } as const)
      return (
        <div>
          <Child options={options} />
          <button onClick={() => setOpts({ a: () => 2 })}>Change a</button>
        </div>
      )
    }

    const { getByText } = render(<Parent />)
    expect(getByText('1')).toBeInTheDocument()
    await user.click(getByText('Change a'))
    await waitFor(() => expect(getByText('2')).toBeInTheDocument())
  })
})
