import 'babel-polyfill'
import './assets/prism'
import { Render, Router, Route, IndexRoute } from 'jumpsuit'
//
import Layout from 'components/layout'
import Simple from 'screens/simple'

Render(null, (
  <Router>
    <Route path='/' component={Layout}>
      <IndexRoute component={Simple} />
      <Route path='simple' component={Simple} />
    </Route>
  </Router>
), {
  useHash: false
})
