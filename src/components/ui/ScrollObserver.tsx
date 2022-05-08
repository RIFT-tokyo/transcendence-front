import { Grid, CircularProgress } from '@mui/material';
import { memo, useEffect, useRef } from 'react';

type Props = {
  onIntersect: () => Promise<void>;
  isActiveObserver: boolean;
};

const ScrollObserver = memo((props: Props) => {
  const { onIntersect, isActiveObserver } = props;
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current === null) return;
    const observer = new IntersectionObserver(
      (
        entries: IntersectionObserverEntry[],
        _observer: IntersectionObserver,
      ) => {
        if (entries[0].intersectionRatio >= 1) {
          _observer.disconnect();
          onIntersect();
        }
      },
    );
    observer.observe(ref.current);
  }, [onIntersect]);

  return isActiveObserver ? (
    <Grid ref={ref} container justifyContent="center">
      <CircularProgress />
    </Grid>
  ) : null;
});

export default ScrollObserver;
