import * as React from 'react';

import DonationType from '../../types/Donation';
import './index.css';

export default function Donation(props: {
  info: DonationType,
}) {
  return (
    <div className="Donation">
      <header className="Donation-header">
        <span className="Donation-amount">${props.info.amount.toFixed(2)}</span>
        {/* TODO: Dismissable button */}
      </header>
      <div className="Donation-body">
        <h3 className="Donation-participant">{props.info.participant.name}</h3>
        <h2 className="Donation-name">{props.info.name}</h2>
        {props.info.message ? <p>{props.info.message}</p> : <p><em>No message</em></p>}
      </div>
    </div>
  );
}
