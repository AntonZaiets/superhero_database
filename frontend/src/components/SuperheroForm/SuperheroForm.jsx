import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ImageUploader } from '@/components';
import { useGetSuperhero } from '@/hooks/useGetSuperhero';
import { Loader, Error, TextField, TextareaField, SubmitButton } from '@/ui';
import { useFormSuperhero, useHookFormSuperhero } from './hooks';
import '../shared-styles.css';
import './styles.css';

export const SuperheroForm = () => {
  const imageUploaderRef = useRef();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useHookFormSuperhero();

  const { id } = useParams();
  const { data: superhero } = useGetSuperhero(id);
  const { isEditing, isLoading, error, mutation } = useFormSuperhero({
    reset,
    imageUploaderRef,
  });

  const onSubmit = (data) => mutation.mutate(data);

  if (isEditing && isLoading) return <Loader />;
  if (isEditing && error) return <Error error={`Error loading superheroes: ${error.message}`} />;

  return (
    <div className="welcome-block">
      <div className="form-header">
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back to List
        </Link>
        <h1>{isEditing ? 'Edit Superhero' : 'Create New Superhero'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid">
          <TextField
            id="nickname"
            label="Nickname"
            placeholder="e.g., Superman"
            register={register}
            error={errors.nickname}
          />
          <TextField
            id="real_name"
            label="Real Name"
            placeholder="e.g., Clark Kent"
            register={register}
            error={errors.real_name}
          />
        </div>

        <TextareaField
          id="origin_description"
          label="Origin Description"
          placeholder="Describe the superhero's origin story..."
          register={register}
          error={errors.origin_description}
        />

        <TextareaField
          id="superpowers"
          label="Superpowers"
          placeholder="List the superhero's powers and abilities..."
          register={register}
          error={errors.superpowers}
        />

        <TextField
          id="catch_phrase"
          label="Catch Phrase"
          placeholder="e.g., Look, up in the sky..."
          register={register}
          error={errors.catch_phrase}
        />
        <ImageUploader ref={imageUploaderRef} id={id} superhero={superhero} />
        <div className="form-actions">
          <SubmitButton
            isSubmitting={mutation.isLoading}
            isEditing={isEditing}
            textCreate="Create"
            textUpdate="Update"
          />
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};
