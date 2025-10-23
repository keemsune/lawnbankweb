import DiagnosisDashboard from '@/components/admin/DiagnosisDashboard';
import AdminAuth from '@/components/admin/AdminAuth';

export default function DiagnosisAdminPage() {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DiagnosisDashboard />
        </div>
      </div>
    </AdminAuth>
  );
}
