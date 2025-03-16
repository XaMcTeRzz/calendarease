import { Layout } from "@/components/Layout";
import { useTasks } from "@/lib/contexts/TaskContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Index() {
  const { tasks, getTasksForDate } = useTasks();
  const today = new Date();
  const todaysTasks = getTasksForDate(today);
  const upcomingTasks = tasks
    .filter(task => !task.completed && new Date(task.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h1 className="text-4xl font-bold mb-6">Календар by XaMcTeR</h1>
          <p className="text-gray-400 text-lg mb-8">
            Ваш персональний помічник для управління задачами, нагадуваннями та голосовими замітками.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Сьогоднішні задачі</h2>
            {todaysTasks.length > 0 ? (
              <ul className="space-y-3">
                {todaysTasks.map(task => (
                  <li key={task.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      className="mr-3"
                      readOnly
                    />
                    <span className={task.completed ? "line-through text-gray-500" : ""}>
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">На сьогодні немає запланованих задач</p>
            )}
            <Link to="/calendar" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
              Переглянути календар →
            </Link>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Майбутні задачі</h2>
            {upcomingTasks.length > 0 ? (
              <ul className="space-y-3">
                {upcomingTasks.map(task => (
                  <li key={task.id} className="flex flex-col">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-sm text-gray-400">
                      {format(new Date(task.date), "dd.MM.yyyy")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Немає запланованих майбутніх задач</p>
            )}
            <Link to="/reminders" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
              Управління нагадуваннями →
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Швидкі дії</h2>
            <div className="space-y-4">
              <Link
                to="/calendar"
                className="block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors"
              >
                Додати нову задачу
              </Link>
              <Link
                to="/voice-notes"
                className="block bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded transition-colors"
              >
                Записати голосову замітку
              </Link>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Статистика</h2>
            <div className="space-y-2">
              <p>Всього задач: {tasks.length}</p>
              <p>Виконано: {tasks.filter(task => task.completed).length}</p>
              <p>Активних: {tasks.filter(task => !task.completed).length}</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
