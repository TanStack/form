import React from 'react'
//
import ReactStory, { defaultProps } from 'react-story'
//
import Readme from './stories/Readme'
import KitchenSink from './stories/KitchenSink'
import Checkbox from './stories/Checkbox'
import Text from './stories/Text'

export default class App extends React.Component {
  render() {
    return (
      <ReactStory
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
        pathPrefix="story/"
        StoryWrapper={props => (
          <defaultProps.StoryWrapper
            css={{
              padding: 0
            }}
          >
            <a
              href="//github.com/tannerlinsley/react-form"
              style={{
                display: 'block',
                textAlign: 'center',
                borderBottom: 'solid 3px #cccccc'
              }}
            >
              <img
                src="//npmcdn.com/react-form/media/banner.png"
                alt="React Form Logo"
                style={{
                  width: '200px'
                }}
              />
            </a>
            <div
              {...props}
              style={{
                padding: '10px'
              }}
            />
          </defaultProps.StoryWrapper>
        )}
        stories={[
          {
            name: 'Readme & Documentation',
            component: Readme
          },
          {
            name: 'Kitchen Sink',
            component: KitchenSink
          },
          {
            name: 'Checkbox',
            component: Checkbox
          },
          {
            name: 'Text',
            component: Text
          }
        ]}
      />
    )
  }
}
