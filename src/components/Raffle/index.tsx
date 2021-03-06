import * as React from 'react';

import RaffleType from '../../types/Raffle';
import Donation from '../Donation';
import Countdown from '../Countdown';
import './index.css';

interface Props {
  info: RaffleType;
  onSelectDonation: (raffle: RaffleType) => void;
  onRemove?: (raffle: RaffleType) => void;
}

export default function Raffle({
  info,
  onSelectDonation,
  onRemove,
}: Props) {
  return (
    <div className="Raffle">
      <header className="Raffle-header">
        <div className="Raffle-info">
          <h2 className="Raffle-amount">${info.donationTotal.toFixed(2)}</h2>
          <h3 className="Raffle-count">
            {info.donationCount} donation{info.donationCount !== 1 ? 's' : ''}
          </h3>
        </div>
        <div className="Raffle-info">
          <h2 className="Raffle-name">{info.name}</h2>
          <Countdown className="Raffle-countdown" time={info.endTime} />
        </div>
        {
          onRemove && (
            <button
              className="Raffle-remove"
              onClick={() => onRemove(info)}
            >❌</button>
          )
        }
      </header>
      <div className="Raffle-body">
        <p className="Raffle-ticket-size">
          Ticket size: <em><span>${info.ticketSize.toFixed(2)}</span></em>
        </p>
        {
          info.finished && (
            <div className="Raffle-finished">
              <button
                className="Raffle-select-winner-button"
                onClick={() => onSelectDonation(info)}
              >{info.winner ? 'Res' : 'S'}elect winner</button>
              {
                info.winner ? (
                  <Donation info={info.winner} />
                ) : (
                  <p className="Raffle-no-winner">No winner has been selected yet</p>
                )
              }
            </div>

          )
        }
      </div>
    </div>
  );
}
