import Participant from './Participant';

interface DonationData {
  message: string;
  donorName: string;
  timestamp: number;
  donationAmount: 15;
}

export default class Donation {
  public readonly message: string | null;
  public readonly amount: number;
  public readonly timestamp: Date;
  public readonly name: string;

  public readonly participant: Participant;

  constructor(data: DonationData, participant: Participant) {
    this.message = data.message;
    this.amount = data.donationAmount;
    this.timestamp = new Date(data.timestamp);
    this.name = data.donorName;

    this.participant = participant;
  }
}