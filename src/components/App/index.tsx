import * as React from 'react';
import './index.css';

import ParticipantType from '../../types/Participant';
import DonationType from '../../types/Donation';
import ParticipantList from '../ParticipantList';
import DonationList from '../DonationList';

import {
  getParticipantInfo,
  getRecentDonations,
} from '../../util';

interface AppProps {

}

interface AppState {
  participants: ParticipantType[];
  donations: DonationType[];
  participantInputValue: string;
  participantInputEnabled: boolean;
}

class App extends React.Component {
  private addPersonBox: HTMLInputElement | null;

  state: AppState;

  constructor(props: AppProps) {
    super(props);

    this.state = {
      participants: [],
      donations: [],
      participantInputValue: '',
      participantInputEnabled: true,
    };
  }

  onAddPersonKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!this.addPersonBox) {
      return;
    }

    if (event.key === 'Enter') {
      // Get the number from the box
      const idString = this.addPersonBox.value;
      let id;
      try {
        id = Number.parseInt(idString);
      } catch (err) {
        console.error(err);
        return;
      }

      // Disable input box while requesting
      this.setState({
        ...this.state,
        participantInputEnabled: false,
      });

      getParticipantInfo(id)
        .then((participant) => {
          // Check to see if participant is already in the list
          const participants = this.state.participants;
          const existing = participants.find(p => p.id === participant.id);

          if (existing) {
            // Update data
            existing.updateData(participant);
          } else {
            // Add participant to list
            participants.push(participant);
          }

          // Update state
          this.setState({
            ...this.state,
            participants,
            participantInputValue: '',
            participantInputEnabled: true,
          });
        });
    }
  }

  onAddPersonValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      ...this.state,
      participantInputValue: event.target.value,
    });
  }

  onGetDonationsClick(event: React.MouseEvent<HTMLButtonElement>) {
    const promises = this.state.participants.map(getRecentDonations);
    Promise.all(promises)
      .then((dArr) => {
        const a: DonationType[] = [];
        return a.concat(...dArr);
      })
      .then((donations) => {
        donations.sort((a, b) => {
          return a.timestamp.valueOf() - b.timestamp.valueOf();
        });

        this.setState({
          ...this.state,
          donations,
        });
      });
  }

  onParticipantRemoveClick(participant: ParticipantType) {
    // Ensure participant is actually in array
    const index = this.state.participants.indexOf(participant);
    if (index === -1) {
      // May want to display some sort of error?
      return;
    }

    this.state.participants.splice(index, 1);
    this.forceUpdate();
  }

  onDonationRemoveClick(donation: DonationType) {
    // Ensure donation is actually in array
    const index = this.state.donations.indexOf(donation);
    if (index === -1) {
      // May want to display some sort of error?
      return;
    }

    this.state.donations.splice(index, 1);
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Extra Life Donation Viewer</h1>
        </header>
        <div className="App-body">

          <div className="App-controls-container">
            <div className="App-add-participant">
              <input
                className="App-add-participant-input"
                type="text"
                ref={e => this.addPersonBox = e}
                placeholder="ID of Participant"
                value={this.state.participantInputValue}
                disabled={!this.state.participantInputEnabled}
                onChange={e => this.onAddPersonValueChange(e)}
                onKeyPress={e => this.onAddPersonKeyPress(e)}
              />
            </div>

            <div className="App-refresh-donations">
              <button
                className="App-refresh-donations-button"
                onClick={e => this.onGetDonationsClick(e)}
              >Refresh Donations</button>
            </div>
          </div>

          <h2>Participants</h2>
          <ParticipantList
            participants={this.state.participants}
            onRemove={p => this.onParticipantRemoveClick(p)}
          />

          <h2>Donations</h2>
          <DonationList
            donations={this.state.donations}
            onRemove={d => this.onDonationRemoveClick(d)}
          />
        </div>
      </div>
    );
  }
}

export default App;
