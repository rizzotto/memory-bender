import { useEffect, useMemo, useState } from "react";
import "./App.css";

interface Character {
  _id: string;
  name: string;
  photoUrl: string;
}

const url = "https://last-airbender-api.fly.dev/api/v1/characters";
const characters = ["Aang", "Roku", "Kyoshi", "Yanchen", "Wan", "Korra"];

function App() {
  const [data, setData] = useState<Character[]>([]);
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [shuffledAvatars, setShuffledAvatars] = useState<Character[]>([]);

  useEffect(() => {
    fetch(`${url}/avatar`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data: Character[]) => {
        const filteredCharacters = data.filter((character) => {
          return characters.includes(character.name);
        });

        setData(filteredCharacters);
      });
  }, []);

  const newAvatars = useMemo(() => [...data, ...data], [data]);

  function shuffle(newAvatars: Character[]) {
    const randomAvatars = newAvatars.sort(() => Math.random() - 0.7);
    setShuffledAvatars(randomAvatars);
  }

  useEffect(() => {
    shuffle(newAvatars);
  }, [data, newAvatars]);

  function flipCard(index: number) {
    setOpened((opened) => [...opened, index]);
  }

  // Check if memory matches
  useEffect(() => {
    if (opened.length < 2) return;

    const firstMatch = shuffledAvatars[opened[0]];
    const secondMatch = shuffledAvatars[opened[1]];

    if (firstMatch._id === secondMatch._id) {
      setMatched([...matched, firstMatch._id]);
    }

    if (opened.length === 2) setTimeout(() => setOpened([]), 1000);
  }, [opened, matched, shuffledAvatars]);

  return (
    <div className="app">
      {/* <h1>MemoryBender</h1> */}
      <div className="cards">
        {shuffledAvatars.map((avatar, index) => {
          let isFlipped = false;

          if (opened.includes(index)) isFlipped = true;
          if (matched.includes(avatar._id)) isFlipped = true;

          return (
            <div
              onClick={() => flipCard(index)}
              className={`avatar-card ${isFlipped ? "flipped" : ""}`}
              key={index}
            >
              <div className="inner">
                <div className="front">
                  <img src={avatar.photoUrl} alt="images" />
                </div>
                <div className="back" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
