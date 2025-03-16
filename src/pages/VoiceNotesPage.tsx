
import { Layout } from "@/components/Layout";

export default function VoiceNotesPage() {
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto p-2 md:p-4">
        <h1 className="text-2xl md:text-3xl font-light text-gray-100 mb-4">Голосові замітки</h1>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-gray-300">Тут будуть ваші голосові замітки</p>
        </div>
      </div>
    </Layout>
  );
}
