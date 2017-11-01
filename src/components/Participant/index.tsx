import * as React from 'react';

import ParticipantType from '../../types/Participant';
import './index.css';

export default function Participant(props: {
  info: ParticipantType,
}) {
  return (
    <div className="Participant">
      <header className="Participant-header">
        <h2 className="Participant-name">{props.info.name}</h2>
        <h3 className="Participant-id">{props.info.id}</h3>
      </header>
      <div>
        <span className="Participant-goal">
          <span className="Participant-raised">${props.info.raised.toFixed(2)}</span>
          /
          <span className="Participant-full-goal">${props.info.goal.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
}
