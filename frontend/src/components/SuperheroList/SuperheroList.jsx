import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SuperheroCard, Pagination } from '@/components';
import { SUPERHEROES_LIMIT } from '@/constants/defaults';
import { Loader, Error, ConfirmToast } from '@/ui';
import { useGetSuperheroes, useDeleteSuperhero } from './hooks';
import '../shared-styles.css';
import './styles.css';

export const SuperheroList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetSuperheroes({ page });
  const deleteMutation = useDeleteSuperhero();
  const { superheroes = [], totalPages = 0, total = 0 } = data || {};

  const handleConfirmDelete = (superhero) => {
    ConfirmToast(() => deleteMutation.mutate(superhero.id), 'Delete this superhero?');
  };

  if (isLoading) return <Loader />;
  if (error) return <Error error={`Error loading superheroes: ${error.message}`} />;

  return (
    <div>
      <div className="welcome-block">
        <h1>Superheroes</h1>
        <p>Browse and manage your superhero collection</p>
      </div>
      {superheroes.length === 0 ? (
        <div className="welcome-block extra-margin">
          <p>Create your first superhero!</p>
          <Link to="/create" className="btn btn-primary">
            Create Superhero
          </Link>
        </div>
      ) : (
        <>
          <div className="superhero-grid">
            {superheroes.map((superhero) => (
              <SuperheroCard
                key={superhero.id}
                superhero={superhero}
                onDelete={() => handleConfirmDelete(superhero)}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={SUPERHEROES_LIMIT}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};
