import {useState} from 'react';

export const usePagination = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const resetPagination = () => {
    setPageNumber(1);
    setHasMore(true);
  };

  return {
    pageNumber,
    pageSize,
    hasMore,
    setPageNumber,
    setHasMore,
    resetPagination,
  };
};
