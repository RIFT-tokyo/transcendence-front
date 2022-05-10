import { Grid, CircularProgress } from '@mui/material';
import { useEffect, useRef } from 'react';

type Props = {
  onIntersect: () => Promise<void>;
  isActiveObserver: boolean;
};

const ScrollObserver = (props: Props) => {
  const { onIntersect, isActiveObserver } = props;
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current === null) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    });
    observer.observe(ref.current);
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
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
