import * as React from 'react';

import DonationType from '../../types/Donation';

import Donation from '../Donation';
import './index.css';

interface Props {
  donations: DonationType[];
  onRemove?: (donation: DonationType) => void;
}

export default function DonationList({
  donations,
  onRemove,
}: Props) {
  return (
    <div className="DonationList">
      {donations.map(d => <Donation key={d.id} info={d} onRemove={onRemove} />)}
    </div>
  );
}
