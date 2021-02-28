import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';


interface ChallengesProviderProps {
  children: ReactNode;
  level:number;
  challengesCompleted:number;
  currentExperience:number;
}
interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  experienceToNextLevel: number;
  activeChallenge: Challenge;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({children, ...rest}:ChallengesProviderProps){
  const [level, setLevel] = useState(rest.level);
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience);
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted);

  const [activeChallenge, setActiveChallenge] = useState(null);

  const experienceToNextLevel = Math.pow((level + 1) * 4,2);

  useEffect(() => {
    Notification.requestPermission();
  },[])

  useEffect(() => {
    Cookies.set('level',String(level));
    Cookies.set('currentExperience',String(currentExperience));
    Cookies.set('challengesCompleted',String(challengesCompleted));

  },[level, currentExperience,challengesCompleted])

  function levelUp(){
    setLevel(level + 1)
  }

  function startNewChallenge(){
    const randomChallengesIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengesIndex];
    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();

    if(Notification.permission === 'granted'){
      new Notification('Novo desafio', {
      body: `Valendo ${challenge.amount} xp!`
      })
    }
  }

  function resetChallenge(){
    setActiveChallenge(null);
  }

  function completeChallenge(){
    if(!activeChallenge){
      return;
    }

    const {amount} = activeChallenge;

    let finalExperience = currentExperience + amount;

    if(finalExperience >= experienceToNextLevel){
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);
  }

  return(
    <ChallengesContext.Provider value={{
      level,
      currentExperience,
      challengesCompleted,
      activeChallenge,
      experienceToNextLevel,
      startNewChallenge,
      levelUp,
      resetChallenge,
      completeChallenge
    }}
    >
      {children}
    </ChallengesContext.Provider>
  )
}

