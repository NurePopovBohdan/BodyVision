import { ImagePlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import api, { getErrorMessage } from '../api/axios.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const PhotoProgress = () => {
  const { t } = useLanguage();
  const toast = useToast();
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ caption: '', takenAt: new Date().toISOString().slice(0, 10), imageData: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadPhotos = async () => {
    try {
      const { data } = await api.get('/photos');
      setPhotos(data.photos);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2_000_000) {
      toast.error(t('photoTooLarge') || 'Image is too large');
      return;
    }

    const imageData = await fileToDataUrl(file);
    setForm((current) => ({ ...current, imageData }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.post('/photos', form);
      setForm({ caption: '', takenAt: new Date().toISOString().slice(0, 10), imageData: '' });
      await loadPhotos();
      toast.success(t('photoAdded') || 'Photo added');
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const deletePhoto = async (id) => {
    await api.delete(`/photos/${id}`);
    setPhotos((current) => current.filter((photo) => photo._id !== id));
    toast.info(t('photoDeleted') || 'Photo deleted');
  };

  if (loading) return <LoadingState />;

  return (
    <div className="stack">
      <div className="page-title">
        <div>
          <span>{t('photoKicker') || 'Progress photos'}</span>
          <h1>{t('photoTitle') || 'Photo progress'}</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <section className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>{t('measurementDate')}</span>
            <input type="date" value={form.takenAt} onChange={(event) => setForm({ ...form, takenAt: event.target.value })} required />
          </label>
          <label>
            <span>{t('notes')}</span>
            <input value={form.caption} onChange={(event) => setForm({ ...form, caption: event.target.value })} maxLength="180" />
          </label>
          <label className="wide upload-box">
            <ImagePlus size={24} />
            <span>{form.imageData ? t('photoReady') || 'Photo selected' : t('selectPhoto') || 'Select photo'}</span>
            <input type="file" accept="image/*" onChange={handleFile} required={!form.imageData} />
          </label>
          <div className="form-actions wide">
            <button className="primary-button" type="submit" disabled={saving || !form.imageData}>
              <ImagePlus size={18} />
              <span>{saving ? t('saving') : t('addPhoto') || 'Add photo'}</span>
            </button>
          </div>
        </form>
      </section>

      {photos.length ? (
        <div className="photo-grid">
          {photos.map((photo) => (
            <article className="photo-card" key={photo._id}>
              <img src={photo.imageData} alt={photo.caption || 'Progress'} />
              <div>
                <strong>{new Date(photo.takenAt).toLocaleDateString()}</strong>
                <p>{photo.caption || t('noData')}</p>
              </div>
              <button className="icon-button danger" type="button" onClick={() => deletePhoto(photo._id)} title={t('delete')}>
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title={t('photoEmptyTitle') || 'No photos yet'} text={t('photoEmptyText') || 'Add progress photos to compare visual changes over time.'} />
      )}
    </div>
  );
};

export default PhotoProgress;
