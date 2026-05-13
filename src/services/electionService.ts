import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase';


export interface Candidate {
  id: string;
  name: string;
  party: string;
  age: number;
  education: string;
  assets: string;
  constituency: string;
  cases?: string;
  image?: string;
  promises?: string[];
}

export const electionService = {
  // Get all candidates
  async getCandidates(constituency?: string) {
    try {
      const candidatesRef = collection(db, 'candidates');
      const q = constituency 
        ? query(candidatesRef, where('constituency', '==', constituency))
        : candidatesRef;
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Candidate[];
    } catch (error) {
      console.warn('Firestore query failed:', error);
      return [];
    }
  },

  // Get user profile/voter info
  async getUserProfile(uid: string) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
      console.warn('Failed to get user profile:', error);
      return null;
    }
  },

  // Save candidate for a user
  async saveCandidate(uid: string, candidateId: string) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      savedCandidates: arrayUnion(candidateId)
    });
  },

  // Unsave candidate
  async unsaveCandidate(uid: string, candidateId: string) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      savedCandidates: arrayRemove(candidateId)
    });
  }
};
