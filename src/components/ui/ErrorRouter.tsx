import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { INTERNAL_SERVER_ERROR_URL, NOT_FOUND_URL } from '../config/constants';

type Props = {
  statusCode: number;
  children: React.ReactNode;
};

const ErrorRouter: React.VFC<Props> = ({ statusCode, children }: Props) => {
  switch (statusCode) {
    case 0:
      return <div>{children}</div>;
    case 404:
      return <Navigate to={NOT_FOUND_URL} replace />;
    case 500:
      return <Navigate to={INTERNAL_SERVER_ERROR_URL} replace />;
    default:
      return <div>Unknown Status Code: {statusCode}</div>;
  }
};

export default ErrorRouter;
