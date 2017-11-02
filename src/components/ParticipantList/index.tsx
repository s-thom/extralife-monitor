import * as React from 'react';

import ParticipantType from '../../types/Participant';

import Participant from '../Participant';
import './index.css';

interface Props {
  participants: ParticipantType[];
  onRemove?: (participant: ParticipantType) => void;
}

export default function ParticipantList({
  participants,
  onRemove,
}: Props) {
  return (
    <div className="ParticipantList">
      {participants.map(p => <Participant key={p.id} info={p} onRemove={onRemove} />)}
    </div>
  );
}
