import * as React from 'react';

import RaffleType from '../../types/Raffle';

import Raffle from '../Raffle';
import './index.css';

interface Props {
  raffles: RaffleType[];
  onSelectDonation: (raffle: RaffleType) => void;
  onRemove?: (raffle: RaffleType) => void;
}

export default function RaffleList({
  raffles,
  onSelectDonation,
  onRemove,
}: Props) {
  return (
    <div className="RaffleList">
      {raffles.map(r => (
        <Raffle
          key={r.name}
          info={r}
          onRemove={onRemove}
          onSelectDonation={onSelectDonation}
        />
      ))}
    </div>
  );
}
