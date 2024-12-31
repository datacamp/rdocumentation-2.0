import { useEffect, useState } from 'react';

const useHasCollaborator = (name: string): boolean => {
  const [availableAuthor, setAvailableAuthor] = useState(false);

  useEffect(() => {
    const fetchCollaborator = async () => {
      const res = await fetch(`/collaborators/name/${encodeURI(name)}`);
      setAvailableAuthor(res.status === 200);
    };

    fetchCollaborator();
  }, [name]);

  return availableAuthor;
};

export default useHasCollaborator;
