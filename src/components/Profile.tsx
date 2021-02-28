import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';

export function Profile(){
  const { level } = useContext(ChallengesContext);
  return(
    <div className={styles.profileContainer}>
      <img 
        src="https://avatars.githubusercontent.com/u/51554360?s=460&u=2cf2e22f5343837c6efb95259f4707bc492e5dc5&v=4"
        alt="Danilo Gomes"
      />
      <div>
        <strong>Danilo Gomes</strong>
        <p>
          <img src="icons/level.svg" alt="Level" />
          Level {level}
        </p>
      </div>

    </div>
  )
}