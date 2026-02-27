import { getDb } from '../firebase/firestore';

export interface MomsLikeYouPreview {
  uid: string;
  firstName: string;
  lastInitial: string;
  photoURL: string | undefined;
}

/**
 * Fisher-Yates shuffle to randomize an array in-place.
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Lists up to 3 users from the Firestore base.
 * Returns uid, firstName, lastName (lastInitial) and photoUrl.
 *
 * @param loggedUserId - Current user's UID
 * @param excludeUid - Current user's UID to exclude from the list (optional)
 */

interface GetRandomUsersProps {
  loggedUserId: string;
  excludeUid?: string;
  limitRandom?: number;
}

export async function getRandomUsers({
  loggedUserId,
  excludeUid,
  limitRandom = 3
}: GetRandomUsersProps): Promise<MomsLikeYouPreview[]> {
  const snapshot = await getDb()
    .collection('users')
    .limit(30)
    .where('uid', '!=', loggedUserId)
    .get();

  const users: MomsLikeYouPreview[] = [];

  snapshot.docs.forEach((doc) => {
    const uid = doc.id;
    if (excludeUid && uid === excludeUid) return;

    const data = doc.data();
    const firstName = typeof data?.firstName === 'string' ? data.firstName : '';
    const lastInitial = typeof data?.lastInitial === 'string' ? data.lastInitial : '';
    const photoURL = typeof data?.photoURL === 'string' ? data.photoURL : undefined;

    users.push({
      uid,
      firstName,
      lastInitial,
      photoURL
    });
  });

  const shuffled = shuffle(users);
  return shuffled.slice(0, limitRandom);
}
