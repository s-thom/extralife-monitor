import * as React from 'react';

import Donation from '../../types/Donation';
import './index.css';

class DonationList extends React.Component {
  constructor(props: {
    donations: Donation[]
  }) {
    super(props);
  }

  render() {
    return (
      <div className="DonationList">
        {/* TODO */}
      </div>
    );
  }
}

export default DonationList;
