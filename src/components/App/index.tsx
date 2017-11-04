import * as React from 'react';
import './index.css';

import ParticipantType from '../../types/Participant';
import DonationType from '../../types/Donation';
import RaffleType from '../../types/Raffle';
import ParticipantList from '../ParticipantList';
import DonationList from '../DonationList';
import RaffleList from '../RaffleList';
import Countdown from '../Countdown';

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
  raffles: RaffleType[];
  lastUpdate: number;
  nextUpdate: number;
  autoRefresh: boolean;
}

const REFRESH_TIMER = 1000 * 60 * 2; // 2 minutes

class App extends React.Component {
  private addPersonBox: HTMLInputElement | null;

  private addRaffleName: HTMLInputElement | null;
  private addRafflePattern: HTMLInputElement | null;
  private addRaffleTime: HTMLInputElement | null;
  private addRaffleTicketSize: HTMLInputElement | null;

  state: AppState;

  constructor(props: AppProps) {
    super(props);

    this.state = {
      participants: [],
      donations: [],
      removedDonations: [],
      raffles: [],
      participantInputValue: '',
      participantInputEnabled: true,
      refreshButtonEnabled: true,
      lastUpdate: 0,
      nextUpdate: 0,
      autoRefresh: this.loadAutoRefresh(),
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

  saveAutoRefresh(value?: boolean) {
    const toSave = (value !== undefined) ? value : this.state.autoRefresh;

    localStorage.setItem('autorefresh', toSave.toString());
  }

  loadAutoRefresh() {
    return (localStorage.getItem('autorefresh') || 'true') === 'true';
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
          lastUpdate: Date.now(),
          nextUpdate: Date.now() + REFRESH_TIMER,
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

        // Add donations to any active raffles
        if (this.state.raffles.length) {
          donations.forEach((donation) => {
            this.state.raffles.forEach((raffle) => {
              raffle.add(donation);
            });
          });
        }

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

  addParticipant(id: number) {
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

      this.addParticipant(id);
    }
  }

  onAddPersonButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!this.addPersonBox) {
      return;
    }

    // Get the number from the box
    const idString = this.addPersonBox.value;
    let id;
    try {
      id = Number.parseInt(idString);
    } catch (err) {
      console.error(err);
      return;
    }

    this.addParticipant(id);
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

  onAddRaffleClick(event: React.MouseEvent<HTMLButtonElement>) {
    // Ensure input elements are non-null
    if (!(
      this.addRaffleName &&
      this.addRafflePattern &&
      this.addRaffleTime &&
      this.addRaffleTicketSize
    )) {
      console.error('Tried to add a raffle, but no reference to <input>s');
      return;
    }

    const name = this.addRaffleName.value;
    const pattern = this.addRafflePattern.value;
    const time = Number.parseInt(this.addRaffleTime.value);
    const ticketSize = Number.parseInt(this.addRaffleTicketSize.value);

    if (!(name && pattern && time)) {
      console.error('Tried to add a raffle, but one of the <input>s has no value');
      return;
    }

    const raffle = new RaffleType(
      name,
      new Date(Date.now() + (time * 1000 * 60)),
      pattern,
      () => {
        this.forceUpdate();
      },
      ticketSize,
    );

    this.state.raffles.push(raffle);

    this.addRaffleName.value = '';
    this.addRafflePattern.value = '';
    this.addRaffleTime.value = '';
    this.addRaffleTicketSize.value = '';

    this.forceUpdate();
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

  onRaffleRemoveClick(raffle: RaffleType) {
    // Ensure donation is actually in array
    const index = this.state.raffles.indexOf(raffle);
    if (index === -1) {
      // May want to display some sort of error?
      return;
    }

    raffle.cancel();

    // Remove from list
    this.state.raffles.splice(index, 1);
    this.forceUpdate();
  }

  onRaffleSelectDonationClick(raffle: RaffleType) {
    // Ensure donation is actually in array
    const index = this.state.raffles.indexOf(raffle);
    if (index === -1) {
      // May want to display some sort of error?
      return;
    }

    // Ensure the latest donations are in the list
    let prom;
    if (this.state.lastUpdate < raffle.endTime.valueOf()) {
      prom = this.refreshInformation();
    } else {
      prom = Promise.resolve();
    }
    prom
      .then(() => {
        raffle.selectWinner();
        this.forceUpdate();
      });
  }

  onRefreshCountdownFinish() {
    this.refreshInformation();
  }

  onRefreshToggleClick(event: React.MouseEvent<HTMLButtonElement>) {
    this.saveAutoRefresh(!this.state.autoRefresh);

    console.log(this.state.autoRefresh);

    this.setState({
      ...this.state,
      autoRefresh: !this.state.autoRefresh,
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Extra Life Donation Viewer</h1>
          <button
            className="App-refresh-button"
            disabled={!this.state.refreshButtonEnabled}
            onClick={e => this.onGetDonationsClick(e)}
          >Refresh Info</button>
        </header>
        <div className="App-body">
          <div className="App-status-container">
            <div className="App-status-autorefresh">
              <button
                className="App-autorefresh-button"
                onClick={e => this.onRefreshToggleClick(e)}
              >{this.state.autoRefresh ? 'Dis' : 'En'}able Autorefresh</button>
              <p>
                Time to next refresh: {this.state.autoRefresh ? (
                  <Countdown
                    className="App-autorefresh-countdown"
                    time={new Date(this.state.nextUpdate)}
                    onFinish={() => this.onRefreshCountdownFinish()}
                  />
                ) : (
                  <em>Disabled</em>
                )}
              </p>
            </div>
          </div>
          <div className="App-participants-container">
            <h1>Participants</h1>
            <div className="App-add-participant">
              <h3 className="App-add-participant-title">Add Participant</h3>
              <div className="App-add-participant-controls">
                <input
                  className="App-add-participant-input"
                  type="text"
                  ref={e => this.addPersonBox = e}
                  placeholder="ID"
                  value={this.state.participantInputValue}
                  disabled={!this.state.participantInputEnabled}
                  onChange={e => this.onAddPersonValueChange(e)}
                  onKeyPress={e => this.onAddPersonKeyPress(e)}
                />
                <button
                  className="App-add-participant-button"
                  disabled={!this.state.participantInputEnabled}
                  onClick={e => this.onAddPersonButtonClick(e)}
                >Add</button>
              </div>
            </div>
            <ParticipantList
              participants={this.state.participants}
              onRemove={p => this.onParticipantRemoveClick(p)}
            />
          </div>

          <div className="App-donations-container">
            <h1>Donations</h1>
            <h2>Unread</h2>
            <DonationList
              donations={this.state.donations}
              onRemove={d => this.onDonationRemoveClick(d)}
            />
            <h2>Read</h2>
            <DonationList
              donations={this.state.removedDonations}
            />
          </div>

          <div className="App-raffles-container">
            <h1>Raffles</h1>
            <div className="App-add-raffle">
              <h3 className="App-add-raffle-title">Add Raffle</h3>
              <div className="App-add-raffle-controls">
                <input
                  className="App-add-raffle-name"
                  ref={e => this.addRaffleName = e}
                  type="text"
                  name="raffle-name"
                  id="raffle-name"
                  placeholder="Raffle Name"
                />
                <input
                  className="App-add-raffle-pattern"
                  ref={e => this.addRafflePattern = e}
                  type="text"
                  name="raffle-pattern"
                  id="raffle-pattern"
                  placeholder="Match Pattern"
                />
                <input
                  className="App-add-raffle-time"
                  ref={e => this.addRaffleTime = e}
                  type="number"
                  name="raffle-time"
                  id="raffle-time"
                  placeholder="Length (Minutes)"
                  min={1}
                />
                <input
                  className="App-add-raffle-ticket-size"
                  ref={e => this.addRaffleTicketSize = e}
                  type="number"
                  name="raffle-time"
                  id="raffle-time"
                  placeholder="Ticket Size ($)"
                  min={0.01}
                  step={0.01}
                />
                <button
                  className="App-add-raffle-button"
                  onClick={e => this.onAddRaffleClick(e)}
                >Add</button>
              </div>
            </div>
            <RaffleList
              raffles={this.state.raffles}
              onRemove={r => this.onRaffleRemoveClick(r)}
              onSelectDonation={r => this.onRaffleSelectDonationClick(r)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
