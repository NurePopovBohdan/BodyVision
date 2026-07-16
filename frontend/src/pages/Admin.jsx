import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import api, { getErrorMessage } from '../api/axios.js';
import LoadingState from '../components/LoadingState.jsx';
import MetricCard from '../components/MetricCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Admin = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/admin/summary');
        setData(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (user?.role !== 'admin') {
    return <div className="alert error">{t('adminDenied') || 'Admin access required'}</div>;
  }

  if (loading) return <LoadingState />;

  return (
    <div className="stack">
      <div className="page-title">
        <div>
          <span>{t('adminKicker') || 'Administration'}</span>
          <h1>{t('adminTitle') || 'Admin panel'}</h1>
        </div>
        <div className="soft-badge"><ShieldCheck size={16} /> admin</div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {data ? (
        <>
          <div className="metrics-grid">
            <MetricCard label={t('users') || 'Users'} value={data.summary.users} />
            <MetricCard label={t('navMeasurements')} value={data.summary.measurements} />
            <MetricCard label={t('navGoals')} value={data.summary.goals} />
            <MetricCard label={t('navPhotos') || 'Photos'} value={data.summary.photos} />
            <MetricCard label={t('navWorkouts') || 'Workouts'} value={data.summary.workouts} />
          </div>
          <section className="panel">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('email')}</th>
                    <th>Role</th>
                    <th>{t('activity')}</th>
                    <th>{t('createdAt')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.latestUsers.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>{item.activityLevel}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default Admin;
