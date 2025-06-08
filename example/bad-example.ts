// Bad examples: Switch statements that should trigger the rule
type Status = 'pending' | 'approved' | 'rejected';

// Missing default case
function processStatus1(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Waiting for approval';
    case 'approved':
      return 'Request approved';
    case 'rejected':
      return 'Request rejected';
  }
}

// Default case without satisfies never
function processStatus2(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Waiting for approval';
    case 'approved':
      return 'Request approved';
    case 'rejected':
      return 'Request rejected';
    default:
      throw new Error('Unknown status');
  }
}

// Default case with satisfies never but not in throw Error
function processStatus3(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Waiting for approval';
    case 'approved':
      return 'Request approved';
    case 'rejected':
      return 'Request rejected';
    default:
      status satisfies never;
      return 'Unknown';
  }
}