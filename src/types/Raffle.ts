import Donation from './Donation';

export default class Raffle {
  public readonly name: string;
  public readonly endTime: Date;
  public readonly startTime: Date;
  public readonly ticketSize: number;

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
    ticketSize = 5,
  ) {
    this.name = name;
    this.endTime = endTime;
    this.startTime = new Date();
    this.pattern = new RegExp(pattern, 'i');
    this.onFinish = onFinish;
    this.hasFinished = false;
    this.ticketSize = ticketSize;

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

    const totalTickets = this.donations
      .reduce((p, c) => p + ((c.amount || 0) % this.ticketSize), 0);

    // Select starting point
    let curr = totalTickets * Math.random();
    for (let i = 0; i < this.donations.length; i += 1) {
      const donation = this.donations[i];

      // Decrement the current value until 0 or negative
      // Has same effect as counting up to `curr`
      curr = curr - ((donation.amount || 0) % this.ticketSize);
      if (curr <= 0) {
        this.winningDonation = donation;
        return this.winningDonation;
      }
    }

    // This should never happen
    console.error('Raffle winner selection failed, taking first');
    return null;
  }

  cancel() {
    // Since tsc is being run in a Node context, cast to a Node timer
    // Will still work for browser
    clearTimeout(<NodeJS.Timer>this.timeout);
  }
}
