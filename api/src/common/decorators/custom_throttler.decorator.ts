// Custom throttler config : for rate limiting

import { Throttle } from '@nestjs/throttler';

// Stric rate: for auth, payments
export const StrictThrottle = () =>
  Throttle({
    default: {
      ttl: 1000,
      limit: 3,
    },
  });
// Moderate rate:  for  write operations, orders
export const ModerateThrottle = () =>
  Throttle({
    default: {
      ttl: 1000,
      limit: 5,
    },
  });
// Realxed rate:  for read operations
export const RelaxedThrottle = () =>
  Throttle({
    default: {
      ttl: 1000,
      limit: 20,
    },
  });
