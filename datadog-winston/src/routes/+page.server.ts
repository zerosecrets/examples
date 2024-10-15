import { logger } from '$lib/logger';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async (event) => {
    try {
      throw new Error('An error occurred.');
    } catch (error: any) {
      logger.error(error.message, { stack: error.stack });
      return fail(500);
    }
  },
};
