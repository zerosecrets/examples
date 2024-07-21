import { getAuth0 } from '../../../../../util';

const auth0 = await getAuth0();

export const GET = auth0.handleAuth();
