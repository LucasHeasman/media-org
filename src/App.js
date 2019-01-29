import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Reactstrap css
import 'bootstrap/dist/css/bootstrap.min.css';

// Styling
import './App.css';

// Pages
import HomePage from './containers/HomePage';
import VideoCollectionPage from './containers/VideoCollectionPage';
import VideoPage from './containers/VideoPage';
import ImageCollectionPage from './containers/ImageCollectionPage';
import ImagePage from './containers/ImagePage';
import SettingsPage from './containers/SettingsPage';
import ErrorPage from './containers/ErrorPage';

// Components
import Navigation from './components/Navigation';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
          <Switch>
            <Route path="/" component={HomePage} exact/>
            <Route path="/videos" component={VideoCollectionPage} />
            <Route path="/video" component={VideoPage} />
            <Route path="/images" component={ImageCollectionPage} />
            <Route path="/image" component={ImagePage} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={ErrorPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
