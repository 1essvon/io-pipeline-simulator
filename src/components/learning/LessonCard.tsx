import type { Lesson } from '../../data/lessons';

interface Props {
  lesson: Lesson;
  index: number;
  active: boolean;
  done: boolean;
  onSelect: (id: string) => void;
}

export default function LessonCard({ lesson, index, active, done, onSelect }: Props) {
  const cls = 'lessoncard' + (active ? ' is-active' : '') + (done ? ' is-done' : '');
  return (
    <button type="button" className={cls} aria-current={active ? 'step' : undefined} onClick={() => onSelect(lesson.id)}>
      <span className="lessoncard__mark" aria-hidden="true">{done ? '✓' : index + 1}</span>
      <span>
        <span className="lessoncard__title">
          {lesson.title}
          {done && <span className="sr-only"> (selesai)</span>}
        </span>
        <span className="lessoncard__sum">{lesson.summary}</span>
      </span>
    </button>
  );
}
