import { useState } from 'react';
import { Link } from 'react-router-dom';
import LessonCard from '../components/learning/LessonCard';
import { isSimulatorUnlocked, lessons, loadProgress, saveProgress } from '../data/lessons';

export default function LearningPage() {
  const [done, setDone] = useState<string[]>(loadProgress);
  const [index, setIndex] = useState(() => {
    const first = lessons.findIndex((l) => !loadProgress().includes(l.id));
    return first === -1 ? 0 : first;
  });
  const lesson = lessons[index];
  const isDone = done.includes(lesson.id);
  const percent = Math.round((done.length / lessons.length) * 100);

  function toggleDone() {
    const next = isDone ? done.filter((id) => id !== lesson.id) : [...done, lesson.id];
    setDone(next);
    saveProgress(next);
  }

  return (
    <div className="container">
      <h1>Belajar</h1>
      <div className="learn">
        <aside className="card" aria-label="Daftar materi">
          <strong>Progres belajar: {done.length}/{lessons.length}</strong>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <div className="progress__bar" style={{ width: percent + '%' }} />
          </div>
          {lessons.map((l, i) => (
            <LessonCard key={l.id} lesson={l} index={i} active={i === index} done={done.includes(l.id)} onSelect={(id) => setIndex(lessons.findIndex((x) => x.id === id))} />
          ))}
        </aside>

        <article className="card">
          <span className="pill">Materi {index + 1} dari {lessons.length}</span>
          <h2 style={{ marginTop: 12 }}>{lesson.title}</h2>
          {lesson.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          {lesson.example && <div className="note"><strong>Contoh: </strong>{lesson.example}</div>}
          {lesson.keyPoint && <p className="note" style={{ marginTop: 12 }}><strong>Ingat: </strong>{lesson.keyPoint}</p>}

          <div className="lesson__nav">
            <button type="button" className="btn" disabled={index === 0} onClick={() => setIndex(index - 1)}>Sebelumnya</button>
            <button type="button" className="btn" onClick={toggleDone}>{isDone ? 'Batalkan tanda selesai' : 'Tandai selesai'}</button>
            {index < lessons.length - 1 ? (
              <button type="button" className="btn btn--primary" onClick={() => setIndex(index + 1)}>Selanjutnya</button>
            ) : isSimulatorUnlocked(done) ? (
              <Link className="btn btn--primary" to="/simulator">Coba di simulator</Link>
            ) : (
              <span className="note">Selesaikan materi dasar untuk membuka simulator.</span>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
