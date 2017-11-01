import * as React from 'react';

import ParticipantType from '../../types/Participant';

import Participant from '../Participant';
import './index.css';

export default function ParticipantList(props: {
  participants: ParticipantType[],
}) {
  return (
    <div className="ParticipantList">
      {props.participants.map(p => <Participant key={p.id} info={p} />)}
    </div>
  );
}
