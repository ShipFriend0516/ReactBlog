import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

// Components must be here!
import NavBar from './components/NavBar'
import routes from './routes'


function App() {

  return (
    <Router>
      <NavBar />
      <div className='container mt-3'>
        <Switch>
          { routes.map((route)=> {
              return <Route exact key={route.path} path={route.path} component={route.component}/>
          }) }
        </Switch>
      </div>
    </Router>
    
    
  );

}


export default App;