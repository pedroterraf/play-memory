import { useRef, useState, useEffect } from 'react';
import Cards from './components/Cards/Cards';
import Timer from './components/Timer/Timer';
import Ranking from './components/Ranking/Ranking';
import { supabase } from './helpers/superbaseClient';
import './App.css';

function App() {
  const [start, setStart] = useState(false);
  const [save, setSave] = useState(false);
  const [name, setName] = useState('');
  const [warning, setWarning] = useState('');
  const [error, setError] = useState(false);
  const [ranking, setRanking] = useState([]);
  const score = useRef(0);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase
        .from('ranking')
        .select('*')
        .order('score', { ascending: false });

      if (error) {
        console.error('Error fetching ranking:', error);
      } else {
        setRanking(data);
      }
    };

    fetchRanking();
  }, []);

  const handleSave = async () => {
    if (name !== "") {
      const { error } = await supabase
        .from('ranking')
        .insert({ name: name, score: score.current });

      if (error && error.status === 409) {
        setError(true);
      } else {
        location.reload();
      }
      setWarning(false);
    } else {
      setWarning(true);
    }
  };

  return (
    <div className='app'>
      <h1>Memory Game</h1>
      {ranking.length > 0 && (
        <div className="ranking">
          <Ranking ranking={ranking} setRanking={setRanking} />
        </div>
      )}
      <Timer start={start} setStart={setStart} setSave={setSave} />
      <div className='buttons'>
        {(!start && !save) ? (
          <button onClick={() => setStart(true)}>Start</button>
        ) : (
          <button onClick={() => location.reload()}>Again</button>
        )}
        {save && (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${warning ? 'warning' : ''}`}
              maxLength={20}
            />
            <button onClick={handleSave}>Save</button>
          </>
        )}
        {error && <p className='error'>The name exists.</p>}
      </div>
      <Cards start={start} score={score} />
    </div>
  );
}

export default App;
