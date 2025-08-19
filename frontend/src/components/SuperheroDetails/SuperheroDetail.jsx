import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Edit, ArrowLeft } from 'lucide-react';
import { DetailField, ImageSlider } from '@/components';
import { useGetSuperhero } from '@/hooks/useGetSuperhero';
import { Loader, Error } from '@/ui';
import '../shared-styles.css';
import './styles.css';

export const SuperheroDetail = () => {
  const { id } = useParams();
  const { data: superhero, isLoading, error } = useGetSuperhero(id);

  if (isLoading) return <Loader />;
  if (error) return <Error error={`Error loading superheroes: ${error.message}`} />;
  if (!superhero) return <Error error="Superhero not found" />;

  return (
    <div>
      <div className="welcome-block">
        <div className="detail-header">
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to List
          </Link>
          <Link to={`/edit/${id}`} className="btn btn-primary">
            <Edit size={16} /> Edit Superhero
          </Link>
        </div>

        <div className="grid">
          <div>
            <h1 className="superhero-nickname">{superhero.nickname}</h1>
            <p className="superhero-real-name">
              Real Name:
              {superhero.real_name}
            </p>

            <DetailField
              label="Origin Description"
              value={superhero.origin_description}
              className="detail-content"
            />
            <DetailField
              label="Superpowers"
              value={superhero.superpowers}
              className="detail-content"
            />
            <DetailField
              label="Catch Phrase"
              value={`"${superhero.catch_phrase}"`}
              className="detail-catch-phrase"
            />
            <DetailField
              label="Created"
              value={new Date(superhero.created_at).toLocaleDateString()}
              className="detail-date"
            />
            <DetailField
              label="Last Updated"
              value={new Date(superhero.updated_at).toLocaleDateString()}
              className="detail-date"
            />
          </div>
          <ImageSlider images={superhero?.images || []} nickname={superhero?.nickname} id={id} />
        </div>
      </div>
    </div>
  );
};
