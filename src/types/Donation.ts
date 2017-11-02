import Participant from './Participant';

export interface DonationData {
  message: string | null;
  donorName: string| null;
  createdOn: string;
  donationAmount: number | null;
}

export default class Donation {
  public readonly message: string | null;
  public readonly amount: number | null;
  public readonly timestamp: Date;
  public readonly name: string | null;
  public readonly id: string;

  public readonly participant: Participant;

  constructor(data: DonationData, participant: Participant) {
    this.message = data.message;
    this.amount = data.donationAmount;
    this.name = data.donorName;


    this.timestamp = new Date(Date.parse(data.createdOn));

    this.participant = participant;

    this.id = `${participant.id}-${this.name}-${this.timestamp.toISOString()}`;
  }
}
