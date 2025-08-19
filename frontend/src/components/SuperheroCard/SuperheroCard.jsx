import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';
import '../shared-styles.css';
import './styles.css';

export const SuperheroCard = ({ superhero, onDelete }) => {
  const firstImage = superhero?.images && superhero?.images.length > 0 ? `/api/superheroes/${superhero.id}/images/${superhero.images[0].fileId}` : null;

  return (
    <div className="superhero-card">
      <div className="superhero-image">
        {firstImage ? (
          <img src={firstImage} alt={superhero.nickname} />
        ) : (
          <div className="superhero-image-plug">🦸‍♂️</div>
        )}
      </div>

      <div className="superhero-content">
        <h3 className="superhero-nickname">{superhero.nickname}</h3>
        <p className="superhero-real-name">{superhero.real_name}</p>

        <div className="superhero-actions">
          <Link to={`/superhero/${superhero.id}`} className="btn btn-secondary">
            <Eye size={16} />
            View
          </Link>

          <Link to={`/edit/${superhero.id}`} className="btn btn-primary">
            <Edit size={16} />
            Edit
          </Link>

          <button type="button" onClick={() => onDelete(superhero.id)} className="btn btn-danger">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
