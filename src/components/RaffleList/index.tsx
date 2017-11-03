import * as React from 'react';

import RaffleType from '../../types/Raffle';

import Raffle from '../Raffle';
import './index.css';

interface Props {
  raffles: RaffleType[];
  onRemove?: (raffle: RaffleType) => void;
}

export default function RaffleList({
  raffles,
  onRemove,
}: Props) {
  return (
    <div className="RaffleList">
      {raffles.map(r => <Raffle key={r.name} info={r} onRemove={onRemove} />)}
    </div>
  );
}
