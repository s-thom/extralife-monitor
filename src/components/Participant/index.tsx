import * as React from 'react';

import ParticipantType from '../../types/Participant';
import './index.css';

interface Props {
  info: ParticipantType;
  onRemove?: (participant: ParticipantType) => void;
}

export default function Participant({
  info,
  onRemove,
}: Props) {
  return (
    <div className="Participant card">
      <header className="Participant-header">
        <div className="Participant-picture">
          <img src={info.avatar} alt={info.name} className="Participant-picture-img"/>
        </div>

        <div className="Participant-info">
          <h2 className="Participant-name">{info.name}</h2>
          <h3 className="Participant-id">{info.id}</h3>
        </div>

        {
          onRemove && (
            <button
              className="Participant-remove"
              onClick={() => onRemove(info)}
            >❌</button>
          )
        }
      </header>
      <div>
        <span className="Participant-goal">
          <span className="Participant-raised">${info.raised.toFixed(2)}</span>
          /
          <span className="Participant-full-goal">${info.goal.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
}
