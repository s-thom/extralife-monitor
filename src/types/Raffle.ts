import Donation from './Donation';

export default class Raffle {
  public readonly name: string;
  public readonly endTime: Date;
  public readonly startTime: Date;

  private readonly pattern: RegExp;
  private readonly onFinish: () => void;
  private readonly donations: Donation[] = [];
  private readonly timeout: number | NodeJS.Timer;
  private winningDonation: Donation| null = null;
  private hasFinished: boolean;

  constructor(
    name: string,
    endTime: Date,
    pattern: string,
    onFinish: () => void,
  ) {
    this.name = name;
    this.endTime = endTime;
    this.startTime = new Date();
    this.pattern = new RegExp(pattern, 'i');
    this.onFinish = onFinish;
    this.hasFinished = false;

    this.timeout = setTimeout(
      () => {
        this.hasFinished = true;
        this.onFinish();
      },
      endTime.valueOf() - Date.now(),
    );
  }

  get donationCount() {
    return this.donations.length;
  }

  get donationTotal() {
    return this.donations.reduce((p, c) => p + (c.amount || 0), 0);
  }

  get winner() {
    return this.winningDonation;
  }

  get finished() {
    return this.hasFinished;
  }

  add(donation: Donation) {
    if (donation.timestamp.valueOf() < this.startTime.valueOf()) {
      console.warn('Tried adding donation before start');
      return;
    }
    if (donation.timestamp.valueOf() > this.endTime.valueOf()) {
      console.warn('Tried adding donation after end');
      return;
    }

    if (!(donation.message && donation.message.match(this.pattern))) {
      return;
    }

    if (this.donations.find(d => d.id === donation.id)) {
      // Donation already exists in array
      return;
    }

    this.donations.push(donation);
  }

  selectWinner() {
    if (this.donationCount === 0) {
      console.error('No donations in raffle');
      return null;
    }

    // Select a random starting point
    let curr = this.donationTotal * Math.random();
    for (let i = 0; i < this.donations.length; i += 1) {
      const donation = this.donations[i];

      curr = curr - (donation.amount || 0);
      if (curr <= 0) {
        this.winningDonation = donation;
        return this.winningDonation;
      }
    }

    // This should never happen, but in case it does, just return the first donation.
    console.error('Raffle winner selection failed, taking first');
    this.winningDonation = this.donations[0];
    return this.winningDonation;
  }

  cancel() {
    // Since tsc is being run in a Node context, cast to a Node timer
    // Will still work for browser
    clearTimeout(<NodeJS.Timer>this.timeout);
  }
}
