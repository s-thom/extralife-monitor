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
  removedDonations: DonationType[];
  participantInputValue: string;
  participantInputEnabled: boolean;
  refreshButtonEnabled: boolean;
}

class App extends React.Component {
  private addPersonBox: HTMLInputElement | null;

  state: AppState;

  constructor(props: AppProps) {
    super(props);

    this.state = {
      participants: [],
      donations: [],
      removedDonations: [],
      participantInputValue: '',
      participantInputEnabled: true,
      refreshButtonEnabled: true,
    };

    this.loadParticipants();
  }

  saveParticipants() {
    const str = this.state.participants.map(p => p.id).join(',');
    localStorage.setItem('participants', str);
  }

  loadParticipants() {
    const str = localStorage.getItem('participants');
    if (!str) {
      return;
    }

    const idArr = str
      .split(',')
      .map(s => Number.parseInt(s, 10))
      .filter(n => n); // Remove undefineds

    return Promise.resolve(idArr)
      // Get participant info
      .then((ids) => {
        return this.getParticipants(ids);
      })
      // Get donation info
      .then((participants) => {
        return this.getDonations(participants);
      });
  }

  saveRemovedDonations() {
    localStorage.setItem(
      'removedDonations',
      JSON.stringify(this.state.removedDonations.map(d => d.id)),
    );
  }

  refreshInformation() {
    // Disable refresh button
    this.setState({
      ...this.state,
      refreshButtonEnabled: false,
    });

    const idArr = this.state.participants
      .map(p => p.id);

    return Promise.resolve(idArr)
      // Get participant info
      .then((ids) => {
        return this.getParticipants(ids);
      })
      // Get donation info
      .then((participants) => {
        return this.getDonations(participants);
      })
      .then(() => {
        // Re-enable the refresh button
        this.setState({
          ...this.state,
          refreshButtonEnabled: true,
        });
      });
  }

  getParticipants(ids: number[]) {
    // Get all participants' info
    return Promise.all(ids.map(p => getParticipantInfo(p)))
      .then((participants) => {
        // Save in state
        this.setState({
          ...this.state,
          participants,
        });
        return participants;
      });
  }

  getDonations(participants: ParticipantType[]) {
    // Get donations for all participants
    const dProm = Promise.all(participants.map(p => getRecentDonations(p)))
      .then((dArr) => {
        const a: DonationType[] = [];
        return a.concat(...dArr);
      });

    // Add donations to state
    return dProm
      .then((donationArr) => {
        // Sort by time
        donationArr.sort((a, b) => {
          return a.timestamp.valueOf() - b.timestamp.valueOf();
        });

        // Filter out donations that have already been dismissed
        // Get IDs of removed donations
        const str = localStorage.getItem('removedDonations') || '[]';
        const removedIds: string[] = JSON.parse(str);

        // Split donations into active and removed arrays
        const donations: DonationType[] = [];
        const removedDonations: DonationType[] = [];
        donationArr.forEach((donation) => {
          if (removedIds.indexOf(donation.id) > -1) {
            removedDonations.push(donation);
          } else {
            donations.push(donation);
          }
        });

        // Save in state
        this.setState({
          ...this.state,
          donations,
          removedDonations,
        });

        this.saveRemovedDonations();

        return donations;
      });
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

          this.saveParticipants();
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
    this.refreshInformation();
  }

  onParticipantRemoveClick(participant: ParticipantType) {
    // Ensure participant is actually in array
    const index = this.state.participants.indexOf(participant);
    if (index === -1) {
      // May want to display some sort of error?
      return;
    }

    this.state.participants.splice(index, 1);
    this.saveParticipants();
    this.forceUpdate();
  }

  onDonationRemoveClick(donation: DonationType) {
    // Ensure donation is actually in array
    const index = this.state.donations.indexOf(donation);
    if (index === -1) {
      // May want to display some sort of error?
      return;
    }

    // Remove from list, add to removed list, saave removed list
    this.state.donations.splice(index, 1);
    this.state.removedDonations.push(donation);
    this.saveRemovedDonations();

    // Sort by time
    this.state.removedDonations.sort((a, b) => {
      return a.timestamp.valueOf() - b.timestamp.valueOf();
    });

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
                disabled={!this.state.refreshButtonEnabled}
                onClick={e => this.onGetDonationsClick(e)}
              >Refresh Info</button>
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

          <h2>Removed Donations</h2>
          <DonationList
            donations={this.state.removedDonations}
          />
        </div>
      </div>
    );
  }
}

export default App;
