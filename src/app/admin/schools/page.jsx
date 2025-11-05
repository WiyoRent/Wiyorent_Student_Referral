import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

export default async function SchoolsPage() {
  await dbConnect();
  const users = await User.find({}, 'name email phone university').lean();
  const schoolsMap = new Map();
  for (const u of users) {
    const key = u.university || 'Unknown';
    if (!schoolsMap.has(key)) schoolsMap.set(key, []);
    schoolsMap.get(key).push(u);
  }
  const schools = Array.from(schoolsMap.entries()).map(([university, students]) => ({ university, students }));

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-[#010101] mb-6">School Overview</h1>
        <div className="space-y-6">
          {schools.map((s) => (
            <div key={s.university} className="bg-white border-2 border-[#010101] rounded-lg">
              <div className="px-6 py-4 border-b-2 border-[#010101] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#010101]">{s.university}</h2>
                  <p className="text-black text-sm">{s.students.length} students</p>
                </div>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-black">
                  <thead>
                    <tr className="border-b-2 border-[#010101]">
                      <th className="text-left py-3 px-4 text-sm font-bold uppercase">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-bold uppercase">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-bold uppercase">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-bold uppercase">University</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#010101]/10">
                    {s.students.map((st) => (
                      <tr key={st._id} className="hover:bg-[#FAFAF7]">
                        <td className="py-3 px-4">{st.name}</td>
                        <td className="py-3 px-4">{st.email}</td>
                        <td className="py-3 px-4">{st.phone || '-'}</td>
                        <td className="py-3 px-4">{st.university || 'Unknown'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


