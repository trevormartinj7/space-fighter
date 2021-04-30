import Grid from './components/Grid'
import Header from './components/Header'
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="header">
        <Header/>
      </div>
      <div className="body">
        <Grid/>
      </div>
      
    </div>
  );
}

export default App;
