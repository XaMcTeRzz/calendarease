
import { Layout } from "../components/Layout";
import { CalendarView } from "../components/Calendar";

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen animate-fade-in">
        <CalendarView />
      </div>
    </Layout>
  );
};

export default Index;
