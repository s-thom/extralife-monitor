import * as React from 'react';

import DonationType from '../../types/Donation';

import Donation from '../Donation';
import './index.css';

export default function DonationList(props: {
  donations: DonationType[],
}) {
  return (
    <div className="DonationList">
      {props.donations.map(d => <Donation key={d.id} info={d} />)}
    </div>
  );
}
