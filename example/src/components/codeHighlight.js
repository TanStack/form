export default ({language = 'jsx', children}) => {
  return (
    <pre>
      <code className={'language-' + language}>
        {children()}
      </code>
    </pre>
  )
}
