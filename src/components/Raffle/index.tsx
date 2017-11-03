import * as React from 'react';

import RaffleType from '../../types/Raffle';
import Donation from '../Donation';
import './index.css';

interface Props {
  info: RaffleType;
  onRemove?: (raffle: RaffleType) => void;
}

export default function Raffle({
  info,
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

        <h2 className="Raffle-name">{info.name}</h2>

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
        {/* TODO: Winner information? End time information? */}
        {
          info.finished && (
            info.winner ? (
              <Donation info={info.winner} />
            ) : (
              <p className="Raffle-no-winner">No winner was found</p>
            )
          )
        }
      </div>
    </div>
  );
}
