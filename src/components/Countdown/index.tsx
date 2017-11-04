import * as React from 'react';

import './index.css';

interface Props {
  time: Date;
  interval?: number;
  className?: string;
}

interface State {
  remaining: number;
}

export default class Countdown extends React.Component {
  state: State;
  props: Props;
  interval: number | NodeJS.Timer;

  constructor(props: Props) {
    super(props);

    this.state = {
      remaining: props.time.valueOf() - Date.now(),
    };

    this.interval = setInterval(
      () => {
        this.setState({
          remaining: props.time.valueOf() - Date.now(),
        });
      },
      1000,
    );
  }

  componentWillUnmount() {
    // Since tsc is being run in a Node context, cast to a Node timer
    // Will still work for browser
    clearInterval(this.interval as NodeJS.Timer);
  }

  render() {
    const { remaining } = this.state;

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor(remaining / (1000 * 60)) % 60;
    const seconds = Math.floor(remaining / (1000)) % 60;

    const hourString = `${hours < 10 ? 0 : ''}${hours}`;
    const minuteString = `${minutes < 10 ? 0 : ''}${minutes}`;
    const secondString = `${seconds < 10 ? 0 : ''}${seconds}`;

    return (
      <div className={`Countdown${this.props.className ? ` ${this.props.className}` : ''}`}>
        {
          (remaining > 0) ? (
            <span className="Countdown-timer">
              <span className="Countdown-hours">{hourString}</span>
              :
              <span className="Countdown-minutes">{minuteString}</span>
              :
              <span className="Countdown-seconds">{secondString}</span>
            </span>
          ) : (
            <span className="Countdown-complete">Complete</span>
          )
        }
      </div>
    );
  }
}
