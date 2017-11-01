import * as React from 'react';
import './index.css';

import ParticipantType from '../../types/Participant';
import DonationType from '../../types/Donation';
import Participant from '../Participant';
import DonationList from '../DonationList';

const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    const p = new ParticipantType({
      displayName: 'test',
      totalRaisedAmount: 10,
      fundraisingGoal: 20,
      participantID: 1,
      avatarImageURL: './logo.svg',
    });

    const d = new DonationType(
      {
        message: null,
        donorName: 'Alice',
        timestamp: Date.now(),
        donationAmount: 10,
      },
      p,
    );

    const d2 = new DonationType(
      {
        message: 'here is a message',
        donorName: 'Alice',
        timestamp: Date.now(),
        donationAmount: 10,
      },
      p,
    );

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
          <Participant info={p} />
          <DonationList donations={[d, d2]} />
        </div>
      </div>
    );
  }
}

export default App;
