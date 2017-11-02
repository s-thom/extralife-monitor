import * as React from 'react';
import './index.css';

import ParticipantType from '../../types/Participant';
import DonationType from '../../types/Donation';
import ParticipantList from '../ParticipantList';
import DonationList from '../DonationList';

import {
  getParticipantInfo,
} from '../../util';

const logo = require('./logo.svg');

interface AppProps {

}

interface AppState {
  participants: ParticipantType[];
  donations: DonationType[];
}

class App extends React.Component {
  private addPersonBox: HTMLInputElement | null;

  state: AppState;

  constructor(props: AppProps) {
    super(props);

    this.state = {
      participants: [],
      donations: [],
    };
  }

  onAddPersonKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!this.addPersonBox) {
      return;
    }

    if (event.key === 'Enter') {
      const idString = this.addPersonBox.value;
      let id;
      try {
        id = Number.parseInt(idString);
      } catch (err) {
        console.error(err);
        return;
      }

      getParticipantInfo(id)
        .then((participant) => {
          this.setState({
            ...this.state,
            participants: [
              ...this.state.participants,
              participant,
            ],
          });
        });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </header>
        <div className="App-body">
          <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to reload.
          </p>
          <div className="App-add-participant">
            <input
              type="text"
              ref={e => this.addPersonBox = e}
              onKeyPress={e => this.onAddPersonKeyPress(e)}
            />
          </div>
          <ParticipantList participants={this.state.participants} />
          <DonationList donations={this.state.donations} />
        </div>
      </div>
    );
  }
}

export default App;
