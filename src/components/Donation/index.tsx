import * as React from 'react';

import DonationType from '../../types/Donation';
import './index.css';

interface Props {
  info: DonationType;
  onRemove?: (donation: DonationType) => void;
}

export default function Donation({
  info,
  onRemove,
}: Props) {
  return (
    <div className="Donation">
      <header className="Donation-header">
        <span className="Donation-amount">
          {info.amount ? `$${info.amount.toFixed(2)}` : <em>Unknown amount</em>}
        </span>

        <div className="Donation-info">
          <h2 className="Donation-name">{info.name}</h2>
          <h3 className="Donation-participant">{info.participant.name}</h3>
        </div>

        {
          onRemove && (
            <button
              className="Donation-remove"
              onClick={() => onRemove(info)}
            >❌</button>
          )
        }
      </header>
      <div className="Donation-body">
        {info.message ? <p>{info.message}</p> : <p><em>No message</em></p>}
      </div>
    </div>
  );
}
