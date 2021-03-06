import * as React from 'react';

import './index.css';

interface Props {
  time: Date;
  interval?: number;
  className?: string;
  onFinish?: () => void;
}

interface State {
  remaining: number;
}

export default class Countdown extends React.Component {
  state: State;
  props: Props;

  private interval: number | NodeJS.Timer;
  private tickFunction: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      remaining: props.time.valueOf() - Date.now(),
    };

    this.tickFunction = (() => {
      const remaining = this.props.time.valueOf() - Date.now();

      this.setState({
        remaining,
      });

      // Stop timer if finished
      if (remaining <= 0) {
        this.clearInterval();

        // Call finish function
        if (this.props.onFinish) {
          this.props.onFinish();
        }
      }
    }).bind(this);

    this.setInterval();
  }

  setInterval() {
    this.interval = setInterval(this.tickFunction, this.interval || 1000);
  }

  clearInterval() {
    // Since tsc is being run in a Node context, cast to a Node timer
    // Will still work for browser
    clearInterval(this.interval as NodeJS.Timer);
  }

  componentWillUpdate() {
    this.clearInterval();
  }

  componentDidUpdate() {
    this.state = {
      remaining: this.props.time.valueOf() - Date.now(),
    };

    this.setInterval();
  }

  componentWillUnmount() {
    this.clearInterval();
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
