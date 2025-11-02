'use client';

import { useSelector } from 'react-redux';
import { LinkCard } from './LinkCard';

export function LinksList({ onEdit, onDelete }) {
  // Get links from Redux store
  const { links } = useSelector((state) => state.links);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {links?.map((link) => {
        // Add shortUrl to each link for display
        const linkWithUrl = {
          ...link,
          shortUrl: typeof window !== 'undefined' 
            ? `${window.location.origin}/${link.slug}`
            : `/${link.slug}`,
        };
        return (
          <LinkCard
            key={link._id || link.slug}
            link={linkWithUrl}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}

