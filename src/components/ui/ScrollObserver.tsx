import { Grid, CircularProgress } from '@mui/material';
import { useEffect, useRef } from 'react';

type Props = {
  onIntersect: () => Promise<void>;
  isActiveObserver: boolean;
};

const ScrollObserver = (props: Props) => {
  const { onIntersect, isActiveObserver } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let observerRefValue: HTMLDivElement | null = null;
    if (ref.current === null) return undefined;
    observerRefValue = ref.current;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === ref.current && entry.isIntersecting) onIntersect();
      });
    });
    observer.observe(ref.current);
    return () => {
      if (observerRefValue) {
        observer.unobserve(observerRefValue);
      }
    };
  }, [onIntersect]);

  return isActiveObserver ? (
    <Grid ref={ref} container justifyContent="center">
      <CircularProgress />
    </Grid>
  ) : null;
};

export default ScrollObserver;
