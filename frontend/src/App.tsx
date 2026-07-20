import { Route, Router, Switch } from 'wouter'
import { Home } from './pages/Home'
import { Player } from './pages/Player'
import { Weekly } from './pages/Weekly'
import { Leaderboard } from './pages/Leaderboard'
import { Admin } from './pages/Admin'
import { Heroes } from './pages/Heroes'
import { CreateHero } from './pages/CreateHero'
import { Avatars } from './pages/Avatars'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <Router base={base || undefined}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/heroes" component={Heroes} />
        <Route path="/create" component={CreateHero} />
        <Route path="/player/:id" component={Player} />
        <Route path="/avatars" component={Avatars} />
        <Route path="/weekly" component={Weekly} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/admin" component={Admin} />
        <Route>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
