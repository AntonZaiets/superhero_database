import React from 'react';
import { Save } from 'lucide-react';
import { Loader } from '@/ui';

export const SubmitButton = ({
  isSubmitting,
  isEditing,
  textCreate = 'Create',
  textUpdate = 'Update',
}) => (
  <button type="submit" className="btn btn-success" disabled={isSubmitting}>
    {isSubmitting ? (
      <>
        <Loader />
        {isEditing ? `${textUpdate}...` : `${textCreate}...`}
      </>
    ) : (
      <>
        <Save size={16} />
        {isEditing ? `${textUpdate} Superhero` : `${textCreate} Superhero`}
      </>
    )}
  </button>
);
